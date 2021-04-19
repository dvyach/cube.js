cube(`Procstat`, {
  sql: `select idx,scrip,customer,machine,username,servertime as stime,

  cast((text1->>'$.InterruptRatePerSecond') AS SIGNED) AS 'InterruptRatePerSecond',
  cast((text1->>'$.PercentUtilization') AS SIGNED) AS 'PercentUtilization',
  cast((text1->>'$.AverageQueueLength') AS SIGNED) AS 'AverageQueueLength',

  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 96 and text1 is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `Process Stats`,
  description: `Process Stats`,

   joins: {
     CA:{
         relationship: 'belongsTo',
         sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
      },
      GA:{
              relationship: 'belongsTo',
              sql: `${GA}.host = ${CUBE}.machine`
           },
    },

    measures:{
    InterruptRatePerSecond :{
      type: `avg`,
      sql: `InterruptRatePerSecond `,
      title: `Interrupt Rate Per Second `
    },
    PercentUtilization:{
       type: `avg`,
       sql: `PercentUtilization`,
       title: `% Utilization`
     },
     AverageQueueLength:{
        type: `avg`,
        sql: `AverageQueueLength`,
        title: `Average Queue Length`
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
           measureReferences: [InterruptRatePerSecond,PercentUtilization,AverageQueueLength],
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
           measureReferences: [InterruptRatePerSecond,PercentUtilization,AverageQueueLength],
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
           measureReferences: [InterruptRatePerSecond,PercentUtilization,AverageQueueLength],
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
           measureReferences: [InterruptRatePerSecond,PercentUtilization,AverageQueueLength],
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

