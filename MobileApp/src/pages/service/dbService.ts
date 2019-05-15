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
import {AttendanceService} from "./attendanceService";
import {timeout} from "rxjs/operator/timeout";


@Injectable()
export class DBService {

    db:any;
    sites:any;
    employee:any;
    jobs:any;
    asset:any;
    page:1;
    selectSite:any;
    selectEmployee:any;
    selectJobs:any;
    selectCompleteJobs:any;
    selectAsset:any;
    selectAMC:any;
    selectPPM:any;
    selectConfig:any;
    selectPreviousReading:any;
    selectViewReading:any;
    selectReading:any;
    selectImage:any;
    selectAttendance:any;
    amcJobs: any;
    ppmJobs: any;
    savedImages:any;
    checkList:any;
     savedCheckList:any;

    constructor(private sqlite: SQLite,private componentService:componentService,private jobService:JobService,
                private siteService:SiteService,public employeeService:EmployeeService,public attendanceService:AttendanceService,public assetService:AssetService) {

        this.selectSite = [];
        this.selectEmployee = [];
        this.selectJobs = [];
        this.selectCompleteJobs =[];
        this.amcJobs = [];
        this.ppmJobs = [];
        this.selectAsset = [];
        this.selectAMC = [];
        this.selectPPM = [];
        this.selectConfig = [];
        this.selectPreviousReading = [];
        this.selectViewReading = [];
        this.selectReading = []
        this.selectImage = [];
        this.selectAttendance = [];
        this.savedImages = [];
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
                this.db = db;
                console.log("Database connection")
                console.log(this.db)
            })
    }


    //***create table from api response***/

    //Asset table
    setAsset()
    {
        console.log(this.db);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.sqlite.create({
                    name: 'data.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    this.db = db;
                    console.log("Database connection")
                    console.log(this.db)

                    this.db.executeSql("DELETE FROM  assetList", {})
                    console.log("Set AssetList Data");
                    var assetList;
                    var param = [];
                    var assetDetails;
                    var searchCriteria ={
                        currPage:this.page+1
                    };
                    this.assetService.searchAssets(searchCriteria).subscribe(
                        response => {
                            console.log("Get asset response");
                            assetList = response.transactions;
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
                            response => {
                                resolve(response)
                            }
                        )
                    }, 15000)
                })
            }, 3000)
        })
    }


    //Config Table

    //Site
    // dropTable(){
    //     this.db.executeSql("DROP TABLE site");
    // }



    //Site
    setSites()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // this.db.executeSql("DROP TABLE site", {})
                console.log("Set Site Data");
                var sites;
                var param = [];
                this.siteService.searchSite().subscribe(
                    response => {
                        console.log("Get site response");//
                        sites = response;
                        console.log(sites)//
                        if (sites.length > 0) {
                            for (var i = 0; i < sites.length; i++) {
                                param.push([sites[i].id, sites[i].name])
                            }
                        }
                    },
                    error => {
                        console.log("Get Site error");
                    });
                var tablename = 'site'
                var createQuery = "create table if not exists site(id INT ,name TEXT)";
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


    //PPM Table
    setPPM()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // this.db.executeSql("DROP TABLE ppm", {})
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
                // this.db.executeSql("DROP TABLE amc", {})
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
                // this.db.executeSql("DROP TABLE config", {})
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
                // this.db.executeSql("DROP TABLE job", {})
                console.log("Set Job Data");
                console.log(this.selectAsset);
                var jobs;
                var param = [];
                var checklistItem;
                var checklist =[];

              // for (var i = 0; i < this.selectAsset.length; i++) {

                    var search = {report:true,checkInDateTimeFrom:new Date(),scheduled:true};
                    this.jobService.getJobs(search).subscribe(
                        response => {
                            console.log("Getting Jobs response");
                            console.log(response);
                            jobs = response.transactions;
                            if (jobs) {
                                for (var i = 0; i < jobs.length; i++) {
                                    param.push([jobs[i].id, jobs[i].assetId, jobs[i].title, jobs[i].employeeName, jobs[i].siteName, jobs[i].plannedEndTime, jobs[i].plannedStartTime, jobs[i].description, jobs[i].status, jobs[i].maintenanceType, jobs[i].checkInDateTimeFrom, jobs[i].checkInDateTimeTo,jobs[i].employeeId,jobs[i].employeeEmpId,jobs[i].siteId])
                                  if(jobs[i].checklistItems && jobs[i].checklistItems.length >0){
                                    checklistItem = jobs[i].checklistItems;
                                    console.log("checklistItems",checklistItem);
                                    for(var j=0; j< checklistItem.length ;j++){
                                        console.log("checklist item",checklistItem);
                                        checklist.push([checklistItem[j].checklistItemName,checklistItem[j].checklistName,checklistItem[j].image_1,jobs[i].id,checklistItem[j].completed,checklistItem[j].remarks]);
                                        console.log("checklistpush",checklist);
                                      }
                                  }
                                }
                            }
                        },
                        error => {
                            console.log("Get asset Jobs error");
                        })
                // }

              var tablenamechklist ='checklist'
              var createQuerychklist = "create table if not exists checklist(id INTEGER PRIMARY KEY AUTOINCREMENT, checklistItemName TEXT,checklistName TEXT,image_1 TEXT,jobId INT,completed TEXT,remarks TEXT)";
              var insertQuerychklist = "insert into checklist(checklistItemName,checklistName,image_1,jobId,completed,remarks) values(?,?,?,?,?,?)";
              var updateQuerychklist = "update checklist set checklistItemName,checklistName,image_1,jobId,completed,remarks where jobId=?" ;

              setTimeout(()=>{
                this.createCheckList(tablenamechklist,createQuerychklist,insertQuerychklist,updateQuerychklist,checklist).then(
                  response=>{
                    resolve(response);
                  }
                )
              },15000)

                var tablename = 'job'
                var createQuery = "create table if not exists job(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT,employeeId TEXT,employeeEmpId TEXT,siteId TEXT,offlineUpdate INTEGER DEFAULT 0,offlineCompleteResponse INTEGER DEFAULT 0)";
                var insertQuery = "insert into job(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo,employeeId,employeeEmpId,siteId ) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update job set assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo,employeeId,employeeEmpId,siteId where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response);
                        }
                    )
                }, 15000)
            }, 3000)

        })
    }


    //PPM Jobs
    setPPMJobs()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // this.db.executeSql("DROP TABLE job", {})
                console.log("Set Job Data");
                console.log(this.selectAsset)
                var jobs = [];
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    var search = {assetId: this.selectAsset[i].id,report:true,maintenanceType:'PPM'}
                    this.jobService.getJobs(search).subscribe(
                        response => {
                            console.log("Getting PPM Jobs response");//
                            console.log(response);//
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
                var tablename = 'ppmJob'
                var createQuery = "create table if not exists ppmJob(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT)";
                var insertQuery = "insert into ppmJob(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo ) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update ppmJob set assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo where id=? ";
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


    //AMC Jobs

    setAMCJobs()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // this.db.executeSql("DROP TABLE job", {})
                console.log("Set Job Data");
                console.log(this.selectAsset)
                var jobs = [];
                var param = [];
                for (var i = 0; i < this.selectAsset.length; i++) {
                    var search = {assetId: this.selectAsset[i].id,report:true,maintenanceType:'AMC'}
                    this.jobService.getJobs(search).subscribe(
                        response => {
                            console.log("Getting AMC Jobs response");//
                            console.log(response);//
                            jobs = response.transactions;
                            if (jobs) {
                                console.log("Amc job length");
                                console.log(jobs.length);
                                for (var i = 0; i < jobs.length; i++) {
                                    console.log(i);
                                    param.push([jobs[i].id, jobs[i].assetId, jobs[i].title, jobs[i].employeeName, jobs[i].siteName, jobs[i].plannedEndTime, jobs[i].plannedStartTime, jobs[i].description, jobs[i].status, jobs[i].maintenanceType, jobs[i].checkInDateTimeFrom, jobs[i].checkInDateTimeTo])
                                }
                            }
                        },
                        error => {
                            console.log("Get asset Jobs error");
                        })
                }
                var tablename = 'amcJob'
                var createQuery = "create table if not exists amcJob(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT)";
                var insertQuery = "insert into amcJob(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo ) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update amcJob set assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo where id=? ";
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
                // this.db.executeSql("DROP TABLE ticket", {})
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

    //Employee
    setEmployee()
    {
        // this.db.executeSql('DROP TABLE employee');
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                console.log("Set Employee Data");
                var employee;
                var param = [];
                for(var j=0;j<this.selectSite.length;j++){
                    var searchCriteria = {
                        currPage:1,
                        pageSort: 15,
                        siteId:this.selectSite[j].id,
                        report:true
                    };
                    this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(response=>{
                        employee = [];
                        employee = response.transactions;
                        console.log(employee);
                        if (employee.length > 0) {
                            for (var i = 0; i < employee.length; i++) {
                                if(employee[i].attendanceId>0){
                                    param.push([employee[i].id,employee[i].empId, employee[i].id, employee[i].fullName,employee[i].active,employee[i].faceAuthorised,employee[i].checkedIn,true,this.selectSite[j],employee[i].siteName,employee[i].attendanceId]);

                                }else{
                                    param.push([employee[i].id,employee[i].empId, employee[i].id, employee[i].fullName,employee[i].active,employee[i].faceAuthorised,employee[i].checkedIn,false,this.selectSite[j],employee[i].siteName,employee[i].attendanceId]);

                                }
                            }
                        }
                    })

                }
                var tablename = 'employee';
                var createQuery = "create table if not exists employee(id INT,empId INT,employeeId INT,fullName TEXT,active TEXT,faceAuthorised BOOLEAN,checkedIn BOOLEAN,notCheckedOut BOOLEAN,siteId INT,siteName TEXT,attendanceId)"
                var insertQuery = "insert into employee(id,empId,employeeId,fullName,active,faceAuthorised,checkedIn,notCheckedOut,siteId,siteName,attendanceId) values(?,?,?,?,?,?,?,?,?,?,?)";
                var updateQuery = "update employee set employeeEmpId,employeeId,employeeFullName,active,faceAuthorised=?,checkedIn=?,notCheckedOut=?,siteName=?,attendanceId=? where id=? ";
                setTimeout(() => {
                    this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                        response=>{
                            resolve(response)
                        }
                    )
                    // this.componentService.closeLoader();
                }, 15000)
            }, 3000)
        });
    }

    updateEmployee(empId,flag,flag1)
    {
        console.log(empId)
        return new Promise((resolve, reject) => {
            var updateQuery = "update employee set checkedIn=?,notCheckedOut=? where employeeId=? ";
            this.db.executeSql(updateQuery, [flag,flag1,empId]).then((data) => {
                console.log(data)
                resolve("s")
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error))
            })
        })
    }








            dropReadingTable()
            {
                return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        this.db.executeSql("DELETE FROM  readings", {}).then((data) => {
                            console.log(data)
                            resolve("drop reading table")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })
                    },1000)
                })
            }

            dropPPMJobTable(){
                return new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                        this.db.executeSql("DELETE FROM  ppmJob", {}).then((data) => {
                            console.log(data)
                            resolve("drop ppm jobs table")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })
                    },1000)
                })
            }

            dropAMCJobTable(){
                return new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                        this.db.executeSql("DELETE FROM  amcJob", {}).then((data) => {
                            console.log(data)
                            resolve("drop amc jobs table")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })
                    },1000)
                })
            }

            dropImageTable()
            {
                return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        this.db.executeSql("DELETE FROM  image", {}).then((data) => {
                            console.log(data)
                            resolve("drop Image table")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })
                    },1000)
                })
            }

            //k
            setReadings(readings)
            {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log("Asset Reading Data");

                        var param = [readings.name, readings.uom, readings.initialValue, readings.finalValue, readings.consumption, readings.assetId,readings.assetParameterConfigId]

                        var tablename = 'readings';
                        var createQuery = "create table if not exists readings (name VARCHAR,uom VARCHAR,initialValue INT,finalValue INT,consumption VARCHAR,assetId INT,assetParameterConfigId INT)";
                        var insertQuery = "INSERT INTO readings(name,uom,initialValue,finalValue,consumption,assetId,assetParameterConfigId) VALUES (?,?,?,?,?,?,?)"
                        var updateQuery = "update readings set name=?,uom=?,initialValue=?,finalValue=?,consumption=?,assetParameterConfigId where assetId=? ";

                        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tablename]).then((data) => {
                            //testing
                            console.log("Search Table");
                            console.log(data);
                            if (data.rows.length > 0) {
                                console.log("Table exists");
                                console.log("Table Name:" + data.rows.item(0).tbl_name);
                                console.log("Create table " + tablename);

                                this.db.executeSql(insertQuery, param).then((data) => {
                                    console.log(data)//
                                    var param1 = [readings.name, readings.uom, readings.initialValue, readings.initialValueTime,readings.finalValue, readings.consumption, readings.assetId,readings.assetParameterConfigId,readings.consumptionMonitoringRequired,readings.assetType]

                                    this.db.executeSql("INSERT INTO viewReading(name,uom,initialValue,initialValueTime,finalValue,consumption,assetId,assetParameterConfigId,consumptionMonitoringRequired,assetType) VALUES (?,?,?,?,?,?,?,?,?,?)", param1).then((data) => {
                                        console.log(data)//

                                    }, (error) => {
                                        console.log("ERROR: " + JSON.stringify(error))
                                    })
                                    resolve("s")
                                }, (error) => {
                                    console.log("ERROR: " + JSON.stringify(error))
                                })


                            }
                            else {
                                console.log("No table");
                                console.log("Create table " + tablename);
                                this.db.executeSql(createQuery, {}).then((data) => {
                                    console.log(data)
                                    this.db.executeSql(insertQuery, param).then((data) => {
                                        // console.log(data)//
                                        this.db.executeSql("INSERT INTO viewReading(name,uom,initialValue,initialValueTime,finalValue,FinalValueTime,consumption,assetId,assetParameterConfigId,consumptionMonitoringRequired,assetType) VALUES (?,?,?,?,?,?,?,?,?,?,?)", param).then((data) => {
                                            console.log(data)//
                                            var param1 = [readings.name, readings.uom, readings.initialValue, readings.initialValueTime,readings.finalValue, readings.consumption, readings.assetId,readings.assetParameterConfigId,readings.consumptionMonitoringRequired,readings.assetType]

                                            this.db.executeSql("INSERT INTO viewReading(name,uom,initialValue,initialValueTime,finalValue,consumption,assetId,assetParameterConfigId,consumptionMonitoringRequired,assetType) VALUES (?,?,?,?,?,?,?,?,?,?)", param1).then((data) => {
                                                console.log(data)//

                                            }, (error) => {
                                                console.log("ERROR: " + JSON.stringify(error))
                                            })
                                        }, (error) => {
                                            console.log("ERROR: " + JSON.stringify(error))
                                        })
                                    }, (error) => {
                                        console.log("ERROR: " + JSON.stringify(error))
                                    })
                                    resolve("s")
                                }, (error) => {
                                    console.log("ERROR: " + JSON.stringify(error))
                                })


                            }
                        })

                    }, 3000)
                })

            }


            setReadingsList(asset)
            {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // this.db.executeSql("DROP TABLE readingsList", {})
                        console.log("Asset Reading Data Local");
                        var readingsList;
                        var param = [];
                        var search = {assetId: asset.id}
                        this.assetService.saveReading(search).subscribe(
                            response => {
                                // console.log("Getting Jobs response");//
                                // console.log(response);//
                                readingsList= response.transactions;
                                if (readingsList> 0) {
                                    for (var i = 0; i < readingsList; i++) {
                                        param.push([readingsList[i].name, readingsList[i].uom, readingsList[i].value, readingsList[i].assetId,readingsList[i].assetParameterConfigId,readingsList[i].consumptionMonitoringRequired])
                                    }
                                }
                            },
                            error => {
                                console.log("Get asset readings error");
                            })

                        var tablename = 'readingsList'
                        var createQuery = "create TABLE IF NOT EXISTS readingsList (name VARCHAR,uom VARCHAR,value INT,assetId INT,assetParameterConfigId INT,consumptionMonitoringRequired BOOLEAN)";
                        var insertQuery = "INSERT INTO readingList(name,uom,value,assetId,assetParameterConfigId,consumptionMonitoringRequired) VALUES (?,?,?,?,?,?)"
                        var updateQuery = "update readingList set name=?,uom=?,value=?,assetParameterConfigId=?,consumptionMonitoringRequired=? where assetId=? ";
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

//k
            setViewReading()
            {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // this.db.executeSql("DROP TABLE viewReading", {})
                        console.log("Asset View Reading Data");
                        var viewReading;
                        var param = [];
                        var asset=this.selectAsset;
                        for(var j=0;j<this.selectAsset.length;j++){
                            var search = {assetId: asset[j].id}
                            this.assetService.viewReading(search).subscribe(
                                response => {
                                    // console.log("Getting Jobs response");//
                                    // console.log(response);//
                                    viewReading= response.transactions;
                                    console.log(viewReading)
                                    if (viewReading) {
                                        for (var i = 0; i < viewReading.length; i++) {
                                            param.push([viewReading[i].id,viewReading[i].name, viewReading[i].uom, viewReading[i].initialValue,viewReading[i].initialReadingTime, viewReading[i].finalValue,viewReading[i].finalReadingTime, viewReading[i].consumption,viewReading[i].assetId,viewReading[i].assetParameterConfigId,viewReading[i].consumptionMonitoringRequired,viewReading[i].assetType])
                                        }
                                    }
                                },
                                error => {
                                    console.log("Get Asset View Readings Error");
                                });
                        }


                        var tablename = 'viewReading';
                        var createQuery = "create table if not exists viewReading (id INT,name VARCHAR,uom VARCHAR,initialValue INT,initialValueTime DATE,finalValue INT,finalValueTime DATE,consumption VARCHAR,assetId INT,assetParameterConfigId INT,consumptionMonitoringRequired BOOLEAN,assetType TEXT)";
                        var insertQuery = "INSERT INTO viewReading(id,name,uom,initialValue,initialValueTime,finalValue,FinalValueTime,consumption,assetId,assetParameterConfigId,consumptionMonitoringRequired,assetType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                        var updateQuery = "update viewReading set id,name=?,uom=?,initialValue=?,initialValueTime,finalValue=?,FinalValueTime=?,consumption=?,assetParameterConfigId,consumptionMonitoringRequired,assetType where assetId=? ";
                        setTimeout(() => {
                            this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                                response=>{
                                    resolve(response)
                                }
                            )
                        }, 25000)
                    }, 3000)
                })

            }



