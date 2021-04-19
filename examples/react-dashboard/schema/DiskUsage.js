cube(`DUR`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,
  cast((text1->>'$.percentageused') AS SIGNED) AS 'dusedper',
  (text1->>'$.drive') AS 'drive',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 95 and text1->>'$.percentageused' is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `Disk Usage Analysis`,
	description: `Disk Usage Analysis`,
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
		dusedper: {
			type: `avg`,
			sql: `dusedper`,
			title: `Disk Used %`
		}

	},
	dimensions: {
		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true
		},
		drive: {
			sql: `drive`,
			type: `string`,
			title: `Drive`
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
    //G1 Consumption Device - Disk Logical Use % Snapshot
		DLUS: {
			type: `rollup`,
			measureReferences: [dusedper],
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