cube(`AIMX`, {
  sql: `select * from ${BT.sql()} as BT
  UNION
  select * from ${DCM.sql()} as DCM
  UNION
  select * from ${DIO.sql()} as DIO
  UNION
  select * from ${DU.sql()} as DU
  UNION
  select * from ${LT.sql()} as LT
  UNION
  select * from ${NOP.sql()} as NOP
  UNION
  select * from ${PCPU.sql()} as PCPU
  UNION
  select * from ${PMEM.sql()} as PMEM`,
  title:  `AIM-X`,
  description: `AIM-X Exp`,

  joins: {
       CA:{
           relationship: 'belongsTo',
           sql: `${CA}.site = {CUBE}.customer and ${CA}.host = ${CUBE}.machine`
        },
        AT:{
           relationship: 'belongsTo',
           sql: `${AT}.MetricName = ${CUBE}.metricname`
        },
        GA:{
                relationship: 'belongsTo',
                sql: `${GA}.host = ${CUBE}.machine`
             }
     },
    measures:{

    // Should use BootTime is not null as filter when Viz is created

    Metric: {
        type: `avg`,
        sql: `metric`,
        drillMembers: [machine,Metric,last,change,ActualScore,GoodScore],
        title: `System Metric`,
        },
    ActualScore:{
         type: `avg`,
         sql: `ROUND(IF (${AT}.Impact = 0,(IF (((${CUBE}.metric)*${AT}.Score)/Value >${AT}.Score,${AT}.Score,((${CUBE}.metric)*${AT}.Score)/${AT}.Value)),
      IF (${AT}.Impact = 100, (IF((((Impact-(${CUBE}.metric))*${AT}.Score)/(${AT}.Impact-${AT}.Value))>${AT}.Score,${AT}.Score,(((${AT}.Impact-(${CUBE}.metric))*${AT}.Score)/(${AT}.Impact-${AT}.Value)))),
      IF((${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value)<0,0,IF((${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value)>${AT}.Score,${AT}.Score,(${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value))))),2)`,
    },
    last:{
          type: `avg`,
          sql: `last`,
          title: `Previous`
        },
    lastScore:{
             type: `avg`,
             sql: `ROUND(IF (${AT}.Impact = 0,(IF (((${CUBE}.last)*${AT}.Score)/Value >${AT}.Score,${AT}.Score,((${CUBE}.last)*${AT}.Score)/${AT}.Value)),
          IF (${AT}.Impact = 100, (IF((((Impact-(${CUBE}.last))*${AT}.Score)/(${AT}.Impact-${AT}.Value))>${AT}.Score,${AT}.Score,(((${AT}.Impact-(${CUBE}.last))*${AT}.Score)/(${AT}.Impact-${AT}.Value)))),
          IF((${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value)<0,0,IF((${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value)>${AT}.Score,${AT}.Score,(${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value))))),2)`,
        },
     change:{
           type: `avg`,
           sql: `change`,
           title: `Metric Change`
         },
      scorechange: {
        type: `avg`,
        sql: `ROUND(IF (${AT}.Impact = 0,(IF (((${CUBE}.metric)*${AT}.Score)/Value >${AT}.Score,${AT}.Score,((${CUBE}.metric)*${AT}.Score)/${AT}.Value)),
     IF (${AT}.Impact = 100, (IF((((Impact-(${CUBE}.metric))*${AT}.Score)/(${AT}.Impact-${AT}.Value))>${AT}.Score,${AT}.Score,(((${AT}.Impact-(${CUBE}.metric))*${AT}.Score)/(${AT}.Impact-${AT}.Value)))),
     IF((${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value)<0,0,IF((${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value)>${AT}.Score,${AT}.Score,(${AT}.Score -(${CUBE}.metric-${AT}.Value)*${AT}.Score/${AT}.Value))))),2) - ROUND(IF (${AT}.Impact = 0,(IF (((${CUBE}.last)*${AT}.Score)/Value >${AT}.Score,${AT}.Score,((${CUBE}.last)*${AT}.Score)/${AT}.Value)),
  IF (${AT}.Impact = 100, (IF((((Impact-(${CUBE}.last))*${AT}.Score)/(${AT}.Impact-${AT}.Value))>${AT}.Score,${AT}.Score,(((${AT}.Impact-(${CUBE}.last))*${AT}.Score)/(${AT}.Impact-${AT}.Value)))),
  IF((${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value)<0,0,IF((${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value)>${AT}.Score,${AT}.Score,(${AT}.Score -(${CUBE}.last-${AT}.Value)*${AT}.Score/${AT}.Value))))),2)`,
        title: `Score Change`
      },
      GoodScore:{
        type: `number`,
        sql: `${AT}.GoodScore`,
        title: `Good Score`
      }
    },
      dimensions:{
       idx:{
           sql: `idx`,
           type: `number`,
           primaryKey: true
       },
       site: {
           sql: `customer`,
           type: `string`,
           title: `Site`
       },
       scrip: {
           sql: `scrip`,
           type: `string`,
           title: `Dart`
       },
       machine: {
           sql: `machine`,
           type: `string`,
           title: `Machine`
       },
       Other:{
         type: `string`,
         sql: `other`,
         title: `Dynamic Title`
       },
       MetricName:{
         type: `string`,
         sql: `${AT}.MetricName`,
         title: `Metric`
       },
       os: {
         sql: `${CA}.os`,
         type: `string`,
         title: `Operating System`
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
       username: {
           sql: `username`,
           type: `string`,
           title: `Username`
        },
        stime: {
          type: `time`,
          sql: `from_unixtime(servertime,'%Y-%m-%d %H:%i:%s')`,
          title: `string`,
        },
        dtime: {
            sql: `from_unixtime(servertime,'%Y-%m-%d %H:%i:%s')`,
            type: `time`,
            title: `Time`
       }
       },
       preAggregations:{
         main: {
             type: `originalSql`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
             },
             indexes: {
               machs: {
               columns: ['machine']
               }
             }
           },
           MHour:{
             type: `rollup`,
             measureReferences: [Metric,last,change,ActualScore,lastScore,scorechange,GoodScore],
             dimensionReferences: [machine],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [machine],
               }
             }
           },
           SHour:{
             type: `rollup`,
             measureReferences: [Metric,last,change,ActualScore,lastScore,scorechange,GoodScore],
             dimensionReferences: [site],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [site],
               }
             }
           },
           GHour:{
             type: `rollup`,
             measureReferences: [Metric,last,change,ActualScore,lastScore,scorechange,GoodScore],
             dimensionReferences: [group],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             },
             indexes: {
               main: {
               columns: [group],
               }
             }
           },
           OHour:{
             type: `rollup`,
             measureReferences: [Metric,last,change,ActualScore,lastScore,scorechange,GoodScore],
             dimensionReferences: [os],
             timeDimensionReference: dtime,
             granularity: `hour`,
             useOriginalSqlPreAggregations: true,
             partitionGranularity: `month`,
             scheduledRefresh: true,
             refreshKey: {
               every: `1 hour`,
               incremental: true
             }
           }


           }
 });

