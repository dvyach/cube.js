cube(`CA`, {
  sql: `select id as cid, site,host,os
  from core.Census`,
  title: ` Location Cube`,
  description: `All Location cube`,
  joins: {

  },

  measures: {


  },

  dimensions: {

  // The Census level dimensions like site name, operating system, host are here

    cid:{
      sql: `id`,
      type: `number`,
      primaryKey: true,
      shown: false
    },
    site: {
      sql: `site`,
      type: `string`
    },
    host: {
      sql: `host`,
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
        columns: ['site','host']
        }
      }
    }
 }
});
