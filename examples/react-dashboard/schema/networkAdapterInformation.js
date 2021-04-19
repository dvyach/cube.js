cube(`A58`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.adaptername' as 'adaptername',
   value->>'$.adaptermanufacturer' as 'adaptermanufacturer',
   value->>'$.adapterdriverfilename' as 'adapterdriverfilename',
   value->>'$.adapterdriverversion' as 'adapterdriverversion',
   value->>'$.adapteradaptertype' as 'adapteradaptertype',
   value->>'$.adapteripaddress' as 'adapteripaddress',
   value->>'$.adapteripsubnet' as 'adapteripsubnet',
   value->>'$.adapterdefaultipgateway' as 'adapterdefaultipgateway',
   value->>'$.adaptermacaddress' as 'adaptermacaddress',
   value->>'$.adapterdhcpserver' as 'adapterdhcpserver',
   value->>'$.adapterdhcpenabled' as 'adapterdhcpenabled',
   value->>'$.adapterdnsserversearchorder' as 'adapterdnsserversearchorder',
   value->>'$.adapterdriverlastmodified' as 'adapterdriverlastmodified',
   M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =58`,
 title:  `Network Adapter Information  `,
 description: `Network Adapter Information  `,

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



    adaptername: {
          sql: `adaptername`,
          type: `string`,
          title: `Name`
      },
    adaptermanufacturer: {
          sql: `adaptermanufacturer`,
          type: `string`,
          title: `Manufacturer`
      },
    adapterdriverfilename: {
          sql: `adapterdriverfilename`,
          type: `string`,
          title: `File Name`
      },
    adapterdriverversion: {
          sql: `adapterdriverversion`,
          type: `string`,
          title: `Version`
      },
    adapteradaptertype: {
          sql: `adapteradaptertype`,
          type: `string`,
          title: `Type`
      },
    adapteripaddress: {
          sql: `adapteripaddress`,
          type: `string`,
          title: `IP address`
      },
    adapteripsubnet: {
          sql: `adapteripsubnet`,
          type: `string`,
          title: `IP subnet`
      },
    adapterdefaultipgateway: {
          sql: `adapterdefaultipgateway`,
          type: `string`,
          title: `Default Gateway`
      },
    adaptermacaddress: {
          sql: `adaptermacaddress`,
          type: `string`,
          title: `MAC address`
      },
    adapterdhcpserver: {
          sql: `adapterdhcpserver`,
          type: `string`,
          title: `DHCP Server`
      },
    adapterdhcpenabled: {
          sql: `adapterdhcpenabled`,
          type: `string`,
          title: `DHCP Status`
      },
    adapterdnsserversearchorder: {
          sql: `adapterdnsserversearchorder`,
          type: `string`,
          title: `DNS Server Search Order`
      },
    adapterdriverlastmodified: {
          sql: `physicaldiskscsiport`,
          type: `string`,
          title: `Last modified`
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

