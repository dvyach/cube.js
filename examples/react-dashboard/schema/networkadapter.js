cube(`A41`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.networkadapter' as 'networkadapter',
   value->>'$.ipaddress' as 'ipaddress',
   value->>'$.subnetmask' as 'subnetmask',
   value->>'$.defaultgateway' as 'defaultgateway',
   value->>'$.dhcpserver' as 'dhcpserver',
   value->>'$.dhcpsubnetmask' as 'dhcpsubnetmask',
   value->>'$.macaddress' as 'macaddress',
   A.machineid as 'machineid',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =41`,
 title:  `Network Adapters`,
 description: `Network Adapters`,

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



    networkadapter: {
          sql: `networkadapter`,
          type: `string`,
          title: `Name`
      },
    ipaddress: {
          sql: `ipaddress`,
          type: `string`,
          title: `IP address`
      },
    subnetmask: {
          sql: `subnetmask`,
          type: `string`,
          title: `Subnet Mask`
      },
    defaultgateway: {
          sql: `defaultgateway`,
          type: `string`,
          title: `Default Gateway`
      },
    dhcpserver: {
          sql: `dhcpserver`,
          type: `string`,
          title: `DHCP Server`
      },
    dhcpsubnetmask: {
          sql: `dhcpsubnetmask`,
          type: `string`,
          title: `DHCP Subnet Mask`
      },
    macaddress: {
          sql: `macaddress`,
          type: `string`,
          title: `MAC address`
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

