cube(`GA`, {
  sql: `
  SELECT Census.host as host,Census.site as site, Census.os as os, MachineGroups.mgroupid as gid,
  MachineGroups.name as name ,MachineGroups.style as style,
  MachineGroups.username as username FROM core.Census,core.MachineGroupMap,core.MachineGroups
  WHERE
  Census.censusuniq = MachineGroupMap.censusuniq
  AND
  MachineGroups.mgroupuniq=MachineGroupMap.mgroupuniq
  AND
  MachineGroups.style <> 1`,
  title: `Personas`,
  description: `List of Personas`,

  joins: {

  },

  segments: {
    style_2: {
      sql: `${CUBE}.style = 2`
    },
    style_3: {
      sql: `${CUBE}.style= 3`
    }
  },

  measures: {


  },

dimensions: {
  gid:{
    sql: `gid`,
    type: `number`,
    primaryKey: true,
  },

  gname: {
    case: {
      when: [
      { sql: `name is null`, label: `Un-Grouped` },
    ],
      else: {label: {sql: `name`}  }
    },
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
       columns: ['name','host']
       }
     }
   }

 }
 });