//k
            setAssetPreviousReading()
            {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // this.db.executeSql("DROP TABLE PreviousReading", {})
                        console.log("Asset Previous Reading Data");
                        var assetPreviousReading;
                        var param = [];
                        // var asset=this.selectAsset;
                        // var search = {assetId: asset.id}

                        for(var k=0;k< this.selectAsset.length;k++)
                        {
                            // console.log(this.selectAsset[k]);
                            // console.log(this.selectAsset[k].id,this.selectAsset[k].assettype);
                            this.assetService.getAssetConfig(this.selectAsset[k].assettype,this.selectAsset[k].id).subscribe(
                                response => {
                                    // console.log("Getting Jobs response");//
                                    // console.log(response);//
                                    var config = response;
                                    for (var j = 0; j < config.length; j++) {

                                        this.assetService.getAssetPreviousReadings(config[j].assetId, config[j].id).subscribe(
                                            response => {
                                                // console.log("Getting Jobs response");//
                                                console.log(response);//
                                                assetPreviousReading = response;
                                                param.push([assetPreviousReading.name, assetPreviousReading.uom, assetPreviousReading.initialValue, assetPreviousReading.initialReadingTime, assetPreviousReading.finalValue, assetPreviousReading.finalReadingTime, assetPreviousReading.consumption, assetPreviousReading.assetId, assetPreviousReading.assetParameterConfigId, assetPreviousReading.consumptionMonitoringRequired])

                                            },
                                            error => {
                                                console.log("Get Asset Previous Readings Error");
                                            })

                                    }

                                },error=>{

                                })
                        }

                        var tablename = 'PreviousReading'
                        var createQuery = "create table if not exists PreviousReading (name VARCHAR,uom VARCHAR,initialValue INT,initialValueTime DATE,finalValue INT,finalValueTime DATE,consumption VARCHAR,assetId INT,assetParameterConfigId INT,consumptionMonitoringRequired BOOLEAN,value INT)";
                        var insertQuery = "INSERT INTO PreviousReading(name,uom,initialValue,initialValueTime,finalValue,FinalValueTime,consumption,assetId,assetParameterConfigId,consumptionMonitoringRequired,value) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
                        var updateQuery = "update PreviousReading set name=?,uom=?,initialValue=?,initialValueTime,finalValue=?,FinalValueTime=?,consumption=?,assetParameterConfigId,consumptionMonitoringRequired,value where assetId=? ";


                        setTimeout(() => {
                            this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
                                response=>{
                                    resolve(response)
                                }
                            )
                        }, 25000)


                    }, 3000)
                })

            }

    //Drop attendance

    dropAttendance()
    {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                this.db.executeSql('DELETE FROM  attendance');
                resolve("Drop table attendance")
            },3000)
        })
    }

    dropEmployee(){
                return new Promise((resolve, reject)=>{
                    setTimeout(()=>{
                        this.db.executeSql('DELETE FROM employee');
                        resolve("Drop table employee");
                    },3000)
                })
    }

            //Attendance set
            setAttendance(attendance)
            {

                // this.db.executeSql('DROP TABLE attendance');
                return new Promise((resolve, reject) => {
                    setTimeout(()=>{



                        console.log(attendance)
                        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", ['attendance']).then((data) => {
                            //testing
                            console.log("Search Table");
                            console.log(data)
                            if (data.rows.length > 0) {
                                console.log("Table exists");
                                console.log("Table Name:" + data.rows.item(0).tbl_name);
                                console.log("Update Table")
                                var table = data.rows.item(0).tbl_name

                                if(attendance.offlineCheckin)
                                {
                                    var param = [ attendance.id ,attendance.siteId, attendance.employeeEmpId, attendance.latitudeIn,attendance.longitudeIn, attendance.checkInImage, attendance.checkInTime,attendance.offlineAttendance,attendance.checkOutImage,attendance.checkOutTime,attendance.offlineCheckin,attendance.attendanceId];

                                    var insertQuery = "insert into attendance(employeeId,siteId,employeeEmpId,latitudeIn,longitudeIn,checkInImage,checkInTime,offlineAttendance,checkOutImage,checkOutTime,offlineCheckin,attendanceId) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                                    this.db.executeSql(insertQuery, param).then((data) => {
                                        console.log(data)//
                                        resolve("s")
                                    }, (error) => {
                                        console.log("ERROR: " + JSON.stringify(error))
                                    })
                                }
                                else {

                                    if(attendance.attendanceId == 0)
                                    {
                                        var param = [ attendance.id ,attendance.siteId, attendance.employeeEmpId, attendance.latitudeIn,attendance.longitudeIn, attendance.checkInImage, attendance.checkInTime,attendance.offlineAttendance,attendance.checkOutImage,attendance.checkOutTime,attendance.attendanceId];
                                        var updateQuery = "update attendance set checkOutImage=?,checkOutTime=? where employeeId=? ";
                                        this.db.executeSql(updateQuery, [attendance.checkOutImage,attendance.checkOutTime,attendance.id]).then((data) => {
                                            console.log(data)
                                            resolve("s")
                                        }, (error) => {
                                            console.log("ERROR: " + JSON.stringify(error))
                                        })
                                    }
                                    else
                                    {
                                        var param = [ attendance.id ,attendance.siteId, attendance.employeeEmpId, attendance.latitudeIn,attendance.longitudeIn, attendance.checkInImage, attendance.checkInTime,attendance.offlineAttendance,attendance.checkOutImage,attendance.checkOutTime,attendance.attendanceId];
                                        var insertQuery = "insert into attendance(employeeId,siteId,employeeEmpId,latitudeIn,longitudeIn,checkInImage,checkInTime,offlineAttendance,checkOutImage,checkOutTime,attendanceId) values(?,?,?,?,?,?,?,?,?,?,?)";
                                        this.db.executeSql(insertQuery, param).then((data) => {
                                            console.log(data)//
                                            resolve("s")
                                        }, (error) => {
                                            console.log("ERROR: " + JSON.stringify(error))
                                        })

                                    }



                                }


                            }
                            else {
                                console.log("No table");
                                console.log("Create table attendance" );
                                var param = [ attendance.id ,attendance.siteId, attendance.employeeEmpId, attendance.latitudeIn,attendance.longitudeIn, attendance.checkInImage, attendance.checkInTime,attendance.offlineAttendance,attendance.checkOutImage,attendance.checkOutTime,attendance.offlineCheckin,attendance.attendanceId];
                                var createQuery = "create table if not exists attendance(id INTEGER  PRIMARY KEY  AUTOINCREMENT,employeeId INT,siteId INT,employeeEmpId INT,latitudeIn TEXT,longitudeIn TEXT,checkInImage TEXT,checkInTime TEXT,offlineAttendance BOOLEAN,checkOutImage TEXT,checkOutTime TEXT,offlineCheckin,attendanceId)"
                                var insertQuery = "insert into attendance(employeeId,siteId,employeeEmpId,latitudeIn,longitudeIn,checkInImage,checkInTime,offlineAttendance,checkOutImage,checkOutTime,offlineCheckin,attendanceId) values(?,?,?,?,?,?,?,?,?,?,?,?)";
                                this.db.executeSql(createQuery, {}).then((data) => {
                                    console.log(data);
                                    this.db.executeSql(insertQuery, param).then((data) => {
                                        console.log(data)//
                                        resolve("s")
                                    }, (error) => {
                                        console.log("ERROR: " + JSON.stringify(error))
                                    })
                                },(error)=>{
                                    console.log("ERROR: " + JSON.stringify(error))
                                })


                            }
                        })

                    },3000)
                })

            }

    //Create table
    create(tbl,create,insert,update,param)
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("CHECK");
                console.log(param);
                this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
                    //testing
                    console.log("Search Table");
                    console.log(data)
                    if (data.rows.length > 0) {
                        console.log("Table exists");
                        console.log("Table Name:" + data.rows.item(0).tbl_name);
                        console.log("Drop Table")
                        var table = data.rows.item(0).tbl_name
                        this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
                            console.log(data);
                        })
                        // console.log("Update table");
                        // for (var i = 0; i < param.length; i++) {
                        //     this.db.executeSql(update, param[i]).then((data) => {
                        //     }, (error) => {
                        //         console.log("ERROR: " + JSON.stringify(error))
                        //     })
                        // }

                        console.log("Create table " + tbl);
                        console.log(create);
                        console.log(param);
                        console.log(param.length);
                        this.db.executeSql(create, {}).then((data) => {
                            console.log(data);
                            console.log("length",param.length);
                            for (var i = 0; i < param.length; i++) {
                                var query = insert;
                                this.db.executeSql(insert, param[i]).then((data) => {
                                    console.log(data)//

                                }, (error) => {
                                    console.log("ERROR: " + JSON.stringify(error))
                                })
                            }

                            resolve("s")
                        }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                        })
                    }
                    else {
                        console.log("No table");
                        console.log("Create table " + tbl);
                        console.log(create);
                        console.log(param);
                        console.log(param.length);
                        this.db.executeSql(create, {}).then((data) => {
                            console.log(data);
                            for (var i = 0; i < param.length; i++) {
                                var query = insert;
                                this.db.executeSql(insert, param[i]).then((data) => {
                                    console.log(data)//

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


    //create table for checklist
  createCheckList(tbl,create,insert,update,param)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("CHECK List");
        console.log(param);
        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
          //testing
          console.log("Search Table");
          console.log(data)
          if (data.rows.length > 0) {
            console.log("Table exists");
            console.log("Table Name:" + data.rows.item(0).tbl_name);
            console.log("Drop Table")
            var table = data.rows.item(0).tbl_name
            this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
              console.log(data);
            })
            // console.log("Update table");
            // for (var i = 0; i < param.length; i++) {
            //     this.db.executeSql(update, param[i]).then((data) => {
            //     }, (error) => {
            //         console.log("ERROR: " + JSON.stringify(error))
            //     })
            // }

            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              console.log("length",param.length);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log("create checklist",data);

                }, (error) => {
                  console.log("ERROR: " + JSON.stringify(error))
                })
              }

              resolve("s")
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error))
            })
          }
          else {
            console.log("No table");
            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

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
                    reject("Error")
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
    getConfig(type,id)
    {
        console.log("ID:"+id)
        this.selectConfig.splice(0,this.selectConfig.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Config Table");
                var addQuery = "select * from config where assetType=? and assetId=?";
                this.db.executeSql(addQuery,[type,id]).then((data) => {
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

    // previousReading

    getPreviousReading(assetId,configId)
    {
        console.log("ID:"+assetId)
        this.selectPreviousReading.splice(0,this.selectPreviousReading.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Config Table");
                var addQuery = "select * from previousReading where assetParameterConfigId=? and assetId=?";
                this.db.executeSql(addQuery,[configId,assetId]).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectPreviousReading.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectPreviousReading)
                    resolve(this.selectPreviousReading);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }

    getViewReading(search)
    {
        console.log("ID:"+search.assetId)
        this.selectViewReading.splice(0,this.selectViewReading.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get ViewReading Table");
                var addQuery = "select * from viewReading where assetId=?";
                this.db.executeSql(addQuery,[search.assetId]).then((data) => {
                        console.log(data);
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectViewReading.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectViewReading)
                    resolve(this.selectViewReading);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }


    //Jobs
    getJobs()
    {
        this.selectJobs.splice(0,this.selectJobs.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Job Table");
                var addQuery = "select * from job";
                this.db.executeSql(addQuery,{}).then((data) => {
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

    //Completed Jobs
    getCompletedJobs(){
      this.selectJobs.splice(0,this.selectJobs.length);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("**************")
          console.log(this.db);
          console.log("Select Get Job Table");
          var addQuery = "select * from job where offlineUpdate='1'";
          this.db.executeSql(addQuery,{}).then((data) => {
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

    //AMCJobs
    getAMCJobs(id,amc)
    {
        console.log("ID:"+id);
        console.log("amc"+amc);
        this.selectJobs.splice(0,this.amcJobs.length);
        this.amcJobs = [];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Job Table");
                var addQuery = "select DISTINCT * from job where assetId='"+id+"' AND maintenanceType='"+amc+"'";
                console.log(addQuery);
                this.db.executeSql(addQuery,{}).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.amcJobs.push(data.rows.item(i))
                        }
                    }
                    console.log(this.amcJobs)
                    resolve(this.amcJobs);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                })

            }, 3000)

        })

    }

    //PPM Jobs
    getPPMJobs(id,ppm)
    {
        console.log("ID:"+id);
      console.log("ppm:"+ppm);
        this.selectJobs.splice(0,this.ppmJobs.length);
        this.ppmJobs = [];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Get Job Table");
                var addQuery = "select DISTINCT * from job where assetId='"+id+"' AND maintenanceType='"+ppm+"'";
                console.log(addQuery);
                this.db.executeSql(addQuery,{}).then((data) => {
                    console.log(data)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.ppmJobs.push(data.rows.item(i))
                        }
                    }
                    console.log(this.ppmJobs)
                    resolve(this.ppmJobs);
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
                if(data.rows.length > 0)
                {
                    for(var i = 0;i<data.rows.length;i++)
                    {
                        this.selectSite.push(data.rows.item(i))
                    }
                }



                console.log(this.selectSite)
                resolve(this.selectSite);
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
                var addQuery = "select DISTINCT * from employee";
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
                        console.log(test)
                        resolve(test);
                    }

                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                    reject(error)
                })
            }, 3000)
        })
    }




    //***Get data from sqlite table***/


    //Get site
    // getSite()
    // {
    //     console.log("ID:");
    //     this.selectSite.splice(0,this.selectSite.length);
    //     return new Promise((resolve, reject) => {
    //         this.sqlite.create({
    //             name: 'data.db',
    //             location: 'default'
    //         }).then((db: SQLiteObject) => {
    //
    //             this.db = db;
    //             console.log("Database connection");
    //             console.log(this.db)
    //         })
    //         setTimeout(() => {
    //             console.log("**************")
    //             console.log(this.db);
    //             console.log("Select Site Table");
    //             var addQuery = "select * from site";
    //             this.db.executeSql(addQuery,{}).then((data)=>{
    //                 if(data.rows && data.rows.length > 0)
    //                 {
    //                     for(var i = 0;i<data.rows.length;i++)
    //                     {
    //                         this.selectSite.push(data.rows.item(i))
    //                     }
    //                 }
    //                 console.log(this.selectSite)
    //                 resolve(this.selectSite);
    //             }, (error) => {
    //                 console.log("ERROR: " + JSON.stringify(error))
    //             })
    //
    //         }, 3000)
    //
    //     })
    // }

    //getEmployee
    // getEmployee()
    // {
        // console.log("ID:")
        // this.selectEmployee.splice(0,this.selectEmployee.length);
        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         console.log("**************")
        //         console.log(this.db);
        //         console.log("Select Site Table");
        //         var addQuery = "select * from employee";
        //         this.db.executeSql(addQuery,{}).then((data)=> {
        //             if (data.rows.length > 0) {
        //                 for (var i = 0; i < data.rows.length; i++) {
        //                     this.selectEmployee.push(data.rows.item(i))
        //                 }
        //                 console.log(this.selectEmployee)
        //                 resolve(this.selectEmployee);
        //             }
        //         },(error) => {
        //             console.log("ERROR: " + JSON.stringify(error))
        //         })
        //     }, 3000)
        //
        // })

    // }

    getSiteEmployee(siteId){
        console.log("ID:"+siteId)
        console.log(this.selectEmployee)
        this.selectEmployee.splice(0,this.selectEmployee.length);
        console.log(this.selectEmployee)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Employee Table");
                var addQuery = "select * from employee where siteId=?";
                // var addQuery = "select * from employee";
                console.log(addQuery);
                this.db.executeSql(addQuery,[siteId]).then((data)=> {
                    if (data.rows.length > 0) {
                        console.log(data.rows.length)
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectEmployee.push(data.rows.item(i))
                        }
                        console.log(this.selectEmployee)
                        resolve(this.selectEmployee);
                    }
                },(error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                    reject(error)
                })
                this.componentService.closeLoader();
            }, 3000)

        })
    }

    getAttendance(){
        console.log("ID:")
        this.selectAttendance.splice(0,this.selectAttendance.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.sqlite.create({
                    name: 'data.db',
                    location: 'default'
                }).then((db: SQLiteObject) => {
                    this.db = db;
                    console.log("Database connection");
                    console.log(this.db)
                    console.log("**************")
                    console.log(this.db);
                    console.log("Select attendance Table");
                    var addQuery = "select * from attendance";
                    console.log(addQuery);
                    this.db.executeSql(addQuery,{}).then((data)=> {
                        if (data.rows.length > 0) {
                            for (var i = 0; i < data.rows.length; i++) {
                                this.selectAttendance.push(data.rows.item(i))
                            }
                            console.log(this.selectAttendance)
                            resolve(this.selectAttendance);
                        }
                    },(error) => {
                        console.log("ERROR: " + JSON.stringify(error))
                        reject("no")
                    })

                })

            }, 3000)

        })
    }





    //getReading
    getReading()
    {
        this.selectReading.splice(0,this.selectReading.length)
        var test = [];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Database connection")
                console.log(this.db)
                console.log("**************")
                console.log(this.db);
                console.log("Select Reading Table");
                var addQuery = "select * from readings";
                //and active = ?  order by title"
                this.db.executeSql(addQuery, {}).then((data) => {
                    console.log(data);
                    console.log(data.rows.item)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectReading.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectReading)
                    resolve(this.selectReading);
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error))
                    reject(error)
                })
            }, 3000)
        })
    }

   //getAssetimage
    getassetImage()
    {
        this.selectImage.splice(0,this.selectImage.length)
        var test = [];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select asset image Table");
                var addQuery = "select * from image";
                //and active = ?  order by title"
                this.db.executeSql(addQuery, {}).then((data) => {
                    console.log(data);
                    console.log(data.rows.item)
                    if (data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            this.selectImage.push(data.rows.item(i))
                        }
                    }
                    console.log(this.selectImage)
                    resolve(this.selectImage);
                }, (error) => {
                            console.log("ERROR: " + JSON.stringify(error))
                            reject(error)
                })
            }, 3000)
        })
    }




    ///

            //Employee
            // setEmployee()
            // {
            //     return new Promise((resolve, reject) => {
            //
            //         setTimeout(() => {
            //             this.db.executeSql("DROP TABLE employee", {})
            //             console.log("Set Site Data");
            //             var employee;
            //             var param = [];
            //             this.employeeService.getAllEmployees().subscribe(
            //                 response => {
            //                     console.log("Get site response");//
            //                     employee = response.json();
            //                     console.log(employee)//
            //                     if (employee.length > 0) {
            //                         for (var i = 0; i < employee.length; i++) {
            //                             param.push([employee[i].id], employee[i].name, employee[i].empId, employee[i].active, employee[i].enrolled_face, employee[i].designation, employee[i].faceAuthorised, employee[i].faceIdEnrolled, employee[i].fullName)
            //                         }
            //                     }
            //                 },
            //                 error => {
            //                     console.log("Get employee error");
            //                 })
            //             var tablename = 'employee'
            //             var createQuery = "create table if not exists employee(id INT,name TEXT,empId TEXT,active,enrolled_face TEXT,designation TEXT,faceAuthorised TEXT,faceIdEnrolled BOOLEAN,fullName)"
            //             var insertQuery = "insert into employee(id,name,empId,active,enrolled_face,designation,faceAuthorised,faceIdEnrolled,fullName) values(?,?,?,?,?,?,?,?,?)";
            //             var updateQuery = "update employee set name=?,empId=?,active=?,enrolled_face=?,designation=?,faceAuthorised=?,faceIdEnrolled=?,fullName=? where id=? ";
            //             setTimeout(() => {
            //                 this.create(tablename, createQuery, insertQuery, updateQuery, param).then(
            //                     response=>{
            //                         resolve(response)
            //                     }
            //                 )
            //                 // this.componentService.closeLoader();
            //             }, 15000)
            //         }, 3000)
            //
            //     })
            // }



            //Asset Image
