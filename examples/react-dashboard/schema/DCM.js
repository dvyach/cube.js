cube(`DCMR`, {
	sql: `select idx,scrip,customer,machine,username,servertime as 'stime',
  cast((text1->>'$.AverageQueueLength') AS SIGNED) AS 'AverageQueueLength',
  cast((text1->>'$.PercentUtilization') AS SIGNED) AS 'PercentUtilization',
  cast((text1->>'$.mSecSamplingPeriod') AS SIGNED) AS 'mSecSampling',
  cast((text1->>'$.InterruptRatePerSecond') AS SIGNED) AS 'InterruptRate',
  cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED) AS 'NoProcess',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 96 and text1->>'$.PercentUtilization' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `CPU Utilization`,
	description: `CPU Utilization`,

	joins: {
		CA: {
			relationship: 'belongsTo',
			sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
		},
		GA: {
			relationship: 'belongsTo',
			sql: `${GA}.host = ${CUBE}.machine`
		}
	},
	measures: {
		AverageQueueLength: {
			type: `avg`,
			sql: `AverageQueueLength`,
			title: `Queue Length`
		},

		PercentUtilization: {
			type: `avg`,
			sql: `PercentUtilization`,
			title: `CPU Utilization%`
		},
		mSecSampling: {
			type: `avg`,
			sql: `mSecSampling`,
			title: `Sampling Frequency`
		},
		InterruptRate: {
			type: `avg`,
			sql: `InterruptRate`,
			title: `Interrupt Rate`
		},
		NoProcess: {
			type: `avg`,
			sql: `NoProcess`,
			title: `No of Process`
		}
	},
	dimensions: {
		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true
		},

		site: {
			sql: `customer`,
			type: `string`,
			title: `Site`
		},
		machine: {
			sql: `machine`,
			type: `string`,
			title: `Device`
		},
		group: {
			case: {
				when: [{
					sql: `${GA}.name is null`,
					label: `Un-Grouped`
				}, ],
				else: {
					label: {
						sql: `${GA}.name`
					}
				}
			},
			type: `string`,
			title: `Group`
		},
		os: {
			sql: `os`,
			type: `string`,
			title: `Operating System`
		},
		username: {
			sql: `username`,
			type: `string`,
			title: `Device User`
		},
		clientver: {
			sql: `clientversion`,
			type: `string`,
			title: `Version`
		},
		ETime: {
			type: `time`,
			sql: `from_unixtime(stime,'%Y-%m-%d %H:%i:%s')`,
			title: `Converted Time`
		}
	},
	preAggregations: {
		main: {
			type: `originalSql`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
			},
			indexes: {
				machs: {
					columns: ['customer', 'machine']
				},
				et: {
					columns: ['stime']
				}
			}
		},
    //G1 Consumption Device - CPU Use % Trend
		CDCUT: {
			type: `rollup`,
			measureReferences: [PercentUtilization],
			dimensionReferences: [machine],
			timeDimensionReference: ETime,
			granularity: `minute`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `week`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [ETime],
				}
			}
		},
    //G1 Consumption Device - CPU Use Average Snapshot
    CUAS: {
			type: `rollup`,
			measureReferences: [PercentUtilization],
			timeDimensionReference: ETime,
			granularity: `minute`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `week`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [ETime],
				}
			}
		}
	}
});