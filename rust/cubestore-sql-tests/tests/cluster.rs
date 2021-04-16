//! Runs the SQL tests with a cluster that consists of 1 router and 2 select workers.
//! Note that each worker will also spawns 2 subprocesses for actual processing.
use cubestore::config::Config;
use cubestore_sql_tests::run_sql_tests;
use serde_derive::{Deserialize, Serialize};
use std::fmt::Debug;
use tokio::runtime::Builder;
use tokio::time::Duration;

#[cfg(not(target_os = "windows"))]
fn main() {
    // Prepare workers.
    Config::configure_worker_services();
    procspawn::init(); // TODO: logs in worker processes.

    const METASTORE_PORT: u16 = 51336;
    const WORKER_PORTS: [u16; 2] = [51337, 51338];

    // We run only 1 test in parallel to avoid using the ports concurrently.
    run_sql_tests(
        "cluster",
        vec!["--test-threads=1".to_string()],
        |test_name, test_fn| {
            // Add a suffix to avoid clashes with other configurations run concurrently.
            // TODO: run each test in unique temp folder.
            let test_name = test_name.to_owned() + "-cluster";

            // Start worker processes. Each process sends an empty IPC message to indicate it is ready.
            let (sender, receiver) = ipc_channel::ipc::bytes_channel().unwrap();
            let mut kill_workers = Vec::with_capacity(WORKER_PORTS.len());
            for i in 0..2 {
                let args = WorkerArgs {
                    sender: sender.clone(),
                    test_name: test_name.clone(),
                    id: i,
                };
                let handle = procspawn::spawn(
                    args,
                    |WorkerArgs {
                         sender,
                         test_name,
                         id,
                     }| {
                        let r = Builder::new_current_thread().enable_all().build().unwrap();
                        r.block_on(async move {
                            // Note that Rust's libtest does not consume output in subprocesses.
                            // Disable logs to keep output compact.
                            if !std::env::var("CUBESTORE_TEST_LOG_WORKER").is_ok() {
                                *cubestore::config::TEST_LOGGING_INITIALIZED.write().await = true;
                            }
                            Config::test(&test_name)
                                .update_config(|mut c| {
                                    c.select_worker_pool_size = 2;
                                    c.server_name = format!("localhost:{}", WORKER_PORTS[id]);
                                    c.worker_bind_address = Some(c.server_name.clone());
                                    c.metastore_remote_address =
                                        Some(format!("localhost:{}", METASTORE_PORT));
                                    c
                                })
                                .start_test_worker(|_| async move {
                                    sender.send(&[]).unwrap();
                                    tokio::time::sleep(Duration::from_secs(120)).await;
                                    eprintln!("ERROR: Stopping worker after timeout");
                                })
                                .await
                        });
                    },
                );
                kill_workers.push(scopeguard::guard(handle, |mut h| ack_error(h.kill())))
            }

            let r = Runtime::wrap(Builder::new_current_thread().enable_all().build().unwrap());
            r.inner().block_on(async move {
                // Wait until the workers are ready.
                tokio::time::timeout(Duration::from_secs(4), async move {
                    let mut receiver = receiver;
                    for _ in 0..2 as usize {
                        receiver = tokio::task::spawn_blocking(move || {
                            receiver.recv().unwrap();
                            receiver
                        })
                        .await
                        .unwrap();
                    }
                })
                .await
                .expect("starting the processes took too long");

                // Finally start the main node and run the tests.
                Config::test(&test_name)
                    .update_config(|mut c| {
                        c.server_name = format!("localhost:{}", METASTORE_PORT);
                        c.metastore_bind_address = Some(c.server_name.clone());
                        c.select_workers = WORKER_PORTS
                            .iter()
                            .map(|p| format!("localhost:{}", p))
                            .collect();
                        c
                    })
                    .start_test(|services| async move {
                        test_fn(Box::new(services.sql_service)).await;
                    })
                    .await;
            });
        },
    );
}

fn ack_error<R, E: Debug>(r: Result<R, E>) -> () {
    if let Err(e) = r {
        eprintln!("Error: {:?}", e);
    }
}

struct Runtime {
    rt: Option<tokio::runtime::Runtime>,
}

// Ensures we do not wait indefinitely for blocking tasks on drop. Especially important for tests.
impl Runtime {
    fn inner(&self) -> &tokio::runtime::Runtime {
        self.rt.as_ref().unwrap()
    }

    fn wrap(rt: tokio::runtime::Runtime) -> Runtime {
        Runtime { rt: Some(rt) }
    }
}

impl Drop for Runtime {
    fn drop(&mut self) {
        if let Some(rt) = self.rt.take() {
            rt.shutdown_background()
        }
    }
}

#[derive(Serialize, Deserialize)]
struct WorkerArgs {
    sender: ipc_channel::ipc::IpcBytesSender,
    test_name: String,
    id: usize,
}

#[cfg(target_os = "windows")]
fn main() {
    // We do not procspawn on Windows.
}
