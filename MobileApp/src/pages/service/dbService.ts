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

    constructor(private sqlite: SQLite,private componentService:componentService,private jobService:JobService,
                private siteService:SiteService,public employeeService:EmployeeService,public attendanceService:AttendanceService) {

        this.selectSite = [];
        this.selectEmployee = [];
        this.selectJobs = [];
        this.selectAsset = [];
        this.selectAMC = [];
        this.selectPPM = [];
        this.selectConfig = [];

        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.db = db;
            console.log("Database connection");
            console.log(this.db)
        })

    }


    //***create table from api response***/


    //Config Table

    //Site
    dropTable(){
        this.db.executeSql("DROP TABLE site");
    }
    setSites()
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.db.executeSql("DROP TABLE site",{});
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
        this.db.executeSql('DROP TABLE employee');
        return new Promise((resolve, reject) => {
            this.siteService.searchSite().subscribe(response=>{
                var sites = response.json();
                setTimeout(() => {
                    this.db.executeSql("DROP TABLE employee", {})
                    console.log("Set Site Data");
                    var employee;
                    var param = [];
                    for(var j=0;j<sites.length;j++){
                        this.attendanceService.getSiteAttendances(sites[j].id).subscribe(response=>{
                            console.log(response.json());
                            employee = response.json();
                            console.log(employee);
                            if (employee.length > 0) {
                                for (var i = 0; i < employee.length; i++) {
                                    param.push([employee[i].id], employee[i].name, employee[i].empId, employee[i].active, employee[i].siteId);
                                }
                            }
                        })
                    }

                    var tablename = 'employee';
                    var createQuery = "create table if not exists employee(id INT,name TEXT,empId TEXT,active,siteId)"
                    var insertQuery = "insert into employee(id,name,empId,active,siteId) values(?,?,?,?,?)";
                    var updateQuery = "update employee set name=?,empId=?,active=?,siteId=? where id=? ";
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
                        console.log("Update table");
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

    ///Attendance set

    //***Get data from sqlite table***/


    //Get site
    getSite()
    {
        console.log("ID:");
        // this.selectJobs.splice(0,this.selectSite.length);
        return new Promise((resolve, reject) => {
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

    getSiteEmployee(siteId){
        console.log("ID:")
        this.selectEmployee.splice(0,this.selectEmployee.length);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("**************")
                console.log(this.db);
                console.log("Select Site Table");
                var addQuery = "select * from employee where siteId="+siteId;
                console.log(addQuery);
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


}