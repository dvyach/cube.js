cube(`PCPU`, {
  sql: `select idx,scrip,customer,machine,username, servertime,
  cast((text3->>'$.ProcessCPU') AS SIGNED) AS 'metric',
  LAG(round(cast((text3->>'$.ProcessCPU') AS SIGNED)),1,round(cast((text3->>'$.ProcessCPU') AS SIGNED)))
  over (PARTITION by machine order by servertime) as 'last',
  (round(cast((text3->>'$.ProcessCPU') AS SIGNED)) -
  LAG(round(cast((text3->>'$.ProcessCPU') AS SIGNED)),1,round(cast((text3->>'$.ProcessCPU') AS SIGNED)))
  over (PARTITION by machine order by servertime)) as 'change',
  text3->>'$.ProcessImageName' AS 'other',
  'ProcessCPU' as 'metricname'
  from event.Events
  where scrip  = 96 and text3->>'$.ProcessImageName' is not null
  and ${USER_CONTEXT.machine.filter('machine')} `,
  title:  `Process CPU Utilzation`,
  description: `Process CPU Utilzation`,

  joins: {

     },
    measures:{

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
