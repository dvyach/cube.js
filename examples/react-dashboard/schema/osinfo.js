cube(`A16`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
    A.machineid as 'machineid',
   value->>'$.ntproducttype' as 'producttype',
   value->>'$.operatingsystem' as 'operatingsystem',
   value->>'$.osversionnumber' as 'osversion',
value->>'$.ntinstalledservicepack'  as 'servicepack',
    M.cust  as cust, C.host,
    M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =16
 group by M.Cust, A.machineid`,

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
        mid:{
         sql: `machineid`,
          type: `number`,
          primaryKey: true
         },
        site: {
            sql: `cust`,
            type: `string`,
            title: `Site`
        },
        producttype: {
            sql: `producttype`,
            type: `string`,
            title: `Product Type`
        },
        osversion: {
            sql: `osversion`,
            type: `string`,
            title: `Os Version`
        },
        operatingsystem: {
            sql: `operatingsystem`,
            type: `string`,
            title: `Operating System`
        },
        servicepack: {
            sql: `servicepack`,
            type: `string`,
            title: `Service Pack`
        },
        LDate:{
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

