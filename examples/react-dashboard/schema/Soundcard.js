cube(`A67`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.soundcardproductname' as 'soundcardproductname',
   value->>'$.soundcardmanufacturer' as 'soundcardmanufacturer',
   value->>'$.soundcarddescription' as 'soundcarddescription',
   value->>'$.soundcardstatus' as 'soundcardstatus',
   value->>'$.soundcarddriverfilename' as 'soundcarddriverfilename',
   value->>'$.soundcarddriverlastmodified' as 'soundcarddriverlastmodified',
   value->>'$.soundcarddriverversion' as 'soundcarddriverversion',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =67`,
 title:  `Sound Card Information `,
 description: `Sound Card Information `,

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



    soundcardproductname: {
          sql: `soundcardproductname`,
          type: `string`,
          title: `Product Name`
      },
    soundcardmanufacturer: {
          sql: `soundcardmanufacturer`,
          type: `string`,
          title: `Manufacturer`
      },
    soundcarddescription: {
          sql: `soundcarddescription`,
          type: `string`,
          title: `Description`
      },
    soundcardstatus: {
          sql: `soundcardstatus`,
          type: `string`,
          title: `Status`
      },
    soundcarddriverfilename: {
          sql: `soundcarddriverfilename`,
          type: `string`,
          title: `Driver Name`
      },
    soundcarddriverlastmodified: {
          sql: `soundcarddriverlastmodified`,
          type: `string`,
          title: `Last Modified`
      },
    soundcarddriverversion: {
          sql: `soundcarddriverversion`,
          type: `string`,
          title: `Driver Version`
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

