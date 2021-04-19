cube(`A5`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
    value->>'$.chassislock' as 'lock',
    value->>'$.chassisheight' as 'height',
    value->>'$.chassisversion' as 'version',
    value->>'$.chassisassettag' as 'assettag',
    value->>'$.chassisskunumber' as 'skunumber',
    value->>'$."chassisboot-upstate"' as 'upstate',
    value->>'$.chassismanufacturer' as 'manufacturer',
    value->>'$.chassisserialnumber' as 'serialnumber',
    value->>'$.chassisthermalstate' as 'thermalstate',
    value->>'$.chassisoeminformation' as 'oeminformation',
    value->>'$.chassispowersupplystate' as 'powersupplystate',
    value->>'$.chassisnumberofpowercords' as 'numberofpowercords',
   value->>'$.chassistype' as 'chassistype',
   value->>'$.chassissecuritystatus' as 'chassissecurity',
    A.machineid as 'machineid',
    M.cust as cust, C.host,
    M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =5`,


 joins: {
 GA:{
   relationship: 'belongsTo',
   sql: `${GA}.host = ${CUBE}.machine`
   }
     },

     measures: {
     DeviceCount: {
         type: `countDistinct`,
         sql: `machine`,
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
        lock: {
            sql: `lock`,
            type: `string`,
            title: `Chassis Lock`
        },
        height: {
            sql: `height`,
            type: `string`,
            title: `Chassis height`
        },
        version: {
            sql: `version`,
            type: `string`,
            title: `Chassis Version`
        },
        assettag: {
            sql: `assettag`,
            type: `string`,
            title: `Chassis Tag`
        },
        skunumber: {
            sql: `skunumber`,
            type: `string`,
            title: `Chassis Info`
        },
        upstate: {
            sql: `upstate`,
            type: `string`,
            title: `Chassis Upstate`
        },
        manufacturer: {
            sql: `manufacturer`,
            type: `string`,
            title: `Manufacturer`
        },
        serialnumber: {
            sql: `serialnumber`,
            type: `string`,
            title: `Serial No`
        },
        thermalstate: {
            sql: `thermalstate`,
            type: `string`,
            title: `Thermal State`
        },
        oeminformation: {
            sql: `oeminformation`,
            type: `string`,
            title: `OEM Info`
        },

        powersupplystate: {
            sql: `powersupplystate`,
            type: `string`,
            title: `Power Supply State`
        },
        numberofpowercords: {
            sql: `numberofpowercords`,
            type: `string`,
            title: `Power Inputs`
        },

        chassistype: {
            sql: `chassistype`,
            type: `string`,
            title: `Chassis Type`
        },
        chassissecurity: {
            sql: `chassissecurity`,
            type: `string`,
            title: `Chassis Security`
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

