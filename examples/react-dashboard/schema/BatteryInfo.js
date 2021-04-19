cube(`A19`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.batterylocation' as 'batterylocation',
   value->>'$.batterymanufacturer' as 'batterymanufacturer',
   value->>'$.batteryname' as 'batteryname',
   value->>'$.manufacturedate' as 'manufacturedate',
   value->>'$.serialnumberbattery' as 'serialnumberbattery',
   value->>'$.designcapacityinmwh' as 'designcapacityinmwh',
   value->>'$.designvoltageinmv' as 'designvoltageinmv',
   value->>'$.chemistry' as 'chemistry',
   value->>'$.sbdsmanufacturedate' as 'sbdsmanufacturedate',
   value->>'$.sbdsserialnumber' as 'sbdsserialnumber',
   value->>'$.sbdsversion' as 'sbdsversion',
   value->>'$.maximumerror' as 'maximumerror',
   value->>'$.sbdschemistry' as 'sbdschemistry',
   value->>'$."batteryoem-specificinformation"' as 'batteryoeminfo',
M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =19`,
 title:  `Portable Battery`,
 description: `Portable Battery`,

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



    batterylocation: {
          sql: `batterylocation`,
          type: `string`,
          title: `Battery Location`
      },
    batterymanufacturer: {
          sql: `batterymanufacturer`,
          type: `string`,
          title: `Manufacturer`
      },
    batteryname: {
          sql: `batteryname`,
          type: `string`,
          title: `Name`
      },
    manufacturedate: {
          sql: `manufacturedate`,
          type: `string`,
          title: `Manufacturer Date`
      },
    serialnumberbattery: {
          sql: `serialnumberbattery`,
          type: `string`,
          title: `Serial Number`
      },
    designcapacityinmwh: {
          sql: `designcapacityinmwh`,
          type: `string`,
          title: `Capacity in mwh`
      },
    designvoltageinmv: {
          sql: `designvoltageinmv`,
          type: `string`,
          title: `Voltage in mv`
      },
    chemistry: {
          sql: `chemistry`,
          type: `string`,
          title: `Chemistry`
      },
    sbdsmanufacturedate: {
          sql: `sbdsmanufacturedate`,
          type: `string`,
          title: `SBDS manufacturer date`
      },
    sbdsserialnumber: {
          sql: `sbdsserialnumber`,
          type: `string`,
          title: `SBDS Serial Number`
      },
    sbdsversion: {
          sql: `sbdsversion`,
          type: `string`,
          title: `SBDS Version`
      },
    maximumerror: {
          sql: `maximumerror`,
          type: `string`,
          title: `Maximum Error`
      },
    sbdschemistry: {
          sql: `sbdschemistry`,
          type: `string`,
          title: `SBDS Chemistry`
      },
    batteryoeminfo: {
          sql: `batteryoeminfo`,
          type: `string`,
          title: `OEM Specific info`
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

