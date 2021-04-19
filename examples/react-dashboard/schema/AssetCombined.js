cube(`All`, {
	sql: `select from_unixtime(A.slatest,'%Y-%m-%d') as slatest,
    A.machineid as 'machineid',
   value->>'$.ntproducttype' as 'producttype',
   value->>'$.operatingsystem' as 'operatingsystem',
   value->>'$.osversionnumber' as 'osversion',
   value->>'$.ntinstalledservicepack' as 'servicepack',
    M.cust  as cust, C.host,
    M.host as 'machine',
   1 as count from asset.AssetData as A
    join asset.Machine as M on A.machineid = M.machineid
    join core.Census as C on C.host = M.host
    where A.dataid =16`,
	title: `All Properties`,
	description: `All Properties`,
	joins: {
		A10: {
			relationship: 'hasOne',
			sql: `${A10}.machineid = ${CUBE}.machineid`
		},
		A5: {
			relationship: 'hasOne',
			sql: `${A5}.machineid = ${CUBE}.machineid`
		},
		A39: {
			relationship: 'hasOne',
			sql: `${A39}.machineid = ${CUBE}.machineid`
		},
		A16: {
			relationship: 'hasOne',
			sql: `${A16}.machineid = ${CUBE}.machineid`
		},
		A7: {
			relationship: 'hasOne',
			sql: `${A7}.machineid = ${CUBE}.machineid`
		},
		A41: {
			relationship: 'hasOne',
			sql: `${A41}.machineid = ${CUBE}.machineid`
		},
		A20: {
			relationship: 'hasOne',
			sql: `${A20}.machineid = ${CUBE}.machineid`
		},
		A21: {
			relationship: 'hasOne',
			sql: `${A21}.machineid = ${CUBE}.machineid`
		},
		A13: {
			relationship: 'hasOne',
			sql: `${A13}.machineid = ${CUBE}.machineid`
		},
		A18: {
			relationship: 'hasOne',
			sql: `${A18}.machineid = ${CUBE}.machineid`
		},
		A56: {
			relationship: 'hasOne',
			sql: `${A56}.machineid = ${CUBE}.machineid`
		},

		GA: {
			relationship: 'belongsTo',
			sql: `${GA}.host = ${CUBE}.machine`
		}
	},

	measures: {
		DeviceCount: {
			type: `countDistinct`,
			sql: `machine`,
			title: `Device Count `,
		},
		maxDateCreated: {
			type: `max`,
			sql: `slatest`,
			title: `Maximum created`
		}
	},
	dimensions: {
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
		mid: {
			sql: `machineid`,
			type: `number`,
			primaryKey: true
		},
		site: {
			sql: `cust`,
			type: `string`,
			title: `Site`
		},
		producttype: {
			sql: `producttype`,
			type: `string`,
			title: `Product Type`
		},
		osversion: {
			sql: `osversion`,
			type: `string`,
			title: `Os Version`
		},
		operatingsystem: {
			sql: `operatingsystem`,
			type: `string`,
			title: `Operating System`
		},
		servicepack: {
			sql: `servicepack`,
			type: `string`,
			title: `Service Pack`
		},

		// A10 dimensions

		biosdate: {
			sql: `${A10}.biosdate`,
			type: `string`,
			title: `BIOS Date`
		},

		biosvendor: {
			sql: `${A10}.biosvendor`,
			type: `string`,
			title: `BIOS Vendor`
		},

		biosver: {
			sql: `${A10}.biosver`,
			type: `string`,
			title: `BIOS Version`
		},

		biossize: {
			sql: `${A10}.biossize`,
			type: `string`,
			title: `BIOS Size`
		},
		uuid: {
			sql: `${A10}.uuid`,
			type: `string`,
			title: `System UUID`
		},

		family: {
			sql: `${A10}.family`,
			type: `string`,
			title: `System Family`
		},

		sver: {
			sql: `${A10}.sver`,
			type: `string`,
			title: `System Version`
		},

		sysnum: {
			sql: `${A10}.sysnum`,
			type: `string`,
			title: `KU Number`
		},

		syswakeup: {
			sql: `${A10}.syswakeup`,
			type: `string`,
			title: `System Wakeup Type`
		},

		syssrlnum: {
			sql: `${A10}.syssrlnum`,
			type: `string`,
			title: `Serial Number`
		},

		systemmanufacturer: {
			sql: `${A10}.systemmanufacturer`,
			type: `string`,
			title: `System Manufacturer`
		},
		systemproduct: {
			sql: `${A10}.systemproduct`,
			type: `string`,
			title: `Product Name`
		},

		// A5 - Chassis dimensions

		lock: {
			sql: `${A5}.lock`,
			type: `string`,
			title: `Chassis Lock`
		},
		height: {
			sql: `${A5}.height`,
			type: `string`,
			title: `Chassis height`
		},
		version: {
			sql: `${A5}.version`,
			type: `string`,
			title: `Chassis Version`
		},
		assettag: {
			sql: `${A5}.assettag`,
			type: `string`,
			title: `Chassis Tag`
		},
		skunumber: {
			sql: `${A5}.skunumber`,
			type: `string`,
			title: `Chassis Info`
		},
		upstate: {
			sql: `${A5}.upstate`,
			type: `string`,
			title: `Chassis Upstate`
		},
		manufacturer: {
			sql: `${A5}.manufacturer`,
			type: `string`,
			title: `Chassis Manufacturer`
		},
		serialnumber: {
			sql: `${A5}.serialnumber`,
			type: `string`,
			title: `Chassis Serial Number`
		},

		chassistype: {
			sql: `${A5}.chassistype`,
			type: `string`,
			title: `Chassis Type`
		},
		chassissecurity: {
			sql: `${A5}.chassissecurity`,
			type: `string`,
			title: `Chassis Security`
		},

		// A39 Memory dimensions
		formfactor: {
			sql: `${A39}.formfactor`,
			type: `string`,
			title: `Memory Device - Form factor`
		},
		devicespeed: {
			sql: `${A39}.devicespeed`,
			type: `string`,
			title: `Memory Device - Speed`
		},
		memoryassettag: {
			sql: `${A39}.memoryassettag`,
			type: `string`,
			title: `Memory Device - Asset Tag`
		},

		datawidthinbits: {
			sql: `${A39}.datawidthinbits`,
			type: `string`,
			title: `Data Width in Bits`
		},
		devicetype: {
			sql: `${A39}.devicetype`,
			type: `string`,
			title: `Memory Type`
		},
		partnumber: {
			sql: `${A39}.partnumber`,
			type: `string`,
			title: `Part Number`
		},
		memmanufacturer: {
			sql: `${A39}.manufacturer`,
			type: `string`,
			title: `Memory Device - Manufacturer`
		},
		serialnum: {
			sql: `${A39}.serialnum`,
			type: `string`,
			title: `Memory Device - Serial Number`
		},

		memorysize: {
			sql: `${A39}.memorysize`,
			type: `string`,
			title: `Memory Size`
		},

		// A7 - DNS dimensions
		dnsserver: {
			sql: `${A7}.dnsserver`,
			type: `string`,
			title: `DNS Server`
		},

		// A41 Network Adapter dimensions

		networkadapter: {
			sql: `${A41}.networkadapter`,
			type: `string`,
			title: `Network Adapter Name`
		},
		ipaddress: {
			sql: `${A41}.ipaddress`,
			type: `string`,
			title: `IP address`
		},
		subnetmask: {
			sql: `${A41}.subnetmask`,
			type: `string`,
			title: `Subnet Mask`
		},
		defaultgateway: {
			sql: `${A41}.defaultgateway`,
			type: `string`,
			title: `Default Gateway`
		},
		dhcpserver: {
			sql: `${A41}.dhcpserver`,
			type: `string`,
			title: `DHCP Server`
		},
		dhcpsubnetmask: {
			sql: `${A41}.dhcpsubnetmask`,
			type: `string`,
			title: `DHCP Subnet Mask`
		},
		macaddress: {
			sql: `${A41}.macaddress`,
			type: `string`,
			title: `MAC address`
		},

		// A20 CPU dimensions
		processortype: {
			sql: `${A20}.processortype`,
			type: `string`,
			title: `Processor Type`
		},
		processorfamily: {
			sql: `${A20}.processorfamily`,
			type: `string`,
			title: `Processor Family`
		},
		processormanufacturer: {
			sql: `${A20}.processormanufacturer`,
			type: `string`,
			title: `Processor Manufacturer`
		},
		processorcurrentvoltage: {
			sql: `${A20}.processorcurrentvoltage`,
			type: `string`,
			title: `Processor Voltage`
		},
		processorcorecount: {
			sql: `${A20}.processorcorecount`,
			type: `string`,
			title: `Core Count`
		},
		processorcoreenabled: {
			sql: `${A20}.processorcoreenabled`,
			type: `string`,
			title: `Processor Core Enabled`
		},
		processorthreadcount: {
			sql: `${A20}.processorthreadcount`,
			type: `string`,
			title: `Processor Thread Count`
		},
		regdprocessor: {
			sql: `${A20}.regdprocessor`,
			type: `string`,
			title: `Processor Details`
		},
		processorspeed: {
			sql: `${A20}.processorspeed`,
			type: `string`,
			title: `Processor Speed`
		},
		processchar: {
			sql: `${A20}.processchar`,
			type: `string`,
			title: `Process Characteristics`
		},

		// A21 - properties dimensions

		timezone: {
			sql: `${A21}.timezone`,
			type: `string`,
			title: `Time Zone`
		},
		username: {
			sql: `${A21}.username`,
			type: `string`,
			title: `User Name`
		},
		machinename: {
			sql: `${A21}.machinename`,
			type: `string`,
			title: `Host Name`
		},

		//A18 - Physical mem array

		maximumcapacityingb: {
			sql: `${A18}.maximumcapacityingb`,
			type: `string`,
			title: `Memory Max Size`
		},

		//A13 - Mem Array

		arrayrangesize: {
			sql: `${A13}.arrayrangesize`,
			type: `string`,
			title: `Memory Array Size`
		},

		//A56 - Useraccountinfo

		domain: {
			sql: `${A56}.useraccountdomain`,
			type: `string`,
			title: `Domain`
		},



		LDate: {
			sql: `slatest`,
			type: `time`,
			title: `Latest Date`
		}
	},
	preAggregations: {
		main: {
			type: `originalSql`,
			refreshKey: {
				every: `1 hour`
			},
		},
		//Devices by Type
		DT: {
			type: `rollup`,
			measureReferences: [DeviceCount],
			dimensionReferences: [chassistype],
			timeDimensionReference: LDate,
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
					columns: [chassistype],
				},
			}
		},
		//Devices by Physical Memory
		DPM: {
			type: `rollup`,
			measureReferences: [DeviceCount],
			dimensionReferences: [arrayrangesize],
			timeDimensionReference: LDate,
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
					columns: [arrayrangesize],
				},
			}
		},
		//Device Summary Details
		DSD: {
			type: `rollup`,
			measureReferences: [maxDateCreated, DeviceCount],
			dimensionReferences: [site, machine, username, chassistype, systemmanufacturer, processortype, operatingsystem, arrayrangesize, maximumcapacityingb, regdprocessor, ipaddress],
			timeDimensionReference: LDate,
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
					columns: [site, machine],
				},
			}
		},
		//ASSIGN-MEM
		MEM: {
			type: `rollup`,
			measureReferences: [maxDateCreated, DeviceCount],
			dimensionReferences: [syssrlnum, username, arrayrangesize],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
		//CHASSIS-ASSET
		CHA: {
			type: `rollup`,
			measureReferences: [maxDateCreated, DeviceCount],
			dimensionReferences: [syssrlnum, chassistype, memoryassettag],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
		//OS-VERSION
		OSV: {
			type: `rollup`,
			measureReferences: [maxDateCreated, DeviceCount],
			dimensionReferences: [username, operatingsystem, osversion],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //MODEL-MGF and MODEL-MGF-LENOVO
        MMGF: {
			type: `rollup`,
			measureReferences: [maxDateCreated, DeviceCount],
			dimensionReferences: [syssrlnum,systemmanufacturer,systemproduct],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //IP-MAC
        IPMAC: {
			type: `rollup`,
			measureReferences: [maxDateCreated],
			dimensionReferences: [syssrlnum,ipaddress,macaddress],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //CPU-CORE-COUNT-THREAD
        CCCT: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [syssrlnum,processorcorecount,processorthreadcount],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //CPU-COUNT-MFG
        CCMFG: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [syssrlnum,processorcorecount,processormanufacturer],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //CPU-SPEED-TYPE
        CST: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [syssrlnum,processorspeed,processortype],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //DNS-SERVICEPACK
        DSP: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [syssrlnum,dnsserver,servicepack],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //G1 Allocation Device - Manufacturer Detail
        G1MD: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [machine,username,systemmanufacturer,systemproduct,syssrlnum,producttype,operatingsystem,osversion],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //G1 Allocation Device - Chassis Detail
        G1CD: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [machine,username,systemmanufacturer,systemproduct,syssrlnum,producttype,operatingsystem,osversion],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //G1 Allocation Device - Memory RAM Installed Count
        G1RAM: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [arrayrangesize],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //Device Count by OS
        DOSC: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [operatingsystem],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //Device by Manufacturer
        DMF: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [systemmanufacturer],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //Devices By Processor
        DBP: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [regdprocessor],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
        //Devices by Operating System
        DOS: {
			type: `rollup`,
			measureReferences: [maxDateCreated,DeviceCount],
			dimensionReferences: [operatingsystem],
			timeDimensionReference: LDate,
			granularity: `day`,
			useOriginalSqlPreAggregations: true,
			partitionGranularity: `month`,
			scheduledRefresh: true,
			refreshKey: {
				every: `1 hour`,
				incremental: true,
			}
		},
	}
});