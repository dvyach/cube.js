cube(`AHang`, {
  sql: `select idx,scrip,customer,machine,username,servertime,
  text1->>'$.event_data.param1'  AS 'ApplicationHanging',
  cast((text1->>'$.event_id') as unsigned integer) as 'eventid',
  text1->>'$.level' as 'ErrorLevel',
  clientversion as clientversion
  from  event.Events
  where scrip  = 77
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `System Log Analysis`,
  description: `System Log Analysis`,

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

    // eventid=1002 for hanging application and 1003 for BSOD  as filter when viz is created
    // ErrorLevel is 'Error' or 'Critical' for number of crashes when Viz is created

    NoOfCrashes: {
        sql: `idx`,
        type: `countDistinct`,
        drillMembers: [machine,application,stime,NoOfCrashes,],
        title: `No of Disruptions`,
       }
     },
      dimensions:{
       idx:{
           sql: `idx`,
           type: `number`,
           primaryKey: true
       },
       eventid: {
           sql: `eventid`,
           type: `number`,
           title: `ID`
       },
       application: {
         sql: `ApplicationHanging`,
         type: `string`,
         title: `Application`
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
       machine: {
           sql: `machine`,
           type: `string`,
           title: `Machine`
       },
       os: {
         sql: `${CA}.os`,
         type: `string`,
         title: `Operating System`
       },
       username: {
           sql: `username`,
           type: `string`,
           title: `Username`
        },
        stime: {
          type: `time`,
          sql: `servertime`,
          title: `Time`,
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
             measureReferences: [NoOfCrashes],
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
             measureReferences: [NoOfCrashes],
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
             measureReferences: [NoOfCrashes],
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
             measureReferences: [NoOfCrashes],
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
