cube(`adpass`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,
  cast((text2->>'$.log') AS CHAR) AS 'result',
  cast((text1->>'$.log') AS CHAR) AS 'logs',
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 252
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `AD Password reset`,
	description: `AD Password reset`,

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
		id: {
			type: `number`,
			sql: `idx`,
			title: `ID`
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
		os: {
			sql: `os`,
			type: `string`,
			title: `Operating System`
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
		username: {
			sql: `username`,
			type: `string`,
			title: `Device User`
		},
		logs: {
			sql: `logs`,
			type: `string`,
			title: `Logs`
		},
		result: {
			sql: `result`,
			type: `string`,
			title: `Result`
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
    //AD_PASSWORD_RESET
		ADPR: {
			type: `rollup`,
			measureReferences: [id],
			dimensionReferences: [machine, username, logs,result],
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
		}
	
	}
});