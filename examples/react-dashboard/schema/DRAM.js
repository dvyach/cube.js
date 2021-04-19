cube(`DRAMR`, {
	sql: `select idx,scrip,customer,machine,username,servertime as stime,
  cast((text1->>'$.PhysicalMemoryPercentageInUse') AS SIGNED) AS 'metric',
 cast((text1->>'$.PhysicalMemoryPercentageFree') AS SIGNED) AS 'phmemfree',
 cast((text1->>'$.PhysicalMemoryInUse') AS SIGNED) AS 'meminuse',
  cast((text1->>'$.PageReadsPerSecond') AS SIGNED) AS 'pagereads',
  cast((text1->>'$.SwapSpaceKBytesInUse') AS SIGNED) AS 'sspaceused',
  cast((text1->>'$.SwapSpacePercentageInUse') AS SIGNED) AS 'sspaceusedper',
  cast((text1->>'$.SwapSpacePercentageFree') AS SIGNED) AS 'sspacefreeper',
cast((text1->>'$.VirtualMemoryInUse') AS SIGNED) AS 'vminuse',
  cast((text1->>'$.VirtualMemoryPercentageInUse') AS SIGNED) AS 'vminuseper',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 6 and text1 is not null
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `Memory Utilization`,
	description: `Memory Utilization`,

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
		pageread: {
			type: `avg`,
			sql: `pagereads`,
			title: `Pagereads per sec`
		},
		phmemfree: {
			type: `avg`,
			sql: `phmemfree`,
			title: `Physical Memory % Free`
		},
		memper: {
			type: `avg`,
			sql: `metric`,
			title: `Memory used %`
		},
		meminuse: {
			type: `avg`,
			sql: `meminuse`,
			title: `Memory used`
		},
		vminuse: {
			type: `avg`,
			sql: `vminuse`,
			title: `Virtual Memory used`
		},
		vminuseper: {
			type: `avg`,
			sql: `vminuseper`,
			title: `Virtual Memory used %`
		},
		sspaceused: {
			type: `avg`,
			sql: `sspaceused`,
			title: `Swap Space used`
		},
		sspaceusedper: {
			type: `avg`,
			sql: `sspaceusedper`,
			title: `Swap Space used %`
		},
		sspacefreeper: {
			type: `avg`,
			sql: `sspacefreeper`,
			title: `Swap Space Free %`
		},
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
    //Dart 6-Memory Statistics
		D6MS: {
			type: `rollup`,
			measureReferences: [phmemfree,sspacefreeper],
			dimensionReferences: [machine,username],
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
    //G1 Consumption Device - Memory % Use Average and G1 Consumption Device - Memory Physical % In Use Trend
    MPUA: {
			type: `rollup`,
			measureReferences: [memper],
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
    //G1 Device Consumption - Swap Space Use % Snapshot
    SSUS: {
			type: `rollup`,
			measureReferences: [sspaceusedper],
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