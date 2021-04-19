cube(`DIOR`, {
	sql: `SELECT customer, machine, scrip, servertime as stime,
  cast((text1->>'$.averagequeuelength') AS SIGNED) AS 'averagequeuelength',
  cast((text1->>'$.Drive') AS CHAR) AS 'drive',
  cast((text1->>'$.percentbusytime') AS SIGNED) AS 'percentbusytime',
  cast((text1->>'$.readpersecond') AS SIGNED) AS 'readpersecond',
  cast((text1->>'$.writespersecond') AS SIGNED) AS 'writespersecond',
  cast((text1->>'$.realtimediskiopercentage') AS SIGNED) AS 'dioper',
         clientversion as clientversion,
         C.os as os
         from  event.Events, core.Census as C
         where C.site=customer and C.host= machine
        and scrip  = 97 and text1->>'$.realtimediskiopercentage' is not null
        and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `DiskIO Performance`,
	description: `DiskIO Performance`,
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
		averagequeuelength: {
			type: `avg`,
			sql: `averagequeuelength`,
			title: `Average Queue Length`
		},
		percentbusytime: {
			type: `avg`,
			sql: `percentbusytime`,
			title: `% Busy Time`
		},
		readpersecond: {
			type: `avg`,
			sql: `readpersecond`,
			title: `Read per second`
		},
		writespersecond: {
			type: `avg`,
			sql: `writespersecond`,
			title: `Writes per second`
		},
		dioper: {
			type: `avg`,
			sql: `dioper`,
			title: `DiskIO %`
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
		drive: {
			type: `string`,
			sql: `drive`,
			title: `Drive Name`
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
    //Dart 97-Physical Disk Statistics
		PDS: {
			type: `rollup`,
			measureReferences: [writespersecond],
			dimensionReferences: [machine,drive],
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
		//G1 Consumption Device - Disk I/O % Real Time Gauge
    GCD: {
			type: `rollup`,
			measureReferences: [dioper],
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