cube(`procdur`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,

  cast((text1->>'$.processname') AS CHAR) AS 'processname',
  cast((text1->>'$.procduration') AS SIGNED) AS 'procduration',

  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 308 and text1 is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `Process durataion`,
	description: `Process durataion`,

	joins: {
		CA: {
			relationship: 'belongsTo',
			sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
		},
		GA: {
			relationship: 'belongsTo',
			sql: `${GA}.host = ${CUBE}.machine`
		},
	},

	measures: {

		procduration: {
			type: `avg`,
			sql: `procduration`,
			title: `Process Duration`
		}
	},
	dimensions: {
		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true
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
		processname: {
			type: `string`,
			sql: `processname`,
			title: `Process Name`
		},
		procwindows: {
			type: `string`,
			sql: `procwindows`,
			title: `Windows Name`
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
	//G1 Consumption Application - Duration Chrome Process bar
	DCPB: {
		type: `rollup`,
		measureReferences: [procduration],
		dimensionReferences: [procwindows],
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
	//G1 Consumption Application - Process Duration Analytics
	PDA: {
		type: `rollup`,
		measureReferences: [procduration],
		dimensionReferences: [processname],
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
    //Installed Softwares
    //pbidesktop
		ISS: {
			type: `rollup`,
			measureReferences: [procduration],
			dimensionReferences: [processname,machine,site,procwindows],
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