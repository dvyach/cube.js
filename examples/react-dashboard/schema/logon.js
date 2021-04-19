cube(`logonoff`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,
  cast((string1->>'$.logonTime') AS CHAR) AS 'logonTime',
  cast((string2->>'$.logoffTime') AS CHAR) AS 'logoffTime',
  cast((text1->>'$.UserWasLoggedInFor') AS UNSIGNED INTEGER) AS 'UserWasLoggedInFor',
  cast((text1->>'$.UserLogOffDetected') AS CHAR) AS 'UserInfo',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 174 and string2 is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `LogOn/Off duration`,
	description: `LogOn/Off duration`,

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

		UserWasLoggedInFor: {
			type: `avg`,
			sql: `UserWasLoggedInFor`,
			title: `Login Duration`
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
		UserInfo: {
			type: `string`,
			sql: `UserInfo`,
			title: `User Logoff Detected`
		},
		logoffTime: {
			type: `string`,
			sql: `logoffTime`,
			title: `Logoff Time`
		},
		logonTime: {
			type: `string`,
			sql: `logonTime`,
			title: `Logon Time`
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
		//Dart 174-User Logon-logoff tracking
		LLT: {
			type: `rollup`,
			measureReferences: [UserWasLoggedInFor],
			dimensionReferences: [machine,UserInfo,logonTime,logoffTime],
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