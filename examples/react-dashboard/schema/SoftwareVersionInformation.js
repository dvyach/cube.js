cube(`A50`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.productname' as 'productname',
   value->>'$.processversion' as 'processversion',
   value->>'$.filedescription' as 'filedescription',
   value->>'$.companyname' as 'companyname',
   value->>'$.legalcopyright' as 'legalcopyright',
   value->>'$.productversion' as 'productversion',
   value->>'$.processsize' as 'processsize',
   value->>'$.processcreationdate' as 'processcreationdate',
   value->>'$.processfilename' as 'processfilename',
   value->>'$.comments' as 'comments',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =50`,
 title:  `Version Information `,
 description: `Software Version Information `,

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

    productname: {
          sql: `productname`,
          type: `string`,
          title: `Product Name`
      },
    processversion: {
          sql: `processversion`,
          type: `string`,
          title: `Process Version`
      },
    filedescription: {
          sql: `filedescription`,
          type: `string`,
          title: `Description`
      },
    companyname: {
          sql: `companyname`,
          type: `string`,
          title: `Company`
      },
    legalcopyright: {
          sql: `legalcopyright`,
          type: `string`,
          title: `Copyright`
      },
    productversion: {
          sql: `productversion`,
          type: `string`,
          title: `Version`
      },
    processsize: {
          sql: `processsize`,
          type: `string`,
          title: `Process Size`
      },
    processcreationdate: {
          sql: `processcreationdate`,
          type: `string`,
          title: `Process Creation Date`
      },
    processfilename: {
          sql: `processfilename`,
          type: `string`,
          title: `Process name`
      },
    comments: {
          sql: `comments`,
          type: `string`,
          title: `Comments`
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

