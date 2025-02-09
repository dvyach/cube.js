cube(`A21`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.timezone' as 'timezone',
   value->>'$.username' as 'username',
   value->>'$.machinename' as 'machinename',
   A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =21`,
 title:  `System Properties`,
 description: `System Properties`,

 joins: {
 GA:{
   relationship: 'belongsTo',
   sql: `${GA}.host = ${CUBE}.machine`
   }
     },

     measures: {
     DeviceCount: {
         type: `count`,
         sql: `count`,
         title: `Device Count `,
         },
         maxDateCreated: {
          type: `max`,
          sql: `slatest`,
          title:`Maximum created`
        }
       },
       dimensions:{
         id:{
              sql: `id`,
              type: `number`,
              primaryKey: true
          },
       machine:{
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
        site: {
            sql: `cust`,
            type: `string`,
            title: `Site`
        },
        timezone: {
            sql: `timezone`,
            type: `string`,
            title: `Time Zone`
        },
        username: {
            sql: `username`,
            type: `string`,
            title: `User Name`
        },
        machinename: {
            sql: `machinename`,
            type: `string`,
            title: `Host Name`
        },
        LatestDate:{
        sql: `slatest`,
        type: `time`,
        title: `Latest Date`
        }
      },
      preAggregations:{
       main: {
         type: `originalSql`,
         refreshKey: {
         every: `1 hour`
         },
       }
       }
     });

