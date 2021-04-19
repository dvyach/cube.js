cube(`assetapp`, {
    sql: `select max(from_unixtime(A.slatest,'%Y-%m-%d')) as slatest,
   value->>'$.installedsoftwarenames' as 'installedsoftwarenames',
   value->>'$.version' as 'version',
       M.cust as cust, C.host,
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =36
 group by M.Cust, A.machineid`,

 joins: {

     },

     measures: {
     DeviceCount: {
         type: `countDistinct`,
         sql: `machine`,
         title: `Device Count `,
         }
       },
       dimensions:{
        site: {
            sql: `cust`,
            type: `string`,
            title: `Site`
        },

         installedsoftwarenames: {
             sql: `installedsoftwarenames`,
             type: `string`,
             title: `Software Name`
         },
         version: {
             sql: `version`,
             type: `string`,
             title: `Version`
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

