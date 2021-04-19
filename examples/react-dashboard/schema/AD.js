cube(`ad`, {
    sql: `select max(from_unixtime(A.slatest,'%Y-%m-%d')) as slatest,
   M.cust as cust, C.host as host,
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =2 and (value->>'$.cn' ='' and value->>'$.ou'= '')
 group by M.Cust, A.machineid`,
 title:  `Devices not in AD`,
 description: `Devices not in AD`,

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
        device: {
            sql: `host`,
            type: `string`,
            title: `Device`
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

