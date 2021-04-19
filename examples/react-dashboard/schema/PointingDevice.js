cube(`A4`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.pointingdeviceinterface' as 'pointingdeviceinterface',
   value->>'$.interfacebuttons' as 'interfacebuttons',
   value->>'$.pointingdevicetype' as 'pointingdevicetype',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =4`,
 title:  `Built-in Pointing Device`,
 description: `Built-in Pointing Device`,

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


pointingdeviceinterface: {
        sql: `pointingdeviceinterface`,
        type: `string`,
        title: `Pointing Interface`
    },


interfacebuttons: {
    sql: `interfacebuttons`,
    type: `string`,
    title: `Interface Buttons`
},


pointingdevicetype: {
sql: `pointingdevicetype`,
type: `string`,
title: `Pointing Device Type`
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

