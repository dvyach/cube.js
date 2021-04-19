cube(`AT`, {
  sql: `select MetricName,Impact,Score,GoodScore,Value from analytics_test.Metrics`,
  title: ` Analytics Metrics`,
  description: ` Analytics Metrics`,

  joins: {

  },

  measures: {

  },

  dimensions: {
    cid:{
      sql: `id`,
      type: `number`,
      primaryKey: true,
      shown: false
    }
  },
  preAggregations:{
 }
});

