cube(`A59`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.administratorpasswordstatus' as 'administratorpasswordstatus',
   value->>'$.frontpanelresetstatus' as 'frontpanelresetstatus',
   value->>'$.keyboardpasswordstatus' as 'keyboardpasswordstatus',
   value->>'$."power-onpasswordstatus"' as 'power',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =59`,
 title:  `Hardware Security`,
 description: `Hardware Security`,

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
    machine:{
              sql: `machine`,
              type: `string`,
              title: `Device`
          },
    LatestDate:{
        sql: `slatest`,
        type: `time`,
        title: `Latest Date`
        },


administratorpasswordstatus: {
        sql: `administratorpasswordstatus`,
        type: `string`,
        title: `Admin Password Status`
    },


frontpanelresetstatus: {
    sql: `frontpanelresetstatus`,
    type: `string`,
    title: `Panel reset Status`
},


keyboardpasswordstatus: {
sql: `keyboardpasswordstatus`,
type: `string`,
title: `Keyboard Password Status`
},


power: {
sql: `power-onpasswordstatus`,
type: `string`,
title: `Power On Password Status`
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

