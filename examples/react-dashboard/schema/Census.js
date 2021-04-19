cube(`Census`, {
	sql: `select C.id, site,host,os,
       last AS 'ReportingTime'
       from core.Census as C`,
	joins: {

	},
	measures: {
		count: {
			type: `countDistinct`,
			sql: `host`,
			title: `Count`
		},
		deviceReported30: {
			sql: `host`,
			type: `countDistinct`,
			rollingWindow: {
				trailing: `30 day`,
				offset: `end`
			},
			drillMembers: [site, host, os, stime],
			title: `Device Reported in last 30 days`
		},
		deviceReported7: {
			sql: `host`,
			type: `countDistinct`,
			rollingWindow: {
				trailing: `1 week`,
				offset: `end`
			},
			drillMembers: [site, host, os, stime],
			title: `Device Reported in last 7 days`

		},
		deviceReported1: {
			sql: `host`,
			type: `countDistinct`,
			rollingWindow: {
				trailing: `24 hour`,
				offset: `end`
			},
			drillMembers: [site, host, os, stime],
			title: `Device Reported last 24 hours`
		},
		deviceReportedN: {
			sql: `host`,
			type: `countDistinct`,
			drillMembers: [site, host, os, stime],
			title: `Device Reported Today`
		},
		deviceReportedAll: {
			sql: `host`,
			type: `countDistinct`,
			rollingWindow: {
				trailing: `unbounded`,
				offset: `end`
			},
			drillMembers: [site, host, os, stime],
			title: `Devices Reported`
		},
	},
	dimensions: {
		idx: {
			sql: `id`,
			type: `number`,
			primaryKey: true
		},
		host: {
			type: `string`,
			sql: `host`,
			title: `Machine`,
			shown: true
		},
		site: {
			sql: `site`,
			type: `string`,
			title: `Site`,
			shown: true
		},
		os: {
			sql: `os`,
			type: `string`,
			title: `OS`,
			shown: true
		},
		stime: {
			sql: `from_unixtime(ReportingTime,'%Y-%m-%d %H:%i:%s')`,
			type: `string`,
			title: `ReportingTime`,
			shown: true
		},
		ReportingTime: {
			sql: `from_unixtime(ReportingTime,'%Y-%m-%d %H:%i:%s')`,
			type: `time`,
			title: `ReportingTime`,
			shown: true
		}
	},
	preAggregations: {
	  main: {
		  type: `originalSql`,
		  scheduledRefresh: true,
		},
	//Automation Dashboard
	CC1Hour: {
		type: `rollup`,
		measureReferences: [deviceReported1],
		timeDimensionReference: ReportingTime,
		granularity: `hour`,
		useOriginalSqlPreAggregations: true,
		partitionGranularity: `month`,
		scheduledRefresh: true,
		refreshKey: {
			every: `1 hour`,
			incremental: true,
		}
	},
	//Devices reported in Last 7 days
	CC7Hour: {
			type: `rollup`,
			measureReferences: [deviceReported7],
			timeDimensionReference: ReportingTime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
	//Devices reported in Last 30 days
	CC30Hour: {
			type: `rollup`,
			measureReferences: [deviceReported30],
			timeDimensionReference: ReportingTime,
			granularity: `hour`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
    //Insight : Device Reporting
    //Devices reported in 24-hours
    C1Hour: {
			type: `rollup`,
			measureReferences: [deviceReported1],
			dimensionReferences: [host,os,ReportingTime,site],
			timeDimensionReference: ReportingTime,
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
					columns: [host,site],
				}
			}
		},
    //Devices reported in Last 7 days
    C7Hour: {
			type: `rollup`,
			measureReferences: [deviceReported7],
			dimensionReferences: [host,os,ReportingTime,site],
			timeDimensionReference: ReportingTime,
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
					columns: [host,site],
				}
			}
		},
    //Devices reported in Last 30 days
    C30Hour: {
			type: `rollup`,
			measureReferences: [deviceReported30],
			dimensionReferences: [host,os,ReportingTime,site],
			timeDimensionReference: ReportingTime,
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
					columns: [host,site],
				}
			}
		}
	}
});