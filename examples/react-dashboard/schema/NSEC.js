cube(`NSEC`, {
  sql: `SELECT idx,customer, machine, scrip,
  servertime,cast((text1->>'$.firewallstatus') AS UNSIGNED INTEGER) as 'firewallstatus',
  cast((text1->>'$.totalav') AS UNSIGNED INTEGER) as 'avstatus',
  text3->>'$.avupdatests' AS 'AvUpdateStatus',
  clientversion as clientversion
  from  event.Events
  where scrip  = 263
  and ${USER_CONTEXT.machine.filter('machine')}`,
  title:  `Firewall Status`,
  description: `Firewall Status`,

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
    //cast((text1->>'$.firewallstatus') AS UNSIGNED INTEGER) = 0
    statuscount: {
        sql: `machine`,
        type: `countDistinct`,
        drillMembers: [site,machine,os],
        title: `Count`
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
       machine: {
           sql: `machine`,
           type: `string`,
           title: `Machine`
       },
       firewallstatus: {
         sql: `firewallstatus`,
         type: `string`,
         title: `Firewall Status`
       },

       // firewallstatus = 1 enabled, firewallstatus = 0 not Enabled

       avtype: {
         sql: `avstatus`,
         type: `string`,
         title: `Anti-virus Type`
       },

       // avstatus > 1 - commercial AV
       // avstatus <= 1 - No commercial AV

       AVUpdate: {
         sql: `AvUpdateStatus`,
         type: `string`,
         title: `Anti-virus Update Status`
       },

       // AvUpdateStatus ='Upto Date'

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
             measureReferences: [statuscount],
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
             measureReferences: [statuscount],
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
             measureReferences: [statuscount],
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
             measureReferences: [statuscount],
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
