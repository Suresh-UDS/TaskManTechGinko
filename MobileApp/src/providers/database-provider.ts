import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import {componentService} from "../pages/service/componentService";
import {SiteService} from "../pages/service/siteService";
import {JobService} from "../pages/service/jobService";
import {EmployeeService} from "../pages/service/employeeService";
import {AttendanceService} from "../pages/service/attendanceService";
import {AssetService} from "../pages/service/assetService";

@Injectable()
export class DatabaseProvider {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor( private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http, private cs: componentService,
                 private siteService: SiteService, private jobService: JobService, private employeeService: EmployeeService, private attendanceService: AttendanceService,
                 private assetService: AssetService) {
        this.databaseReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'taskman.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                console.log("Database");
                console.log(db);
                this.database = db;
                // this.database.executeSql("ATTACH DATABASE 'taskman.db' as 'taskman'");
                this.databaseReady.next(true);
            });
        });
    }

    addDeveloper(name, skill, years) {
        let data = [name, skill, years]
        return this.database.executeSql("INSERT INTO developer (name, skill, yearsOfExperience) VALUES (?, ?, ?)", data).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    getAllDevelopers() {
        return this.database.executeSql("SELECT * FROM developer", []).then((data) => {
            let developers = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    developers.push({ name: data.rows.item(i).name, skill: data.rows.item(i).skill, yearsOfExperience: data.rows.item(i).yearsOfExperience });
                }
            }
            return developers;
        }, err => {
            console.log('Error: ', err);
            return [];
        });
    }

    getDatabaseState() {
        return this.databaseReady.asObservable();
    }

    getTables(){
        return this.database.executeSql("SELECT * FROM sqlite_master WHERE type='table'",[]).then((data)=>{
            console.log("Table names ");
            console.log(data);
            let table_names = [];
            // if(data.rows.length>0){
            //     for(var i=0;i<data.rows.length;i++){
            //         console.log(data[i]);
            //         table_names.push({name:data[i].name});
            //     }
            // }
            return table_names;
        },err=>{
            console.log("Error in getting tables",err);
            return[];
        })
    }

    checkForTableData(){
        return this.database.executeSql("SELECT * FROM 'site' WHERE syncedToServer = FALSE ").then((data)=>{
            console.log("Selected rows");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in getting results from site table");
            console.log(err);
            return null;
        })
    }

    checkForData(tableName){
        return this.database.executeSql("SELECT count(*) FROM "+tableName).then((data)=>{
            console.log("Total records");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return err;
        })
    }

    createSiteTable(){
        this.database.executeSql("DROP TABLE IF EXISTS site");
        var query = "CREATE TABLE site (id int PRIMARY KEY UNIQUE NOT NULL,name TEXT NOT NULL ) ";
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS site(id int UNIQUE PRIMARY KEY , name TEXT NOT NULL) ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            this.addSites();
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }
    createEmployeeTable(){
        this.database.executeSql("DROP TABLE IF EXISTS employee");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS employee(id int UNIQUE PRIMARY KEY , firstName TEXT NOT NULL,lastName TEXT, siteId int NOT NULL, checkInImage TEXT, checkoutImage TEXT, attendanceId int, checkedIn BOOLEAN, faceAuthorised boolean, syncedToServer BOOLEAN) ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }



    createCheckListTable(){

    }

    addSites(){
        this.cs.showLoader('Syncing site data');
        var searchCriteria = {
            findAll:true,
            currPage:1,
            sort:10,
            sortByAsc:true,
            report:true
        };

        this.siteService.searchSites(searchCriteria).subscribe(
            response=>{
                for(var i=0; i<response.transactions.length;i++){
                    console.log("site for adding to sqlite");
                    console.log(response.transactions[i]);
                    this.insertSitesData(response.transactions[i].id, response.transactions[i].name);
                    this.addEmployee(response.transactions[i].id);

                }
                this.cs.closeAll();
            });

    }

    insertSitesData(id,name) {
        let data = [id,name];
        return this.database.executeSql("INSERT INTO site (id,name) VALUES (?, ?)", data).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    getSiteData(){
        return this.database.executeSql("SELECT * from site",[]).then(data=>{
            console.log("Site data from sqlite");
            console.log(data);
            let sites = [];
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    sites.push({ name: data.rows.item(i).name, id: data.rows.item(i).id});
                }
            }
            return sites;
        },err=>{
            console.log("Error in getting site data from sqlite");
            console.log(err);
            return [];
        })
    }

    addEmployee(siteId){

        var searchCriteria = {
            currPage:1,
            pageSort: 15,
            siteId:siteId,
            report:true
        };
        this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(response=>{
            let employee = [];
            employee = response.transactions;
            console.log(employee);
            if (employee.length > 0) {
                for (var i = 0; i < employee.length; i++) {
                        this.insertEmployeeData(employee[i].id, employee[i].name,employee[i].lastName,employee[i].siteId, null, null, employee[i].attendanceId, employee[i].checkedIn, employee[i].faceAuthorised);
                }
            }
        })
    }

    insertEmployeeData(id, firstname, lastname, siteId, checkInImage, checkOutImage, attendanceId,checkedIn, faceAuthorised){

        let data = [id, firstname, lastname, siteId, checkInImage, checkOutImage, attendanceId,checkedIn, faceAuthorised, false];
        return this.database.executeSql("INSERT INTO employee (id, firstName, lastName, siteId, checkInImage, checkoutImage, attendanceId, checkedIn, faceAuthorised, syncedToServer ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });

    }

    getEmployeeData(){
        return this.database.executeSql("SELECT * FROM employee WHERE employee.faceAuthorised IS TRUE ",[]).then(data=>{
            console.log("Employee data from sqlite with faceauthorised true");
            console.log(data);
            let employees = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    employees.push({id:data.rows.item(i).id, firstName: data.rows.item(i).firstName, lastName: data.rows.item(i).lastName, siteId: data.rows.item(i).siteId, checkInImage: data.rows.item(i).checkInImage, checkoutImage: data.rows.item(i).checkoutImage, attendanceId: data.rows.item(i).attendanceId, checkedIn: data.rows.item(i).checkedIn,
                        faceAuthorised: data.rows.item(i).faceAuthorised, syncedToServer: data.rows.item(i).syncedToServer})
                }
            }
            return employees;
        },err=>{
            console.log("Error in getting employee data from sqlite");
            console.log(err);
            return [];
        })
    }

    getEmployeeDataBySiteId(siteId){
        return this.database.executeSql("SELECT * FROM employee WHERE employee.faceAuthorised IS TRUE AND employee.siteId = siteId",[]).then(data=>{
            console.log("Employee data from sqlite with faceauthorised true");
            console.log(data);
            let employees = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    employees.push({id:data.rows.item(i).id, firstName: data.rows.item(i).firstName, lastName: data.rows.item(i).lastName, siteId: data.rows.item(i).siteId, checkInImage: data.rows.item(i).checkInImage, checkoutImage: data.rows.item(i).checkoutImage, attendanceId: data.rows.item(i).attendanceId, checkedIn: data.rows.item(i).checkedIn,
                        faceAuthorised: data.rows.item(i).faceAuthorised, syncedToServer: data.rows.item(i).syncedToServer})
                }
            }
            return employees;
        },err=>{
            console.log("Error in getting employee data from sqlite");
            console.log(err);
            return [];
        })
    }


    createJobsTable(){
        this.database.executeSql("DROP TABLE IF EXISTS jobs");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS jobs(id int UNIQUE PRIMARY KEY , siteId int NOT NULL, siteName TEXT, title TEXT, status TEXT, description TEXT, type TEXT, employeeId int, empId TEXT, employeeName TEXT, plannedStartTime DATE, actualEndTime DATE) ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    addJobs(){
        var search = {report:true,checkInDateTimeFrom:new Date(),scheduled:true};
        this.jobService.getJobs(search).subscribe( response=>{
           console.log("Jobs to sqlite");
           console.log(response.transactions);
           let jobs = [];
           jobs = response.transactions;
           if(jobs.length>0){
               for(var i=0; i<jobs.length;i++){
                   this.insertJobsData(jobs[i].id, jobs[i].siteId, jobs[i].siteName, jobs[i].title, jobs[i].status, jobs[i].description, jobs[i].maintenanceType, jobs[i].employeeId, jobs[i].empId, jobs[i].employeeName, jobs[i].plannedStartTime)
               }
           }
        },err=>{
            console.log("Error in syncing jobs");
            console.log(err);
        });

    }

    insertJobsData(id,siteId, siteName, title, status, description, type, employeeId, empId, employeeName, plannedStartTime){
        let data = [id,siteId, siteName, title, status, description, type, employeeId, empId, employeeName, plannedStartTime];
        return this.database.executeSql("INSERT INTO jobs (id, siteId, siteName, title, status, description, type, employeeId, empId, employeeName, plannedStartTime, actualEndTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",data).then(data=>{
            return data;
        },err=>{
            console.log("Error: ", err );
            return err;
        })
    }

    getJobsData(){
        return this.database.executeSql("SELECT * FROM jobs  ",[]).then(data=>{
            console.log("Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({id:data.rows.item(i).id, siteId: data.rows.item(i).siteId, siteName: data.rows.item(i).siteName, title: data.rows.item(i).title,
                                status: data.rows.item(i).status, description: data.rows.item(i).description, type: data.rows.item(i).type, employeeId: data.rows.item(i).employeeId,
                                empId: data.rows.item(i).empId, employeeName: data.rows.item(i).employeeName, plannedStartTime: data.rows.item(i).plannedStartTime, actualEndTime: data.rows.item(i).actualEndTime})
                }
            }
            return jobs;
        },err=>{
            console.log("Error in getting jobs data from sqlite");
            console.log(err);
            return [];
        })
    }

    getPPMJobsData(){

    }

    getAMCJobsData(){

    }

    dropAllTables(){
        this.database.executeSql("DROP TABLE IF EXISTS site");
        this.database.executeSql("DROP TABLE IF EXISTS employee");
        this.database.executeSql("DROP TABLE IF EXISTS attendance");
        this.database.executeSql("DROP TABLE IF EXISTS asset");
        this.database.executeSql("DROP TABLE IF EXISTS jobs");
    }

}