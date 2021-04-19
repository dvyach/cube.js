cube(`BT`, {
  sql: `select idx,scrip,customer,machine,username, servertime,
  round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000) AS 'metric',
  LAG(round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000),1,round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000))
  over (PARTITION by machine order by servertime) as 'last',
  (round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000) -
  LAG(round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000),1,round(cast((text1->>'$.systemboottimeinmsec') AS SIGNED)/1000))
  over (PARTITION by machine order by servertime)) as 'change',
  '' AS 'other',
  'BootTime' as 'metricname'
  from event.Events
  where scrip  = 31 and text1->>'$.systemboottimeinmsec' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `System Boot Time`,
  description: `System Boot Time`,

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
