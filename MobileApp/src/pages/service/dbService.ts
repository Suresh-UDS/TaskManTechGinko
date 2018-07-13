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
import {EmployeeService} from "./employeeService";
import {ObjectUnsubscribedError} from "rxjs/Rx";
import {JobService} from "./jobService";
import {componentService} from "./componentService";
import {AttendanceService} from "./attendanceService";

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
    selectAttendance:any;

    constructor(private sqlite: SQLite,private componentService:componentService,private jobService:JobService,
                private siteService:SiteService,public employeeService:EmployeeService,public attendanceService:AttendanceService) {

        this.selectSite = [];
        this.selectEmployee = [];
        this.selectJobs = [];
        this.selectAsset = [];
        this.selectAMC = [];
        this.selectPPM = [];
        this.selectConfig = [];
        this.selectAttendance = []


    }


    //***create table from api response***/


    //Config Table

    //Site
    // dropTable(){
    //     this.db.executeSql("DROP TABLE site");
    // }
    setSites()
    {
        console.log(this.db)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                    console.log("Set Site Data");
                    var sites;
                    var param = [];
                    this.siteService.searchSite().subscribe(
                        response => {
                            console.log("Get site response");//
                            sites = response.json();
                            console.log(sites);
                            if (sites.length > 0) {
                                for (var i = 0; i < sites.length; i++) {
                                    param.push([sites[i].id, sites[i].name])
                                }
                            }
                        },
                        error => {
                            console.log("Get Site error");
                        })
                    var tablename = 'site';
                    var createQuery = "create table if not exists site(id INT,name TEXT)";
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
        // this.db.executeSql('DROP TABLE employee');
        return new Promise((resolve, reject) => {

                setTimeout(() => {
                    console.log("Set Employee Data");
                    var employee;
                    var param = [];
                    for(var j=0;j<this.selectSite.length;j++){
                        this.attendanceService.searchEmpAttendances(this.selectSite[j].id).subscribe(response=>{
                            employee = response.json();
                            console.log(employee);
                            if (employee.length > 0) {
                                for (var i = 0; i < employee.length; i++) {
                                    param.push([employee[i].id,employee[i].empId, employee[i].id, employee[i].fullName,employee[i].active,employee[i].faceAuthorised,employee[i].checkedIn,false,employee[i].siteId,employee[i].siteName,employee[i].attendanceId]);
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


    //Drop attendance

    dropAttendance()
    {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                this.db.executeSql('DROP TABLE attendance');
                resolve("Drop table attendance")
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
                console.log("CHECK")
                console.log(param)
                this.db.executeSql("SELECT tbl_name FROM sqlite_master WHERE tbl_name=?", [tbl]).then((data) => {
                    //testing
                    console.log("Search Table");
                    console.log(data)
                    if (data.rows.length > 0) {
                        console.log("Table exists");
                        console.log("Table Name:" + data.rows.item(0).tbl_name);
                        console.log("Drop Table")
                        var table = data.rows.item(0).tbl_name
                        this.db.executeSql('DROP TABLE '+table+'',{}).then((data) => {
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



    //***Get data from sqlite table***/


    //Get site
    getSite()
    {
        console.log("ID:");
        this.selectSite.splice(0,this.selectSite.length);
        return new Promise((resolve, reject) => {
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then((db: SQLiteObject) => {

                this.db = db;
                console.log("Database connection");
                console.log(this.db)
            })
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Site Table");
                var addQuery = "select * from site";
                this.db.executeSql(addQuery,{}).then((data)=>{
                    if(data.rows && data.rows.length > 0)
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

    }

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


}