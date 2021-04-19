cube(`USBblock`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,

  cast((text1->>'$.USBStatus') AS CHAR) AS 'status',

  clientversion as clientversion,

  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 296 and (text1) is not null

  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `USB Driver status`,
	description: `USB Driver status`,

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
		status: {
			type: `string`,
			sql: `status`,
			title: `USB Status`
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
    //Dart 296 - USB Block/Unblock	
		USB296: {
			type: `rollup`,
			measureReferences: [id],
			dimensionReferences: [machine, username, status],
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
    //USB Block Status
    USBBS: {
			type: `rollup`,
			measureReferences: [id],
			dimensionReferences: [machine,status],
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