cube(`DCM`, {
  sql: `select idx,scrip,customer,machine,username,servertime,
 cast((text1->>'$.PercentUtilization') AS SIGNED) AS 'metric',
 LAG(cast((text1->>'$.PercentUtilization') AS SIGNED),1,cast((text1->>'$.PercentUtilization') AS SIGNED))
 over (PARTITION by machine order by servertime) as 'last',
((cast((text1->>'$.PercentUtilization') AS SIGNED)) -
 (LAG(cast((text1->>'$.PercentUtilization') AS SIGNED),1,cast((text1->>'$.PercentUtilization') AS SIGNED))
 over (PARTITION by machine order by servertime))) as 'change',
 '' AS 'other',
 'CPUPercentUtilization' as 'metricname'
  from event.Events
 where scrip = 96 and text1->>'$.PercentUtilization' is not null
and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `CPU Utilization`,
  description: `CPU Utilization`,

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
