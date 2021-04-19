cube(`NOP`, {
  sql: `select idx,scrip,customer,machine,username, servertime,
  cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED) AS 'metric',
  LAG(round(cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED)),1,round(cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED)))
  over (PARTITION by machine order by servertime) as 'last',
  (round(cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED)) -
  LAG(round(cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED)),1,round(cast((text1->>'$.NumberOfProcessesRunning') AS SIGNED)))
  over (PARTITION by machine order by servertime)) as 'change',
  '' AS 'other',
  'NumberOfProcess' as 'metricname'
 from event.Events
  where Events.scrip = 93 and text1->>'$.NumberOfProcessesRunning' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `Process Analysis`,
  description: `Process Analysis`,

  joins: {

     },
    measures:{
      // NumberOfProcess is not null should be filtered when the viz is created

    },
      dimensions:{
       idx:{
           sql: `idx`,
           type: `number`,
           primaryKey: true
       }

        },
        preAggregations:{


            }
  });
