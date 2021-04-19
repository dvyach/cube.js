cube(`A47`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.printername' as 'printername',
   value->>'$.printerdefault' as 'printerdefault',
   value->>'$.printerlocal' as 'printerlocal',
   value->>'$.printernetwork' as 'printernetwork',
   value->>'$.printerportname' as 'printerportname',
   value->>'$.printerprintjobdatatype' as 'printerprintjobdatatype',
   value->>'$.printerprintprocessor' as 'printerprintprocessor',
   value->>'$.printershared' as 'printershared',
   value->>'$.printersharename' as 'printersharename',
   value->>'$.printerdriverfilename' as 'printerdriverfilename',
   value->>'$.printerdriverlastmodified' as 'printerdriverlastmodified',
   value->>'$.printerdriverversion' as 'printerdriverversion',
   value->>'$.printercomment' as 'printercomment',
   value->>'$.printeroemurl' as 'printeroemurl',
   value->>'$.printersystemname' as 'printersystemname',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =47`,
 title:  `Printer Information `,
 description: `Printer Information `,

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
   printername: {
          sql: `printername`,
          type: `string`,
          title: `Printer Name`
      },
    printerdefault: {
          sql: `printerdefault`,
          type: `string`,
          title: `Printer Default`
      },
    printerlocal: {
          sql: `printerlocal`,
          type: `string`,
          title: `Printer Local`
      },
    printernetwork: {
          sql: `printernetwork`,
          type: `string`,
          title: `Printer Network`
      },
    printerportname: {
          sql: `printerportname`,
          type: `string`,
          title: `port Name`
      },
    printerprintjobdatatype: {
          sql: `printerprintjobdatatype`,
          type: `string`,
          title: `Data type`
      },
    printerprintprocessor: {
          sql: `printerprintprocessor`,
          type: `string`,
          title: `Print Processor`
      },
    printershared: {
          sql: `printershared`,
          type: `string`,
          title: `Shared Printer`
      },
    printersharename: {
          sql: `printersharename`,
          type: `string`,
          title: `Share Name`
      },
    printerdriverfilename: {
          sql: `printerdriverfilename`,
          type: `string`,
          title: `Driver filename`
      },
    printerdriverlastmodified: {
          sql: `printerdriverlastmodified`,
          type: `string`,
          title: `Last Modified`
      },
    printerdriverversion: {
          sql: `printerdriverversion`,
          type: `string`,
          title: `Driver Version`
      },
    printercomment: {
          sql: `printercomment`,
          type: `string`,
          title: `Comment`
      },
    printeroemurl: {
          sql: `printeroemurl`,
          type: `string`,
          title: `OEM URL`
      },
    printersystemname: {
          sql: `printersystemname`,
          type: `string`,
          title: `Syste Name`
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

