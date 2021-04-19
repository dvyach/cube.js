cube(`A20`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.registeredprocessor' as 'processortype',
   value->>'$.processorfamily' as 'processorfamily',
   value->>'$.processormanufacturer' as 'processormanufacturer',
   value->>'$.registeredprocessor' as 'regdprocessor',
   value->>'$.processorcurrentvoltage' as 'processorcurrentvoltage',
   value->>'$.processorcorecount' as 'processorcorecount',
   value->>'$.processorcoreenabled' as 'processorcoreenabled',
   value->>'$.processorthreadcount' as 'processorthreadcount',
   value->>'$.processorcurrentspeedinmhz' as 'processorspeed',
   value->>'$.processorcharacteristics1' as 'processchar',
value->>'$.processorversion' as 'processorversion',
  A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =20`,


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
        site: {
            sql: `cust`,
            type: `string`,
            title: `Site`
        },
        processortype: {
            sql: `processortype`,
            type: `string`,
            title: `Processor Type`
        },
processorversion: {
            sql: `processorversion`,
            type: `string`,
            title: `Processor Version`
        },
        processorfamily: {
            sql: `processorfamily`,
            type: `string`,
            title: `Processor Family`
        },
        processormanufacturer: {
            sql: `processormanufacturer`,
            type: `string`,
            title: `Manufacturer`
        },
        processorcurrentvoltage: {
            sql: `processorcurrentvoltage`,
            type: `string`,
            title: `Voltage`
        },
        processorcorecount: {
            sql: `processorcorecount`,
            type: `string`,
            title: `Core Count`
        },
        processorcoreenabled: {
            sql: `processorcoreenabled`,
            type: `string`,
            title: `Core Enabled`
        },
        processorthreadcount: {
            sql: `processorthreadcount`,
            type: `string`,
            title: `Thread Count`
        },
        regdprocessor: {
            sql: `regdprocessor`,
            type: `string`,
            title: `Processor Details`
        },
        processorspeed: {
            sql: `processorspeed`,
            type: `string`,
            title: `Processor Speed`
        },
        processchar: {
            sql: `processchar`,
            type: `string`,
            title: `Process Characteristics`
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
           every: `1 hour`,
           incremental: false
         },
       }
       }
     });

