cube(`A28`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.videocontrollername' as 'videocontrollername',
   value->>'$.videocontrollerstatus' as 'videocontrollerstatus',
   value->>'$.videocontrollerdescription' as 'videocontrollerdescription',
   value->>'$.videocontrollerdriverversion' as 'videocontrollerdriverversion',
   value->>'$.videocontrollerdriverdate' as 'videocontrollerdriverdate',
   value->>'$.videocontrolleradaptercompatibility' as 'videocontrolleradaptercompatibility',
   value->>'$.videocontrolleradapterdactype' as 'videocontrolleradapterdactype',
   value->>'$.videocontrolleradapterraminmb' as 'videocontrolleradapterraminmb',
   value->>'$.videocontrollercaption' as 'videocontrollercaption',
   value->>'$.videocontrollerinstalleddisplaydrivers' as 'videocontrollerinstalleddisplaydrivers',
   value->>'$.videocontrollervideomodedescription' as 'videocontrollervideomodedescription',
   value->>'$.videocontrollervideoprocessor' as 'videocontrollervideoprocessor',
   value->>'$.videocontrollercurrentrefreshrate' as 'videocontrollercurrentrefreshrate',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =28`,
 title:  `Video Controller Information `,
 description: `Video Controller Information `,

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



    videocontrollername: {
          sql: `videocontrollername`,
          type: `string`,
          title: `Name`
      },

  videocontrollerstatus: {
        sql: `videocontrollerstatus`,
        type: `string`,
        title: `Status`
    },

videocontrollerdescription: {
      sql: `videocontrollerdescription`,
      type: `string`,
      title: `Description`
  },

  videocontrollerdriverversion: {
        sql: `videocontrollerdriverversion`,
        type: `string`,
        title: `Version`
    },

videocontrollerdriverdate: {
      sql: `videocontrollerdriverdate`,
      type: `string`,
      title: `Date`
  },

videocontrolleradaptercompatibility: {
    sql: `videocontrolleradaptercompatibility`,
    type: `string`,
    title: `Compatability`
},

videocontrolleradapterdactype: {
  sql: `videocontrolleradapterdactype`,
  type: `string`,
  title: `Type`
},

videocontrolleradapterraminmb: {
  sql: `videocontrolleradapterraminmb`,
  type: `string`,
  title: `RAM in MB`
},

videocontrollercaption: {
  sql: `ocontrollercaption`,
  type: `string`,
  title: `Caption`
},

videocontrollerinstalleddisplaydrivers: {
  sql: `videocontrollerinstalleddisplaydrivers`,
  type: `string`,
  title: `Installed Display Drivers`
},

videocontrollervideomodedescription: {
  sql: `videocontrollervideomodedescription`,
  type: `string`,
  title: `Video Mode`
},

videocontrollervideoprocessor: {
  sql: `videocontrollervideoprocessor`,
  type: `string`,
  title: `Video Processor`
},

videocontrollercurrentrefreshrate: {
  sql: `videocontrollercurrentrefreshrate`,
  type: `string`,
  title: `Refresh rate`
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

