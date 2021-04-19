cube(`A36`, {
  sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
  value->>'$.installedsoftwarenames' as 'installedsoftwarenames',
  value->>'$.version' as 'version',
  value->>'$.installationdate' as 'date',
  M.cust as cust,
  M.host as 'machine' from asset.AssetData as A
  join asset.Machine as M on A.machineid = M.machineid
  where A.dataid =36`,
   joins: {
     GA:{
       relationship: 'belongsTo',
       sql: `${GA}.host = ${CUBE}.machine`
       }
       },
       measures: {
       DeviceCount: {
            sql: `machine`,
           type: `countDistinct`,
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
          site: {
              sql: `cust`,
              type: `string`,
              title: `Site`
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
          machine:{
               sql: `machine`,
               type: `string`,
               title: `Device`
           },
           installedsoftwarenames: {
               sql: `installedsoftwarenames`,
               type: `string`,
               title: `Software Name`
           },
           version: {
               sql: `version`,
               type: `string`,
               title: `Version`
           },
           date: {
               sql: `date`,
               type: `string`,
               title: `Installation Date`
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
         //Installed Softwares
         //Application Installed with Version
          AIV:{
            type: `rollup`,
            measureReferences: [maxDateCreated,DeviceCount],
            dimensionReferences: [machine,installedsoftwarenames,version,date],
            timeDimensionReference: LatestDate,
            granularity: `day`,
            useOriginalSqlPreAggregations: true,
            partitionGranularity: `month`,
            scheduledRefresh: true,
            refreshKey: {
              every: `1 hour`,
              incremental: true,
            },
              indexes: {
                main: {
                columns: [machine],
                },
              }
            },
          //Top 10 Applications
          AT10:{
            type: `rollup`,
            measureReferences: [DeviceCount],
            dimensionReferences: [installedsoftwarenames],
            timeDimensionReference: LatestDate,
            granularity: `day`,
            useOriginalSqlPreAggregations: true,
            partitionGranularity: `month`,
            scheduledRefresh: true,
            refreshKey: {
              every: `1 hour`,
              incremental: true,
            },
              indexes: {
                main: {
                columns: [installedsoftwarenames],
                },
              }
            },
         }
       });
  
        
  