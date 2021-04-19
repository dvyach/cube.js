cube(`A10`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
 value->>'$.biosdate' as 'biosdate',
 value->>'$.biosvendor' as 'biosvendor',
 value->>'$.biosversion' as 'biosver',
 value->>'$.biosromsizeinkb' as 'biossize',
 value->>'$.systemuuid' as 'uuid',
 value->>'$.systemfamily' as 'family',
 value->>'$.systemversion' as 'sver',
 value->>'$.systemskunumber' as 'sysnum',
 value->>'$."systemwake-uptype"' as 'syswakeup',
 value->>'$.systemserialnumber' as 'syssrlnum',
value->>'$.systemmanufacturer' as 'systemmanufacturer',
 value->>'$.systemproduct' as 'systemproduct',
A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =10`,
 title:  `System Information`,
 description: `System Information`,
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
        mid:{
         sql: `machineid`,
          type: `number`,
          primaryKey: true
         },
        site: {
            sql: `cust`,
            type: `string`,
            title: `Site`
        },

      biosdate: {
            sql: `biosdate`,
            type: `string`,
            title: `BIOS Date`
        },

        biosvendor: {
            sql: `biosvendor`,
            type: `string`,
            title: `BIOS Vendor`
        },

        biosver: {
            sql: `biosver`,
            type: `string`,
            title: `BIOS Version`
        },

        biossize: {
            sql: `biossize`,
            type: `string`,
            title: `BIOS Size`
        },

        uuid: {
            sql: `uuid`,
            type: `string`,
            title: `System UUID`
        },

        family: {
            sql: `family`,
            type: `string`,
            title: `System Family`
        },

        sver: {
            sql: `sver`,
            type: `string`,
            title: `System Version`
        },

        sysnum: {
            sql: `sysnum`,
            type: `string`,
            title: `KU Number`
        },

        syswakeup: {
            sql: `syswakeup`,
            type: `string`,
            title: `System Wakeup Type`
        },

        syssrlnum: {
            sql: `syssrlnum`,
            type: `string`,
            title: `Serial Number`
        },

        systemmanufacturer: {
            sql: `systemmanufacturer`,
            type: `string`,
            title: `Manufacturer`
        },
        systemproduct: {
            sql: `systemproduct`,
            type: `string`,
            title: `Product Name`
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
       },
        //Devices by Model
        DM: {
          type: `rollup`,
          measureReferences: [maxDateCreated,DeviceCount],
          dimensionReferences: [systemproduct],
          timeDimensionReference: LatestDate,
          granularity: `day`,
          useOriginalSqlPreAggregations: true,
          partitionGranularity: `month`,
          scheduledRefresh: true,
          refreshKey: {
            every: `1 hour`,
            incremental: true,
          }
        },
       }
     });