//     setImage(assetId,title,imageData)
//     {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 console.log("Asset Reading Data");
//
//                 var param = [assetId,title,imageData]
//
//                 var tablename = 'image';
//                 var createQuery = "create table if not exists image (id INTEGER  PRIMARY KEY  AUTOINCREMENT,assetId,title,assetImage)";
//                 var insertQuery = "INSERT INTO image(assetId,title,assetImage) VALUES (?,?,?)"
//                 var updateQuery = "update image set assetId=?,title=?,assetImage=? where assetId=? ";
//
//                 this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tablename]).then((data) => {
//                     //testing
//                     console.log("Search Table");
//                     console.log(data);
//                     if (data.rows.length > 0) {
//                         console.log("Table exists");
//                         console.log("Table Name:" + data.rows.item(0).tbl_name);
//                         console.log("Create table " + tablename);
//
// =======
//
//         })
//     }



  //save Jobs images
  setSaveJobs(data,image)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Set Job Data");
        console.log(data)
        var jobs ;
        var param =[];

        jobs = data;
        if(image.length>0) {
          for (var i = 0; i < image.length; i++) {
            param.push([jobs.id, image[i], false, ""]);
          }
        }
        console.log("param",param);
        var tablename = 'ppmSaveImage'
        var createQuery = "create table if not exists ppmSaveImage(id INTEGER PRIMARY KEY AUTOINCREMENT,jobId INT,image TEXT,isChecklist INT DEFAULT 0 ,checklistName TEXT)";
        var insertQuery = "insert into ppmSaveImage(jobId,image,isChecklist,checklistName) values(?,?,?,?)";
        var updateQuery = "update ppmSaveImage set jobId,image,isChecklist,checklistName where id=? ";
        var selectQuery = "select * from ppmSaveImage";
        setTimeout(() => {
          this.createJobImage(tablename, createQuery, insertQuery, updateQuery,selectQuery, param).then(
            response=>{
              console.log("saving response",response);
              resolve(response)
            }
          )
        }, 15000)
      }, 3000)
    })


  }


  createJobImage(tbl,create,insert,update,select,param)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("CHECK");
        console.log(param);
        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
          //testing
          console.log("Search Table");
          console.log(data)
          if (data.rows.length > 0) {
            console.log("Table exists");
            console.log("Table Name:" + data.rows.item(0).tbl_name);
            console.log("Row length:" + data.rows.length);
            for(var i=0;i<data.rows.length; i++){
              console.log("ID:" + data.rows.item(i).tbl_name);
            }

            // console.log("Drop Table")
            var table = data.rows.item(0).tbl_name
            /*this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
              console.log(data);
            })*/
            // console.log("Update table");
            // for (var i = 0; i < param.length; i++) {
            //     this.db.executeSql(update, param[i]).then((data) => {
            //     }, (error) => {
            //         console.log("ERROR: " + JSON.stringify(error))
            //     })
            // }

            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              console.log("length",param.length);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

                }, (error) => {
                  console.log("ERROR: " + JSON.stringify(error))
                })
              }

              resolve("s")
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error))
            })

            this.db.executeSql(select,{}).then((data)=>{
              console.log("data",JSON.stringify(data));
            },(error)=>{
              console.log("ERROR"+JSON.stringify(error))
            })
          }
          else {
            console.log("No table");
            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

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

        /*this.db.executeSql("SELECT * FROM ppmSaveImage").then((data)=>{
          console.log("select query",data);
        },(error)=>{
          console.log("select error",error);
        })*/
      }, 1000)
    })
  }


  //get saved Images
  getSavedImages(jobId){
    return new Promise((resolve,reject) =>{
     setTimeout(()=>{
       console.log("jobIdd",jobId);
       console.log("get saved images");
       console.log(this.db);
       console.log("Select saved Images List Table");
       var addQuery = "select * from ppmSaveImage where jobId='"+jobId+"'";
       console.log(addQuery)
       this.savedImages = [];
       this.db.executeSql(addQuery,{jobId}).then((data)=>{
         if(data.rows.length > 0 ){
           for (var i=0;i<data.rows.length;i++){
             this.savedImages.push(data.rows.item(i))
           }
         }
         console.log(this.savedImages);
         resolve(this.savedImages);
       },(error)=>{
         console.log("ERROR: "+JSON.stringify(error));
         reject("ERROR")
       })
     },3000)
    })
  }

