cube(`PCPUR`, {
	sql: `select idx,scrip,customer,machine,username, servertime as stime,
  cast((text3->>'$.ProcessCPU') AS SIGNED) AS 'pcpu',
  cast((text3->>'$.ProcessSize') AS SIGNED) AS 'psize',
  text3->>'$.ProcessVersion' AS 'pver',
  cast((text3->>'$.ProcessMemUsage_Kb') AS SIGNED) AS 'pmemuse',
  cast((text3->>'$.ProcessMemUsagePercent') AS SIGNED) AS 'pmemuseper',
  text3->>'$.ProcessImageName' AS 'pimage',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip  = 96 and text3->>'$.ProcessImageName' is not null
  and ${USER_CONTEXT.machine.filter('machine')} `,
	title: `Process CPU Utilzation`,
	description: `Process CPU Utilzation`,

	joins: {
		CA: {
			relationship: 'belongsTo',
			sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
		},
		GA: {
			relationship: 'belongsTo',
			sql: `${GA}.host = ${CUBE}.machine`
		}
	},

	measures: {
		pcpu: {
			type: `avg`,
			sql: `pcpu`,
			title: `CPU Utilized %`
		},
		psize: {
			type: `avg`,
			sql: `psize`,
			title: `Process Size`
		},
		pmemuse: {
			type: `avg`,
			sql: `pmemuse`,
			title: `Memory Utilized`
		},
		pmemuseper: {
			type: `avg`,
			sql: `pmemuseper`,
			title: `Memory Utilized %`
		},
	},
	dimensions: {
		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true
		},
		pimage: {
			sql: `pimage`,
			type: `string`,
			title: `Process Name`
		},
		pver: {
			sql: `pver`,
			type: `string`,
			title: `Process Version`
		},
		site: {
			sql: `customer`,
			type: `string`,
			title: `Site`
		},
		machine: {
			sql: `machine`,
			type: `string`,
			title: `Device`
		},
		group: {
			case: {
				when: [{
					sql: `${GA}.name is null`,
					label: `Un-Grouped`
				}, ],
				else: {
					label: {
						sql: `${GA}.name`
					}
				}
			},
			type: `string`,
			title: `Group`
		},
		os: {
			sql: `os`,
			type: `string`,
			title: `Operating System`
		},
		username: {
			sql: `username`,
			type: `string`,
			title: `Device User`
		},
		clientver: {
			sql: `clientversion`,
			type: `string`,
			title: `Version`
		},
		ETime: {
			type: `time`,
			sql: `from_unixtime(stime,'%Y-%m-%d %H:%i:%s')`,
			title: `Converted Time`
		}

	},
	preAggregations: {
		main: {
			type: `originalSql`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
			},
			indexes: {
				machs: {
					columns: ['customer', 'machine']
				},
				et: {
					columns: ['stime']
				}
			}
		},
    //Dart 96-Processor Statistics
		MHour: {
			type: `rollup`,
			measureReferences: [psize, pmemuse],
			dimensionReferences: [machine,pimage],
			timeDimensionReference: ETime,
			granularity: `minute`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `week`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [ETime],
				}
			}
		},
		
	}
});