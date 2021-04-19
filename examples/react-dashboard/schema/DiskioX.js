
cube(`DIO`, {
  sql: `SELECT idx,scrip,customer,machine,username, servertime,
         cast((text1->>'$.realtimediskiopercentage') AS SIGNED) AS 'metric',
         LAG(cast((text1->>'$.realtimediskiopercentage') AS SIGNED),1,cast((text1->>'$.realtimediskiopercentage') AS SIGNED))
         over (PARTITION by machine order by servertime) as 'last',
         (cast((text1->>'$.realtimediskiopercentage') AS SIGNED) -
         LAG(cast((text1->>'$.realtimediskiopercentage') AS SIGNED),1,cast((text1->>'$.realtimediskiopercentage') AS SIGNED))
         over (PARTITION by machine order by servertime)) as 'change',
         '' AS 'other',
         'DiskIOPercentage' as 'metricname'
        from event.Events
        where scrip  = 97 and text1->>'$.realtimediskiopercentage' is not null
        and ${USER_CONTEXT.machine.filter('machine')}`,
        title:  `DiskIO Performance`,
        description: `DiskIO Performance`,
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
