cube(`DU`, {
  sql: `select idx,scrip,customer,machine,username,servertime,
  cast((text1->>'$.percentageused') AS SIGNED) AS 'metric',
  LAG(cast((text1->>'$.percentageused') AS SIGNED),1,cast((text1->>'$.percentageused') AS SIGNED))
  over (PARTITION by machine order by servertime) as 'last',
  ((cast((text1->>'$.percentageused') AS SIGNED)) -
  (LAG(cast((text1->>'$.percentageused') AS SIGNED),1,cast((text1->>'$.percentageused') AS SIGNED))
  over (PARTITION by machine order by servertime))) as 'change',
  (text1->>'$.drive') AS 'other',
  'DiskPercentageUsed' as 'metricname'
  from event.Events
  where scrip = 95 and text1->>'$.percentageused' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `Disk Usage Analysis`,
  description: `Disk Usage Analysis`,


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
