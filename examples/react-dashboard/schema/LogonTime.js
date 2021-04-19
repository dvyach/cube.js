cube(`LT`, {
  sql: `  select idx,scrip,customer,machine,username, servertime,
    round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000) AS 'metric',
    LAG(round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000/60),1,round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000/60))
    over (PARTITION by machine order by servertime) as 'last',
    (round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000/60) -
    LAG(round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000/60),1,round(cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED)/1000/60))
    over (PARTITION by machine order by servertime)) as 'change',
    '' AS 'other',
    'LogonTime' as 'metricname'
    from event.Events
    where scrip  = 31 and text1->>'$.systemuserlogontimeinmsec' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `System Logon Time`,
  description: `System Logon Time`,
  joins: {

     },
    measures:{
    // use LogonTime is not null when viz is created

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
