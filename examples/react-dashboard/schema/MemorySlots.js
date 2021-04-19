cube(`A61`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.supportedmemorytypes' as 'memsupport',
   value->>'$.associatedmemoryslots' as 'memslots',
   value->>'$.supportedmemoryspeeds' as 'memspeeds',
   value->>'$.memorycurrentinterleave' as 'interleave',
   value->>'$.maximumtotalmemorysizeinmb' as 'memslotsize',
   value->>'$.maximummemorymodulesizeinmb' as 'memperslot',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =61`,
 title:  `Memory Slots Information`,
 description: `Memory Slots Information`,
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

        memsupport: {
            sql: `memsupport`,
            type: `string`,
            title: `Memory Support`
        },

        memslots: {
            sql: `memslots`,
            type: `string`,
            title: `Memory Slots`
        },
        memspeeds: {
            sql: `memspeeds`,
            type: `string`,
            title: `Memory Speeds`
        },
        interleave: {
            sql: `interleave`,
            type: `string`,
            title: `Interleave`
        },
      memslotsize: {
            sql: `memslotsize`,
            type: `string`,
            title: `Slot Size`
        },
        memperslot: {
            sql: `memperslot`,
            type: `string`,
            title: `Max per Slot`
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

