cube(`A54`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.slotdesignation' as 'slotdesignation',
   value->>'$.slottype' as 'slottype',
   value->>'$.busaddress' as 'busaddress',
   value->>'$.currentusage' as 'currentusage',
   value->>'$.slotlength' as 'slotlength',
   value->>'$.slotid' as 'slotid',
   value->>'$.slotcharacteristics' as 'slotcharacteristics',
   value->>'$.slotcharacteristics1' as 'slotcharacteristics1',
   value->>'$.slotcharacteristics2' as 'slotcharacteristics2',
   value->>'$.slotcharacteristics3' as 'slotcharacteristics3',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =54`,
 title:  `System Slot Information`,
 description: `System Slot Information`,
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


slotdesignation: {
        sql: `slotdesignation`,
        type: `string`,
        title: `Slot Designation`
    },


slottype: {
    sql: `slottype`,
    type: `string`,
    title: `Type`
},


busaddress: {
sql: `busaddress`,
type: `string`,
title: `Bus Address`
},


currentusage: {
sql: `currentusage`,
type: `string`,
title: `Current Usage`
},


slotlength: {
sql: `slotlength`,
type: `string`,
title: `Slot Length`
},


slotid: {
sql: `slotid`,
type: `string`,
title: `Slot ID`
},


slotcharacteristics: {
sql: `slotcharacteristics`,
type: `string`,
title: `Slot Characteristics`
},


slotcharacteristics1: {
sql: `slotcharacteristics1`,
type: `string`,
title: `Slot Characteristics1`
},

slotcharacteristics2: {
sql: `slotcharacteristics2`,
type: `string`,
title: `Slot Characteristics2`
},

slotcharacteristics3: {
sql: `slotcharacteristics3`,
type: `string`,
title: `Slot Characteristics3`
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

