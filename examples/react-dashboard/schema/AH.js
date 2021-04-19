cube(`AHSG`, {
	sql: `SELECT idx,servertime as stime,
  customer,machine,username,
  cast((text1->>'$.resolution') AS CHAR) AS 'autoheal',
  cast((text1->>'$.issuedescription') as CHAR) AS 'issue',
  clientversion as clientversion
  from  event.Events
  where  scrip = 69
   and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `Autoheal Analytics test`,
	description: `Autoheal Analytics test`,

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

		autohealcount: {
			type: `count`,
			sql: `idx`,
			drillMembers: [machine, autoheal, issuedescription, ETime],
			title: `Count`,
			filters: [{
				sql: `${CUBE}.autoheal is not null`
			}]
		}
	},

	dimensions: {

		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true
		},

		site: {
			sql: `${CA}.site`,
			type: `string`,
			title: `Site`
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
			sql: `${CA}.os`,
			type: `string`,
			title: `Operating System`
		},

		machine: {
			sql: `machine`,
			type: `string`,
			title: `Machine`
		},


		autoheal: {
			type: `string`,
			sql: `autoheal`,
			title: `Autoheal Executed`,
		},
		issuedescription: {
			type: `string`,
			sql: `issue`,
			title: `Issue Description`
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
			title: `Autoheal Execution Time`
		}
	},


	preAggregations: {
		main: {
			type: `originalSql`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`
			},
			indexes: {
				machs: {
					columns: ['machine']
				}
			}
		},
    //Automation Dashboard
    //Autoheal Resolution Count
    AHC: {
			type: `rollup`,
			measureReferences: [autohealcount],
			timeDimensionReference: ETime,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Autoheal Resolution
    AHR: {
			type: `rollup`,
			measureReferences: [autohealcount],
			dimensionReferences: [autoheal,issuedescription],
			timeDimensionReference: ETime,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Autoheal Executed : Device/System wise
    AHE: {
			type: `rollup`,
			measureReferences: [autohealcount],
			dimensionReferences: [autoheal,username,machine],
			timeDimensionReference: ETime,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [machine],
				}
			}
		},
    //OS-wise Autoheal
    OSAH: {
			type: `rollup`,
			measureReferences: [autohealcount],
			dimensionReferences: [os],
			timeDimensionReference: ETime,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //List of Automations - Autoheal Pre-agg
		AHHour: {
			type: `rollup`,
			measureReferences: [autohealcount],
			dimensionReferences: [autoheal,ETime,username,issuedescription,machine,os,site,clientver],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				// every: `1 hour`,
				// incremental: true,
				sql: `SELECT MAX(servertime) from  event.Events where  scrip = 69`
			},
			indexes: {
				main: {
					columns: [machine,site],
				}
			}
		}
		
	}
});