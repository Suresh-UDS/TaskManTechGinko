import {Http, Response} from '@angular/http';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from "../Interceptor/HttpClient"
import {map} from "rxjs/operator/map";
import {Inject, Injectable} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {AppConfig, ApplicationConfig, MY_CONFIG_TOKEN} from "./app-config";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SiteService} from "./siteService";
import {AssetService} from "./assetService";
import {EmployeeService} from "./employeeService";
import {ObjectUnsubscribedError} from "rxjs/Rx";
import {JobService} from "./jobService";
import {componentService} from "./componentService";

@Injectable()
export class DBService {

    db:any;
    sites:any;
    employee:any;
    jobs:any;
    asset:any;

    selectSite:any;
    selectEmployee:any;
    selectJobs:any;
    selectAsset:any;
    selectAMC:any;
    selectPPM:any;
    selectConfig:any;

    constructor(private sqlite: SQLite,private componentService:componentService,private jobService:JobService,private siteService:SiteService,public employeeService:EmployeeService, public assetService:AssetService) {

        this.selectSite = []
        this.selectEmployee = []
        this.selectJobs = []
        this.selectAsset = []
        this.selectAMC = []
        this.selectPPM = []
        this.selectConfig = []

        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
                this.db = db;
                console.log("Database connection")
                console.log(this.db)
            })


        // this.siteList();
        // this.employeeList()
        // this.job();
        // this.assetList()
        // this.setAsset();
        // this.setPPM()
    }


    //***create table from api response***/

    //Asset table
    setAsset()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE assetList", {})
                console.log("Set AssetList Data");
                var assetList;
                var param = [];
                var assetDetails;
                this.assetService.findAllAssets().subscribe(
                    response => {
                        console.log("Get asset response");
                        assetList = response;
                        console.log(assetList)
                        for (var i = 0; i < assetList.length; i++) {
                            var asset = assetList[i];
                            this.assetService.getAssetById(asset.id).subscribe(
                                response => {
                                    // console.log("Get assetbyId response");//
                                    assetDetails = response;
                                    // console.log(assetDetails)//
                                    // console.log("@"+assetDetails.title)
                                    param.push([assetDetails.id, assetDetails.active, assetDetails.title, assetDetails.code, assetDetails.assetType, assetDetails.assetGroup, assetDetails.siteId, assetDetails.siteName, assetDetails.block, assetDetails.floor, assetDetails.zone, assetDetails.manufacturerName, assetDetails.modelNumber, assetDetails.serialNumber, assetDetails.acquiredDate, assetDetails.purchasePrice, assetDetails.currentPrice, assetDetails.estimatedDisposePrice]);
                                },
                                error => {
                                    console.log("Get assetbyId error");//
                                })
                        }
                    },
                    error => {
                        console.log("Get asset error");
                    })


                var tablename = 'assetList'
                var createQuery = "create table IF NOT EXISTS assetList(id INT,active TEXT,title TEXT,code TEXT,assettype TEXT,assetGroup TEXT,siteId INT,siteName TEXT,block TEXT,floor TEXT,zone TEXT,manufacturerName TEXT,modelNumber TEXT,serialNumber TEXT,acquiredDate TEXT,purchasePrice TEXT,currentPrice TEXT,estimatedDisposePrice TEXT)";
                var insertQuery = "INSERT INTO assetList (id,active,title,code,assettype,assetGroup,siteId,siteName,block,floor,zone,manufacturerName,modelNumber,serialNumber,acquiredDate,purchasePrice,currentPrice,estimatedDisposePrice) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update assetList set active=?,title=?,code=?,assettype=?,assetGroup=?,siteId=?,siteName=?,block=?,floor=?,zone=?,manufacturerName=?,modelNumber=?,serialNumber=?,acquiredDate=?,purchasePrice=?,currentPrice=?,estimatedDisposePrice=? where id=? "

                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)

            }, 3000)
        })
    }

    //PPM Table
    setPPM()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE ppm", {})
                console.log("Set PPM Data");
                console.log(this.selectAsset)
                var ppms;
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    this.assetService.getAssetPPMSchedule(this.selectAsset[i].id).subscribe(
                        response => {
                            // console.log("Get asset PPM response");//
                            ppms = response;
                            // console.log(ppms)//
                            if (ppms.length > 0) {
                                for (var i = 0; i < ppms.length; i++) {
                                    param.push([ppms[i].id, ppms[i].title, ppms[i].status, ppms[i].frequency, ppms[i].frequencyPrefix, ppms[i].assetId, ppms[i].startDate, ppms[i].endDate])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset PPM error");
                        })
                }

                var tablename = 'ppm'
                var createQuery = "create table if not exists ppm(id INT,title TEXT,status TEXT,frequency TEXT,frequencyPrefix TEXT,assetId INT,startDate TEXT,endDate TEXT)"
                var insertQuery = "insert into ppm(id,title,status,frequency,frequencyPrefix,assetId,startDate,endDate) values(?,?,?,?,?,?,?,?)";
                var updateQuery = "update ppm set title=?,status=?,frequency=?,frequencyPrefix=?,assetId=?,startDate=?,endDate=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)
            }, 3000)
        })
    }

    //AMC Table
    setAMC()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE amc", {})
                console.log("Set AMC Data");
                console.log(this.selectAsset)
                var amcs;
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    this.assetService.getAssetAMCSchedule(this.selectAsset[i].id).subscribe(
                        response => {
                            // console.log("Get asset AMC response");//
                            amcs = response;
                            // console.log(amcs)//
                            if (amcs.length > 0) {
                                for (var i = 0; i < amcs.length; i++) {
                                    param.push([amcs[i].id, amcs[i].title, amcs[i].status, amcs[i].frequency, amcs[i].frequencyPrefix, amcs[i].assetId, amcs[i].startDate, amcs[i].endDate])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset AMC error");
                        })
                }
                var tablename = 'amc'
                var createQuery = "create table if not exists amc(id INT,title TEXT,status TEXT,frequency TEXT,frequencyPrefix TEXT,assetId INT, startDate TEXT,endDate TEXT)";
                var insertQuery = "insert into amc(id,title,status,frequency,frequencyPrefix,assetId,startDate,endDate) values(?,?,?,?,?,?,?,?)";
                var updateQuery = "update amc set title=?,status=?,frequency=?,frequencyPrefix=?,assetId=?,startDate=?,endDate=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)
            }, 3000)
        })
    }

    //Config Table
    setConfig()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE config", {})
                console.log("Set Config Data");
                console.log(this.selectAsset)
                var config;
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    this.assetService.getAssetConfig(this.selectAsset[i].assettype, this.selectAsset[i].id).subscribe(
                        response => {
                            // console.log("Get asset config response");//
                            // console.log(response) //
                            config = response;
                            if (config.length > 0) {
                                for (var i = 0; i < config.length; i++) {
                                    param.push([config[i].id, config[i].assetId, config[i].assetTitle, config[i].assetType, config[i].consumptionMonitoringRequired, config[i].max, config[i].min, config[i].name, config[i].rule, config[i].status, config[i].threshold, config[i].uom, config[i].userId, config[i].validationRequired, config[i].lastModifiedDate])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset Config error");
                        })
                }
                var tablename = 'config'
                var createQuery = "create table if not exists config(id INT,assetId INT,assetTitle TEXT,assetType TEXT,consumptionMonitoringRequired TEXT,max TEXT,min TEXT,name TEXT,rule TEXT,status TEXT,threshold TEXT,uom TEXT,userId TEXT,validationRequired TEXT,lastModifiedDate TEXT)";
                var insertQuery = "insert into config(id,assetId ,assetTitle,assetType,consumptionMonitoringRequired,max,min,name,rule,status,threshold,uom,userId,validationRequired,lastModifiedDate) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update config set assetId=?,assetTitle=?,assetType=?,consumptionMonitoringRequired=?,max=?,min=?,name=?,rule=?,status=?,threshold=?,uom=?,userId=?,validationRequired=?,lastModifiedDate=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)
            }, 3000)
        })
    }


    //Jobs
    setJobs()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE job", {})
                console.log("Set Job Data");
                console.log(this.selectAsset)
                var jobs;
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    var search = {assetId: this.selectAsset[i].id}
                    this.jobService.getJobs(search).subscribe(
                        response => {
                            // console.log("Getting Jobs response");//
                            // console.log(response);//
                            jobs = response.transactions;
                            if (jobs) {
                                for (var i = 0; i < jobs.length; i++) {
                                    param.push([jobs[i].id, jobs[i].assetId, jobs[i].title, jobs[i].employeeName, jobs[i].siteName, jobs[i].plannedEndTime, jobs[i].plannedStartTime, jobs[i].description, jobs[i].status, jobs[i].maintenanceType, jobs[i].checkInDateTimeFrom, jobs[i].checkInDateTimeTo])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset Jobs error");
                        })
                }
                var tablename = 'job'
                var createQuery = "create table if not exists job(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT)";
                var insertQuery = "insert into job(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo ) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update job set assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)
            }, 3000)

        })
    }

    //Tickets
    setTickets()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE ticket", {})
                console.log("Set Ticket Data");
                console.log(this.selectAsset)
                var tickets;
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    var search = {assetId: this.selectAsset[i].id}
                    this.jobService.searchTickets(search).subscribe(
                        response => {
                            // console.log("Getting Jobs response");//
                            // console.log(response);//
                            tickets = response.transactions;
                            if (tickets.length > 0) {
                                for (var i = 0; i < tickets.length; i++) {
                                    param.push([tickets[i].id, tickets[i].assetId, tickets[i].title, tickets[i].status, tickets[i].createdDate, tickets[i].createdBy])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset Jobs error");
                        })
                }
                var tablename = 'ticket'
                var createQuery = "create table if not exists ticket(id INT,assetId INT,title TEXT,status TEXT,createdDate TEXT,createdBy TEXT)";
                var insertQuery = "insert into ticket(id,assetId,title,status,createdDate,createdBy) values(?,?,?,?,?,?)";
                var updateQuery = "update ticket set assetId=?,title=?,status=?,createdDate=?,createdBy=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                }, 15000)
            }, 3000)
        })

    }

    //Site
    setSites()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE site", {})
                console.log("Set Site Data");
                var sites;
                var param = [];
                this.siteService.searchSite().subscribe(
                    response => {
                        console.log("Get site response");//
                        sites = response.json();
                        console.log(sites)//
                        if (sites.length > 0) {
                            for (var i = 0; i < sites.length; i++) {
                                param.push([sites[i].id, sites[i].name])
                            }
                        }
                    },
                    error => {
                        console.log("Get Site error");
                    })
                var tablename = 'site'
                var createQuery = "create table if not exists site(id INT,name TEXT)"
                var insertQuery = "insert into site(id,name) values(?,?)";
                var updateQuery = "update site set name=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )

                }, 15000)
            }, 3000)

        })
    }


    //Employee
    setEmployee()
    {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                this.db.executeSql("DROP TABLE employee", {})
                console.log("Set Site Data");
                var employee;
                var param = [];
                this.employeeService.getAllEmployees().subscribe(
                    response => {
                        console.log("Get site response");//
                        employee = response.json();
                        console.log(employee)//
                        if (employee.length > 0) {
                            for (var i = 0; i < employee.length; i++) {
                                param.push([employee[i].id], employee[i].name, employee[i].empId, employee[i].active, employee[i].enrolled_face, employee[i].designation, employee[i].faceAuthorised, employee[i].faceIdEnrolled, employee[i].fullName)
                            }
                        }
                    },
                    error => {
                        console.log("Get employee error");
                    })
                var tablename = 'employee'
                var createQuery = "create table if not exists employee(id INT,name TEXT,empId TEXT,active,enrolled_face TEXT,designation TEXT,faceAuthorised TEXT,faceIdEnrolled BOOLEAN,fullName)"
                var insertQuery = "insert into employee(id,name,empId,active,enrolled_face,designation,faceAuthorised,faceIdEnrolled,fullName) values(?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update employee set name=?,empId=?,active=?,enrolled_face=?,designation=?,faceAuthorised=?,faceIdEnrolled=?,fullName=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                    // this.componentService.closeLoader();
                }, 15000)
            }, 3000)

        })
    }






    //Create table
    create(tbl,create,insert,update,param)
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("CHECK")
                console.log(param)
                this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
                    //testing
                    console.log("Search Table")
                    console.log(data)
                    if (data.rows.length > 0) {
                        console.log("Table exists")
                        console.log("Table Name:" + data.rows.item(0).tbl_name);
                        console.log("Update table")
                        for (var i = 0; i < param.length; i++) {
                            this.db.executeSql(update, param[i]).then((data) => {
                            }, (error) => {
                                console.log("ERROR: " + JSON.stringify(error))
                            })
                        }
                    }
                    else {
                        console.log("No table");
                        console.log("Create table " + tbl);
                        this.db.executeSql(create, {}).then((data) => {
                            console.log(data)
                            for (var i = 0; i < param.length; i++) {
                                var query = insert;
                                this.db.executeSql(insert, param[i]).then((data) => {
                                    // console.log(data)//

                                }, (error) => {
                                    console.log("ERROR: " + JSON.stringify(error))
                                })
                            }

                            resolve("s")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })


                    }
                })
            }, 1000)
        })
    }

    ///Attendance set






    ///







    //***Get data from sqlite table***/

    //Asset
    getAsset()
    {
        this.selectAsset.splice(0,this.selectAsset.length)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Asset List Table");
                var addQuery = "select * from assetList";
                this.db.executeSql(addQuery, {}).then((data) => {
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectAsset.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectAsset)
                    resolve(this.selectAsset);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })
            }, 3000)
        })
    }


    //PPM
    getPPM(id)
    {
        console.log("ID:"+id)
        this.selectAMC.splice(0,this.selectAMC.length)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get PPM Table");
                var addQuery = "select * from ppm where assetId=?";
                this.db.executeSql(addQuery, [id]).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectAMC.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectAMC)
                    resolve(this.selectAMC);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }


    //AMC
    getAMC(id)
    {
        this.selectAMC.splice(0,this.selectAMC.length)
        console.log("ID:"+id)
        this.selectAMC.pop();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get AMC Table");
                var addQuery = "select * from amc where assetId=?";
                this.db.executeSql(addQuery, [id]).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectAMC.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectAMC)
                    resolve(this.selectAMC);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }


    //Config
    getConfig(id)
    {
        console.log("ID:"+id)
        this.selectConfig.splice(0,this.selectConfig.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Config Table");
                var addQuery = "select * from config where assetId=?";
                this.db.executeSql(addQuery,[id]).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectConfig.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectConfig)
                    resolve(this.selectConfig);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }

    //Jobs
    getJobs(id)
    {
        console.log("ID:"+id)
        this.selectJobs.splice(0,this.selectJobs.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Job Table");
                var addQuery = "select * from job where assetId=?";
                this.db.executeSql(addQuery,[id]).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectJobs.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectJobs)
                    resolve(this.selectJobs);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }

    //Get site
    getSite()
    {
        console.log("ID:")
        this.selectJobs.splice(0,this.selectSite.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
            console.log("**************")
            console.log(this.db);
            console.log("Select Site Table");
            var addQuery = "select * from site";
            this.db.executeSql(addQuery,{}).then((data)=>{
                if(data.row.length > 0)
                {
                    for(var i = 0;i<data.rows.length;i++)
                    {
                        this.selectSite.push(data.rows.item(i))
                    }
                }
                console.log(this.selectSite)
                resolve(this.selectJobs);
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error))
            })

            }, 3000)

        })
    }

    //getEmployee
    getEmployee()
    {
        console.log("ID:")
        this.selectEmployee.splice(0,this.selectEmployee.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Site Table");
                var addQuery = "select * from employee";
                this.db.executeSql(addQuery,{}).then((data)=> {
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectEmployee.push(data.rows.item(i))
                        }
                        console.log(this.selectEmployee)
                    }
                },(error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })
            }, 3000)

        })

    }

    //AssetByCode
    getAssetByCode(code)
    {
        console.log(code)
        // this.selectAsset.splice(0,this.selectAsset.length)
        var test = [];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Asset List by code Table");
                var addQuery = "select * from assetList where code like ?";
                //and active = ?  order by title"
                this.db.executeSql(addQuery, [code]).then((data) => {
                    console.log(data);
                    console.log(data.rows.item)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            test.push(data.rows.item(i))
                        }
                    }
                    console.log(test)
                    resolve(test);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })
            }, 3000)
        })
    }





    // **** //
























}