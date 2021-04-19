cube(`AASG`, {
	sql: `SELECT idx,servertime as stime,
  customer,machine,username,ctime as cltime,
  cast((REPLACE(REPLACE(text1->>'$.sequencename',']',''),'[','')) as CHAR) AS 'tilename',
  cast((text1->>'$.sequence') AS CHAR) AS 'statusText',
  cast((string1->>'$.log') AS CHAR) AS 'executedBy',
  CONV(SUBSTRING(CAST(SHA(CONCAT(json_keys(text1))) AS CHAR), 1, 16), 16, 10) as keylist, 
  cast(SUBSTRING_INDEX(text2->>'$.log',':',-1) as CHAR) as 'log',
  cast((text1->>'$.totaldurationofsequence_seconds') as unsigned integer) AS 'duration',
  clientversion as clientversion,
  C.os as os
  from  event.Events, core.Census as C
  where C.site=customer and C.host= machine
  and scrip = 286
  and ${USER_CONTEXT.machine.filter('machine')}`,
	title: `Automation Analytics test`,
	description: `Automation Analytics test`,

	joins: {
		CA: {
			relationship: 'belongsTo',
			sql: `${CA}.site = ${CUBE}.customer and ${CA}.host = ${CUBE}.machine`
		},
		GA: {
			relationship: 'belongsTo',
			sql: `${GA}.host = ${CUBE}.machine`
		},
		AL: {
			relationship: `belongsTo`,
			sql: `${AL}.keyuniq = ${CUBE}.keylist`
		}
	},
	measures: {
		automationcount: {
			type: `countDistinct`,
			sql: `idx`,
			drillMembers: [machine, tilename, typeofrun, duration, terminatedafter, ETime],
			title: `Count`,
		},
		duration: {
			type: `avg`,
			sql: `duration`,
			title: `Execution Duration`,
			filters: [{
				sql: `${CUBE}.statusText = 'completed successfully'`
			}]
		},
		terminatedafter: {
			type: `avg`,
			sql: `duration`,
			title: `Terminated After`,
			filters: [{
				sql: `${CUBE}.statusText = 'Has been terminated'`
			}]
		}
	},
	dimensions: {

		idx: {
			sql: `idx`,
			type: `number`,
			primaryKey: true,
			shown: true,
			title: `Event ID`
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
		tilename1: {
			type: `string`,
			sql: `tilename`,
			title: `Automation`
		},
		tilename: {
			type: `string`,
			// sql: `${AL}.description`,
			sql: `tilename`,
			title: `Automation Name`
		},
		typeofrun: {
			type: `string`,
			sql: `log`,
			title: `Type of Run`
		},

		statusText: {
			type: `string`,
			sql: `statusText`,
			title: `Status`
		},

		executedBy: {
			type: `string`,
			sql: `executedBy`,
			title: `Executed By`
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
		CLTime: {
			type: `time`,
			sql: `from_unixtime(cltime,'%Y-%m-%d %H:%i:%s')`,
			title: `Client Time`
		},
		ETime: {
			type: `time`,
			sql: `from_unixtime(stime,'%Y-%m-%d %H:%i:%s')`,
			title: `Converted Time`
		}


	},
  segments:{
    SelfHelp:{
		sql: `${typeofrun} like '%consumer%'`,
	  },
	  Scheduled:{
		sql: `${typeofrun} like '%scheduled%'`,
	  },
	  Proactive:{
		sql: `${typeofrun} like '%agent%'`,
	  },
    TName:{
      sql: `${tilename} is not null`
    },
    Terminate:{
      sql: `${statusText} = 'Has been terminated'`
    }
  },
	// Machine level pre-agg
	preAggregations: {
		main: {
			type: `originalSql`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
			},
			indexes: {
				machs: {
					columns: ['stime']
				}
			}
		},
    //Insight : Resolutions executed
    //Scheduled Resolution Count
    SCCount: {
			type: `rollup`,
      measureReferences: [automationcount],
      segmentReferences:[Scheduled,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Proactive Resolution Count
    PACount: {
			type: `rollup`,
			measureReferences: [automationcount],
      segmentReferences:[Proactive,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //SelfHelp Resolution Count
    SHCount: {
			type: `rollup`,
			measureReferences: [automationcount],
      		segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Scheduled Resolution
    SCR: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,statusText],
			segmentReferences:[Scheduled,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Proactive Resolution
    PAR: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,statusText],
			segmentReferences:[Proactive,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //SelfHelp Resolution
    SHR: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,statusText],
			segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Selfhelp automation Executed : Device/System wise
    SHAE: {
			type: `rollup`,
      measureReferences: [automationcount],
      dimensionReferences: [tilename,username,machine],
      segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
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
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Automations Executed : Device/System wise
    AE: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,username,machine,typeofrun,statusText],
			segmentReferences:[TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
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
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //SelfHelp Resolution: User Cancelled
    SHC: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,machine,typeofrun],
			segmentReferences:[Terminate,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
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
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Solution wise reporting : Success / Cancellation Count
    SWR: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename,typeofrun,statusText],
			segmentReferences:[TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
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
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Top 5 SelfHelp Automation and Bottom 5 SelfHelp Automation
    SH5: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [tilename],
			segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Proactive Resolution Success / Cancellation Count
    PAS: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [statusText],
			segmentReferences:[Proactive,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				et: {
					columns: [ETime]
				}
			}
		},
    //SelfHelp Resolution Success / Cancellation Count
    SHS: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [statusText],
			segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [site],
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Scheduled Resolution Success / Cancellation Count
    SCS: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [statusText],
			segmentReferences:[Scheduled,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				et: {
					columns: [ETime]
				}
			}
		},
    //OS-wise Automation
    OSA: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [os],
			segmentReferences:[TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				et: {
					columns: [ETime]
				}
			}
		},
    //OS-wise Automation Split
    OSAS: {
			type: `rollup`,
			measureReferences: [automationcount],
			dimensionReferences: [os,typeofrun],
			segmentReferences:[TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				et: {
					columns: [ETime]
				}
			}
		},
    //List of Automations Pre-Agg
    //Selfhelp
		SHHour: {
			type: `rollup`,
			dimensionReferences: [tilename,ETime,machine,username,os,site,statusText,typeofrun,clientver,idx],
      		segmentReferences:[SelfHelp,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [machine,site],
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Scheduled
    SCHour: {
			type: `rollup`,
      		dimensionReferences: [tilename,ETime,machine,username,os,site,statusText,typeofrun,clientver,idx],
      		segmentReferences:[Scheduled,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [machine,site],
				},
				et: {
					columns: [ETime]
				}
			}
		},
    //Proactive
    PAHour: {
			type: `rollup`,
      		dimensionReferences: [tilename1,ETime,machine,username,executedBy,os,site,statusText,typeofrun,clientver,idx],
      		segmentReferences:[Proactive,TName],
			timeDimensionReference: ETime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			},
			indexes: {
				main: {
					columns: [machine,site],
				},
				et: {
					columns: [ETime]
				}
			}
		},
		
	}
});