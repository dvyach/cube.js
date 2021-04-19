cube(`A18`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.maximumcapacityingb' as 'maximumcapacityingb',
   A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =18`,
 title:  `Physical Memory Array `,
 description: `Physical Memory Array `,

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
        maximumcapacityingb: {
            sql: `maximumcapacityingb`,
            type: `string`,
            title: `Max Size`
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