// get checklist
  getCheckList(jobId){
    return new Promise((resolve,reject) =>{
      setTimeout(()=>{
        console.log("jobId",jobId);
        console.log("get saved checklist");
        console.log(this.db);
        console.log("Select saved checklist Table");
        var addQuery = "select * from checklist where jobId='"+jobId+"'";
        console.log(addQuery);
        this.savedCheckList= [];
        this.db.executeSql(addQuery,{jobId}).then((data)=>{
          if(data.rows.length > 0 ){
            for (var i=0;i<data.rows.length;i++){
              this.savedCheckList.push(data.rows.item(i));
            }
          }
          console.log(this.savedCheckList);
          resolve(this.savedCheckList);
        },(error)=>{
          console.log("ERROR: "+JSON.stringify(error));
          reject("ERROR");
        })
      },3000)
    })
  }

  //get all saved Images
  getAllSavedImages(){
    return new Promise((resolve,reject) =>{
     setTimeout(()=>{
       console.log("get all saved images");
       console.log(this.db);
       console.log("Select saved Images List Table");
       var addQuery = "select * from ppmSaveImage ";
       console.log(addQuery)
       this.savedImages = [];
       this.db.executeSql(addQuery,{}).then((data)=>{
         if(data.rows.length > 0 ){
           for (var i=0;i<data.rows.length;i++){
             this.savedImages.push(data.rows.item(i))
           }
         }
         console.log(this.savedImages);
         resolve(this.savedImages);
       },(error)=>{
         console.log("ERROR: "+JSON.stringify(error));
         reject("ERROR")
       })
     },3000)
    })
  }

  setSaves(data,image)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Save Jobs images");
        console.log(data)
        var jobs ;
        var param =[];

        jobs = data;
        if(image.length>0) {
          for (var i = 0; i < image.length; i++) {
            param.push([jobs.id, image[i], false, ""]);
          }
        }
        console.log("param",param);
        var tablename = 'ppmSaveImage'
        var createQuery = "create table if not exists ppmSaveImage(id INTEGER PRIMARY KEY AUTOINCREMENT,jobId INT,image TEXT,isChecklist INT DEFAULT 0 ,checklistName TEXT)";
        var insertQuery = "insert into ppmSaveImage(jobId,image,isChecklist,checklistName) values(?,?,?,?)";
        var updateQuery = "update ppmSaveImage set jobId,image,isChecklist,checklistName where id=? ";
        var selectQuery = "select * from ppmSaveImage";
        setTimeout(() => {
          this.createJobImage(tablename, createQuery, insertQuery, updateQuery,selectQuery, param).then(
            response=>{
              console.log("saving response",response);
              resolve(response)
            }
          )
        }, 15000)
      }, 3000)
    })


  }


  //complete offline jobs

  setCompletJobs(data)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // this.db.executeSql("DROP TABLE job", {})
        console.log("complete jobs");
        var jobs = [];
        var param ;
              console.log("Getting PPM Jobs response");//
              // jobs = data ;
              // console.log(jobs);
              var id = data.id;
              console.log(id);
              // if (jobs) {
              //   for (var i = 0; i < jobs.length; i++) {
              //     param.push([jobs[i].id, jobs[i].assetId, jobs[i].title, jobs[i].employeeName, jobs[i].siteName, jobs[i].plannedEndTime, jobs[i].plannedStartTime, jobs[i].description, jobs[i].status, jobs[i].maintenanceType, jobs[i].checkInDateTimeFrom, jobs[i].checkInDateTimeTo]);
                  param = data;
                  console.log(param);
                // }
              // }
        var tablename = 'job'
        var createQuery = "create table if not exists job(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT,offlineUpdate INTEGER DEFAULT 0)";
        var insertQuery = "insert into job(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo ) values(?,?,?,?,?,?,?,?,?,?,?,?)";
        var updateQuery = "update job set assetId=?,title=?,employeeName=?,siteName=?,plannedEndTime=?,plannedStartTime=?,description=?,status=?,maintenanceType=?,checkInDateTimeFrom=?,checkInDateTimeTo=?,offlineUpdate=? where id='"+id+"'";
        console.log(updateQuery);
        setTimeout(() => {
          /*this.db.executeSql(updateQuery,[param.assetId,param.title,param.employeeName,param.siteName,param.plannedEndTime,param.plannedStartTime,param.description,param.status,param.maintenanceType,param.checkInDateTimeFrom,param.checkInDateTimeTo]).then((data)=>{
            console.log("updateddd",data);
          },(error)=>{
            console.log("ERROR: "+JSON.stringify(error));
            reject("ERROR")
          })*/


          this.update(tablename, createQuery, insertQuery, updateQuery, param).then(
            response=>{
              console.log("updated");
              resolve(response)
            }
          )
        }, 15000)
      }, 3000)

    })
  }

  //Create table
  update(tbl,create,insert,update,param)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("CHECK");
        console.log(param);
        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
          //testing
          console.log("Search Table");
          console.log(data)
          if (data.rows.length > 0) {
            console.log("Table exists");
            console.log("Table Name:" + data.rows.item(0).tbl_name);
            /*console.log("Drop Table")
            var table = data.rows.item(0).tbl_name
            this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
              console.log(data);
            })*/
            // console.log("Update table");
            // for (var i = 0; i < param.length; i++) {
            //     this.db.executeSql(update, param[i]).then((data) => {
            //     }, (error) => {
            //         console.log("ERROR: " + JSON.stringify(error))
            //     })
            // }

            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.id);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              console.log("length",param.length);
              // for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(update,[param.assetId,param.title,param.employeeName,param.siteName,param.plannedEndTime,param.plannedStartTime,param.description,param.status,param.maintenanceType,param.checkInDateTimeFrom,param.checkInDateTimeTo,param.offlineUpdate]).then((data) => {
                  console.log("updatedd");
                  console.log(data);

                }, (error) => {
                  console.log("ERRORR: " + JSON.stringify(error))
                })
              // }

              resolve(data)
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error))
            })
          }
          else {
            console.log("No table");
            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

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


  //complete offline complete response jobs

  setOfflineCompleteResponse(data)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // this.db.executeSql("DROP TABLE job", {})
        console.log("offlinecompleteresponse to 1");
        var jobs = [];
        var param ;
              console.log("Getting Jobs response");//
              // jobs = data ;
              // console.log(jobs);
              var id = data.id;
              console.log(id);
              // if (jobs) {
              //   for (var i = 0; i < jobs.length; i++) {
              //     param.push([jobs[i].id, jobs[i].assetId, jobs[i].title, jobs[i].employeeName, jobs[i].siteName, jobs[i].plannedEndTime, jobs[i].plannedStartTime, jobs[i].description, jobs[i].status, jobs[i].maintenanceType, jobs[i].checkInDateTimeFrom, jobs[i].checkInDateTimeTo]);
                  param = data;
                  console.log(param);
                // }
              // }
        var tablename = 'job'
        var createQuery = "create table if not exists job(id INT,assetId INT,title TEXT,employeeName TEXT,siteName TEXT,plannedEndTime TEXT,plannedStartTime TEXT,description TEXT,status TEXT,maintenanceType TEXT,checkInDateTimeFrom TEXT,checkInDateTimeTo TEXT,offlineUpdate INTEGER DEFAULT 0,offlineCompleteResponse INTEGER DEFAULT 0)";
        var insertQuery = "insert into job(id,assetId,title,employeeName ,siteName,plannedEndTime,plannedStartTime,description,status,maintenanceType,checkInDateTimeFrom,checkInDateTimeTo ) values(?,?,?,?,?,?,?,?,?,?,?,?)";
        var updateQuery = "update job set offlineCompleteResponse=? where id='"+id+"'";
        console.log(updateQuery);
        setTimeout(() => {
          this.updateOfflineResponse(tablename, createQuery, insertQuery, updateQuery, param).then(
            response=>{
              console.log("updated");
              resolve(response)
            }
          )
        }, 15000)
      }, 3000)

    })
  }

  //Create table
  updateOfflineResponse(tbl,create,insert,update,param)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("CHECK");
        console.log(param);
        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
          //testing
          console.log("Search Table");
          console.log(data)
          if (data.rows.length > 0) {
            console.log("Table exists");
            console.log("Table Name:" + data.rows.item(0).tbl_name);
            /*console.log("Drop Table")
            var table = data.rows.item(0).tbl_name
            this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
              console.log(data);
            })*/
            // console.log("Update table");
            // for (var i = 0; i < param.length; i++) {
            //     this.db.executeSql(update, param[i]).then((data) => {
            //     }, (error) => {
            //         console.log("ERROR: " + JSON.stringify(error))
            //     })
            // }

            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.id);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              console.log("length",param.length);
              // for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(update,[param.offlineCompleteResponse]).then((data) => {
                  console.log("updatedd");
                  console.log(data);

                }, (error) => {
                  console.log("ERRORR: " + JSON.stringify(error))
                })
              // }

              resolve(data)
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error))
            })
          }
          else {
            console.log("No table");
            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

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

  //save checklist offline
  setCompletChecklist(data)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // this.db.executeSql("DROP TABLE job", {})
        console.log("complete checklist");
        var jobs = [];
        var param ;
        console.log("Getting checklist response");//
        var jobId = data.jobId;
        var id = data.id;
        console.log(jobId);
        console.log(id);
        param = data;
        console.log(param);
        var tablename = 'checklist';
        var createQuery =  "create table if not exists checklist(checklistItemName TEXT,checklistName TEXT,image_1 TEXT,jobId INT,completed TEXT,remarks TEXT)";
        var insertQuery = "insert into checklist(checklistItemName,checklistName,image_1,jobId,completed,remarks) values(?,?,?,?,?,?)";
        var updateQuery = "update checklist set checklistItemName=?,checklistName=?,image_1=?,completed=?,remarks=? where jobId='"+jobId+"' AND id='"+id+"'";
        console.log(updateQuery);
        setTimeout(() => {
          this.updateChecklist(tablename, createQuery, insertQuery, updateQuery, param).then(
            response=>{
              console.log("updated");
              resolve(response)
            }
          )
        }, 15000)
      }, 3000)

    })
  }

  //Create table
  updateChecklist(tbl,create,insert,update,param)
  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("CHECK");
        console.log(param);
        this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
          //testing
          console.log("Search Table");
          console.log(data)
          if (data.rows.length > 0) {
            console.log("Table exists");
            console.log("Table Name:" + data.rows.item(0).tbl_name);
            /*console.log("Drop Table")
            var table = data.rows.item(0).tbl_name
            this.db.executeSql('DELETE FROM  '+table+'',{}).then((data) => {
              console.log(data);
            })*/
            // console.log("Update table");
            // for (var i = 0; i < param.length; i++) {
            //     this.db.executeSql(update, param[i]).then((data) => {
            //     }, (error) => {
            //         console.log("ERROR: " + JSON.stringify(error))
            //     })
            // }

            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.id);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              console.log("length",param.length);
              // for (var i = 0; i < param.length; i++) {
              var query = insert;
              this.db.executeSql(update,[param.checklistItemName,param.checklistName,param.image_1,param.completed,param.remarks]).then((data) => {
                console.log("updatedd");
                console.log(data);

              }, (error) => {
                console.log("ERRORR: " + JSON.stringify(error))
              })
              // }

              resolve(data)
            }, (error) => {
              console.log("ERROR: " + JSON.stringify(error))
            })
          }
          else {
            console.log("No table");
            console.log("Create table " + tbl);
            console.log(create);
            console.log(param);
            console.log(param.length);
            this.db.executeSql(create, {}).then((data) => {
              console.log(data);
              for (var i = 0; i < param.length; i++) {
                var query = insert;
                this.db.executeSql(insert, param[i]).then((data) => {
                  console.log(data)//

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




}
