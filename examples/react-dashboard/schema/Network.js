cube(`Network`, {
  sql: `SELECT idx,scrip,customer,machine,username, servertime,
       cast((text1->>'$.InVal') AS UNSIGNED INTEGER) AS 'InTraffic',
       cast((text1->>'$.OutVal') AS UNSIGNED INTEGER) AS 'OutTraffic',
       text1->>'$.ProcessName' as "ProcessName",
       clientversion as clientversion
      from event.Events
      where scrip  = 274 and text1->>'$.ProcessName' is not null
      and ${USER_CONTEXT.machine.filter('machine')}`,
      title:  `Network Utilization`,
      description: `Network Utilization`,

      joins: {
           CA:{
               relationship: 'belongsTo',
               sql: `${CA}.site = {CUBE}.customer and ${CA}.host = ${CUBE}.machine`
            },
            GA:{
                    relationship: 'belongsTo',
                    sql: `${GA}.host = ${CUBE}.machine`
                 }
         },
    measures:{

    InTraffic: {
        type: `avg`,
        sql: `InTraffic`,
        drillMembers: [machine,InTraffic,OutTraffic,stime],
        title: `Incoming Traffic `,
        },
    OutTraffic: {
      type: `avg`,
      sql: `OutTraffic`,
      title: `Outgoing Traffic `
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
       ProcessName: {
         sql: `ProcessName`,
         type: `string`,
         title: `Process`
       },
       os: {
         sql: `${CA}.os`,
         type: `string`,
         title: `Operating System`
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
       machine: {
           sql: `machine`,
           type: `string`,
           title: `Machine`
       },
       username: {
           sql: `username`,
           type: `string`,
           title: `Username`
        },
        stime: {
          type: `time`,
          sql: `from_unixtime(servertime,'%Y-%m-%d %H:%i:%s')`,
          title: `string`,
        },
        dtime: {
            sql: `from_unixtime(servertime,'%Y-%m-%d %H:%i:%s')`,
            type: `time`,
            title: `Time`
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
               columns: ['machine']
               }
             }
           },
           MHour:{
             type: `rollup`,
             measureReferences: [InTraffic,OutTraffic],
             dimensionReferences: [machine],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [machine],
               }
             }
           },
           SHour:{
             type: `rollup`,
             measureReferences: [InTraffic,OutTraffic],
             dimensionReferences: [site],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [site],
               }
             }
           },
           GHour:{
             type: `rollup`,
             measureReferences: [InTraffic,OutTraffic],
             dimensionReferences: [group],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [group],
               }
             }
           },
           OHour:{
             type: `rollup`,
             measureReferences: [InTraffic,OutTraffic],
             dimensionReferences: [os],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             }
           }
           }
 });
