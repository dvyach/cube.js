cube(`A39`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.memorysize' as 'memorysize',
   value->>'$.formfactor' as 'formfactor',
   value->>'$.devicespeed' as 'devicespeed',
   value->>'$.memoryassettag' as 'memoryassettag',
   value->>'$.datawidthinbits' as 'datawidthinbits',
   value->>'$.devicetypedetail' as 'devicetype',
   value->>'$.memorypartnumber' as 'partnumber',
   value->>'$.memorymanufacturer' as 'manufacturer',
   value->>'$.memoryserialnumber' as 'serialnum',
   A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =39`,
 title:  `Memory Information`,
 description: `Memory Information`,

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

        formfactor: {
            sql: `formfactor`,
            type: `string`,
            title: `Form factor`
        },
        devicespeed: {
            sql: `devicespeed`,
            type: `string`,
            title: `Speed`
        },
        memoryassettag: {
            sql: `memoryassettag`,
            type: `string`,
            title: `Asset Tag`
        },

        datawidthinbits: {
            sql: `datawidthinbits`,
            type: `string`,
            title: `Data Bits`
        },
        devicetype: {
            sql: `devicetype`,
            type: `string`,
            title: `Memory Type`
        },
        partnumber: {
            sql: `partnumber`,
            type: `string`,
            title: `Part Number`
        },
        manufacturer: {
            sql: `manufacturer`,
            type: `string`,
            title: `Manufacturer`
        },
        serialnum: {
            sql: `serialnum`,
            type: `string`,
            title: `Serial Num`
        },

        memorysize: {
            sql: `memorysize`,
            type: `string`,
            title: `Memory Size`
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

