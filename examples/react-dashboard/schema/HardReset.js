cube(`HR`, {
  sql: `select idx,scrip,customer,machine,username,servertime,text4
  from event.Events as A
  where scrip  = 31
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `Hard Resets`,
  description: `Hard Resets`,

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

    // filter for and text4 is not null when viz is created

    NoOfReset: {
        sql: `idx`,
        type: `countDistinct`,
        drillMembers: [machine,stime,NoOfReset],
        title: `No of Resets`
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
         sql: `${CA}.os`,
         type: `string`,
         title: `Operating System`
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
             measureReferences: [NoOfReset],
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
             measureReferences: [NoOfReset],
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
             measureReferences: [NoOfReset],
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
             measureReferences: [NoOfReset],
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
