cube(`AL`, {
  sql: `select key_list,sequencename,description,keyuniq
  from analytics_test.Automation`,
  title: `Automation List`,
  description: `Automation List`,
  joins: {

  },

  measures: {



  },

  dimensions: {

  // The Census level dimensions like site name, operating system, host are here

    cid:{
      sql: `keyuniq`,
      type: `number`,
      primaryKey: true,
      shown: false
    },
    sequencename: {
      sql: `sequencename`,
      type: `string`
    },
    description: {
      sql: `description`,
      type: `string`
    }


  },
  preAggregations:{
    main: {
      type: `originalSql`,
      refreshKey: {
      every: `1 hour`
      },
      indexes: {
        machs: {
        columns: ['key_list']
        }
      }
    }
 }
});

