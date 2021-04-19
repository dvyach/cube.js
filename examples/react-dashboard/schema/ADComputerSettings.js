cube(`A1`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$."sys-dc"' as 'dc',
   value->>'$."sys-ou"' as 'ou',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =1`,
 title:  `Active Directory System Settings`,
 description: `Active Directory System Settings`,

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
         title: `Device Count `
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


  dc:{
        sql: `dc`,
        type: `string`,
        title: `System Domain Controller`
    },

ou:{
      sql: `ou`,
      type: `string`,
      title: `System Organizational Unit`
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

