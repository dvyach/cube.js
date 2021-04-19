cube(`BTR`, {
  sql: `select idx,scrip,customer,machine,username, servertime as 'stime',
  cast((text1->>'$.systemboottimeinmsec') AS SIGNED) AS 'systemboottime',
  cast((text1->>'$.systemosloadertimeinmsec') AS SIGNED) AS 'systemosloadertime',
  cast((text1->>'$.systempostboottimeinmsec') AS SIGNED) AS 'systempostboottime',
  cast((text1->>'$.systemsmssinittimeinmsec') AS SIGNED) AS 'systemsmssinittime',
  cast((text1->>'$.systemuserlogontimeinmsec') AS SIGNED) AS 'systemuserlogontime',
  cast((text1->>'$.systemdriverinittimeinmsec') AS SIGNED) AS 'systemdriverinittime',
  cast((text1->>'$.systemkernelinittimeinmsec') AS SIGNED) AS 'systemkernelinittime',
  cast((text1->>'$.systemexplorerinittimeinmsec') AS SIGNED) AS 'systemexplorerinittime',
  cast((text1->>'$.systemuserprofileprocessingtimeinmsec') AS SIGNED) AS 'systemuserprofiletime',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip  = 31 and text1->>'$.systemboottimeinmsec' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `System Boot Time`,
  description: `System Boot Time`,

  joins: {
    CA:{
        relationship: 'belongsTo',
        sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
     },
     GA:{
             relationship: 'belongsTo',
             sql: `${GA}.host = ${CUBE}.machine`
          }
     },
    measures:{
      systemboottime:{
        type: `avg`,
        sql: `systemboottime`,
        title: `Boot Time`
      },
      systemosloadertime:{
        type: `avg`,
        sql: `systemosloadertime`,
        title: `OS Loading Time`
      },
      systempostboottime:{
        type: `avg`,
        sql: `systempostboottime`,
        title: `Post Boot Time`
      },
      systemsmssinittime:{
        type: `avg`,
        sql: `systemsmssinittime`,
        title: `Init Time`
      },
      systemkernelinittime:{
        type: `avg`,
        sql: `systemkernelinittime`,
        title: `Kernel Init Time`
      },
      systemuserlogontime:{
        type: `avg`,
        sql: `systemuserlogontime`,
        title: `User Logon Time`
      },
      systemdriverinittime:{
        type: `avg`,
        sql: `systemdriverinittime`,
        title: `Driver Init Time`
      },
      systemexplorerinittime:{
        type: `avg`,
        sql: `systemexplorerinittime`,
        title: `Explorer Init Time`
      },
      systemuserprofiletime:{
        type: `avg`,
        sql: `systemuserprofiletime`,
        title: `Profile Init Time`
      }
    },
      dimensions:{
        idx:{
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
                 when: [
                 { sql: `${GA}.name is null`, label: `Un-Grouped` },
               ],
                 else: {label: {sql: `${GA}.name`}  }
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
        preAggregations:{
          main: {
                 type: `originalSql`,
                scheduledRefresh: true,
                 refreshKey: {
                 every: `1 hour`,
               },
               indexes: {
                 machs: {
                 columns: ['customer','machine']
               },
                 et: {
                 columns: ['stime']
                 }
                }
               },
               MHour:{
                 type: `rollup`,
                 measureReferences: [systemboottime,systemosloadertime,systempostboottime,systemsmssinittime,systemuserlogontime,systemdriverinittime,systemkernelinittime,systemexplorerinittime,systemuserprofiletime],
                 dimensionReferences: [site,machine,username,clientver],
           timeDimensionReference: ETime,
                 granularity: `hour`,
                 useOriginalSqlPreAggregations: true,
                 partitionGranularity: `month`,
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
               SHour:{
                 type: `rollup`,
                 measureReferences: [systemboottime,systemosloadertime,systempostboottime,systemsmssinittime,systemuserlogontime,systemdriverinittime,systemkernelinittime,systemexplorerinittime,systemuserprofiletime],
                 dimensionReferences: [site],
                 timeDimensionReference: ETime,
                 granularity: `hour`,
                 useOriginalSqlPreAggregations: true,
                 partitionGranularity: `month`,
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
               GHour:{
                 type: `rollup`,
                 measureReferences: [systemboottime,systemosloadertime,systempostboottime,systemsmssinittime,systemuserlogontime,systemdriverinittime,systemkernelinittime,systemexplorerinittime,systemuserprofiletime],
                 dimensionReferences: [group],
                 timeDimensionReference: ETime,
                 granularity: `hour`,
                 useOriginalSqlPreAggregations: true,
                 partitionGranularity: `month`,
                 scheduledRefresh: true,
                 refreshKey: {
                   every: `1 hour`,
                   incremental: true,
                 },
                 indexes: {
                 main: {
                 columns: [ETime]
                 }
                 }
               },

               OHour:{
                 type: `rollup`,
                 measureReferences: [systemboottime,systemosloadertime,systempostboottime,systemsmssinittime,systemuserlogontime,systemdriverinittime,systemkernelinittime,systemexplorerinittime,systemuserprofiletime],
                 dimensionReferences: [os],
                 timeDimensionReference: ETime,
                 granularity: `hour`,
                 partitionGranularity: `month`,
                 useOriginalSqlPreAggregations: true,
                 scheduledRefresh: true,
                 refreshKey: {
                   every: `1 hour`,
                   incremental: true,
               },
               indexes: {
                 main: {
                 columns: [ETime]
                 }
                }
               }
            }
  });

