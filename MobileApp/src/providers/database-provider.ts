import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;

    constructor( private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
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
        return this.executeQuery("SELECT count(*) FROM "+tableName).then((data)=>{
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
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }
    createEmployeeTable(){
        this.database.executeSql("DROP TABLE IF EXISTS employee");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS employee(id int UNIQUE PRIMARY KEY , firstName TEXT NOT NULL,lastName TEXT, siteId int NOT NULL, checkInImage TEXT, checkoutImage TEXT, syncedToServer) ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    createJobsTable(){
        this.database.executeSql("DROP TABLE IF EXISTS jobs");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS jobs(id int UNIQUE PRIMARY KEY , siteId int NOT NULL, siteName TEXT, title TEXT, status TEXT, description TEXT, employeeId int, empId TEXT, employeeName TEXT, plannedStartTime DATE) ",[]).then((data)=>{
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

    addSite(data){
        return this.database.executeSql("INSERT INTO site VALUES (?,?)",data).then(response=>{
            console.log("Query success response");
            console.log(response);
            return response;
        },err=>{
            console.log("Error - failure query");
            console.log(err);
            return null;
        })
    }

    getSiteData(){
        return this.database.executeSql("SELECT * from site",[]).then(data=>{
            console.log("Site data from sqlite");
            console.log(data);
            return data;
        },err=>{
            console.log("Errror in getting site data from sqlite");
            console.log(err);
            return null;
        })
    }

    executeQuery(query){
        return this.database.executeSql(query).then(data=>{
            console.log("Sucessfully executed query");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    dropAllTables(){
        this.database.executeSql("DROP TABLE IF EXISTS site");
        this.database.executeSql("DROP TABLE IF EXISTS employee");
        this.database.executeSql("DROP TABLE IF EXISTS attendance");
        this.database.executeSql("DROP TABLE IF EXISTS asset");
        this.database.executeSql("DROP TABLE IF EXISTS jobs");
    }

}