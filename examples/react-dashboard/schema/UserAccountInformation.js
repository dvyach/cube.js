cube(`A56`, {
    sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
   value->>'$.useraccountname' as 'useraccountname',
   value->>'$.useraccountfullname' as 'useraccountfullname',
   value->>'$.useraccountprivileges' as 'useraccountprivileges',
   value->>'$.useraccountsuccessfullogons' as 'useraccountsuccessfullogons',
   value->>'$.useraccountfailedlogons' as 'useraccountfailedlogons',
   value->>'$.useraccountdescription' as 'useraccountdescription',
   value->>'$.useraccountuserdiskstoragesizelimit' as 'useraccountuserdiskstoragesizelimit',
   value->>'$.useraccountaccountexpirationtime' as 'useraccountaccountexpirationtime',
   value->>'$.useraccountdisabled' as 'useraccountdisabled',
   value->>'$.useraccountdomain' as 'useraccountdomain',
   value->>'$.useraccountgroups' as 'useraccountgroups',
   value->>'$.useraccounthomedirpath' as 'useraccounthomedirpath',
   value->>'$.useraccountlockout' as 'useraccountlockout',
   value->>'$.useraccountlogonallowedworkstations' as 'useraccountlogonallowedworkstations',
   value->>'$.useraccountlogonservername' as 'useraccountlogonservername',
   value->>'$.useraccountpasswordage' as 'useraccountpasswordage',
   value->>'$.useraccountpasswordchangeable' as 'useraccountpasswordchangeable',
   value->>'$.useraccountpasswordexpires' as 'useraccountpasswordexpires',
   value->>'$.useraccountpasswordrequired' as 'useraccountpasswordrequired',
M.cust as cust, C.host,
   M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =56`,
 title:  `User Account Information  `,
 description: `User Account Information  `,

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



    useraccountname: {
          sql: `useraccountname`,
          type: `string`,
          title: `Name`
      },
    useraccountfullname: {
          sql: `useraccountfullname`,
          type: `string`,
          title: `Full Name`
      },
    useraccountprivileges: {
          sql: `useraccountprivileges`,
          type: `string`,
          title: `Privilages`
      },
    useraccountsuccessfullogons: {
          sql: `useraccountsuccessfullogons`,
          type: `string`,
          title: `Successful Logons`
      },
    useraccountfailedlogons: {
          sql: `useraccountfailedlogons`,
          type: `string`,
          title: `Failed logons`
      },
    useraccountdescription: {
          sql: `useraccountdescription`,
          type: `string`,
          title: `Description`
      },
    useraccountuserdiskstoragesizelimit: {
          sql: `useraccountuserdiskstoragesizelimit`,
          type: `string`,
          title: `Storage limit`
      },
    useraccountaccountexpirationtime: {
          sql: `useraccountaccountexpirationtime`,
          type: `string`,
          title: `Expiration Time`
      },
    useraccountdisabled: {
          sql: `useraccountdisabled`,
          type: `string`,
          title: `Account Disabled`
      },
    useraccountdomain: {
          sql: `useraccountdomain`,
          type: `string`,
          title: `Domain`
      },
    useraccountgroups: {
          sql: `useraccountgroups`,
          type: `string`,
          title: `Groups`
      },
    useraccounthomedirpath: {
          sql: `useraccounthomedirpath`,
          type: `string`,
          title: `Home Dir Path`
      },
    useraccountlockout: {
          sql: `useraccountlockout`,
          type: `string`,
          title: `Account Lockout`
      },
    useraccountlogonallowedworkstations: {
          sql: `useraccountlogonallowedworkstations`,
          type: `string`,
          title: `Allowed Workstations`
      },
    useraccountlogonservername: {
          sql: `useraccountlogonservername`,
          type: `string`,
          title: `Logon Server name`
      },
    useraccountpasswordage: {
          sql: `useraccountpasswordage`,
          type: `string`,
          title: `Password Age`
      },
    useraccountpasswordchangeable: {
          sql: `useraccountpasswordchangeable`,
          type: `string`,
          title: `Changeable Password?`
      },
    useraccountpasswordexpires: {
          sql: `useraccountpasswordexpires`,
          type: `string`,
          title: `Password Expiry`
      },
    useraccountpasswordrequired: {
          sql: `useraccountpasswordrequired`,
          type: `string`,
          title: `Password Required?`
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

