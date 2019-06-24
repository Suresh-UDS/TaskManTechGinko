import {Inject, Injectable} from '@angular/core';
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
import {FileUploadOptions, FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../pages/service/app-config";
import {Base64} from "@ionic-native/base64/ngx";


declare  var demo ;

@Injectable()
export class DatabaseProvider {
    database: SQLiteObject;
    private databaseReady: BehaviorSubject<boolean>;
    fileTransfer: FileTransferObject = this.transfer.create();

    checkOutDetails:{
        employeeId:any;
        employeeEmpId:any;
        projectId:any;
        siteId:any;
        jobId:any;
        latitudeOut:any;
        longitude:any;
        completeJob:any;
        id:any;
        jobMaterials:any;

    };

    constructor( private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http, private cs: componentService,
                 private siteService: SiteService, private jobService: JobService, private employeeService: EmployeeService, private attendanceService: AttendanceService,
                 private assetService: AssetService, private transfer: FileTransfer, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig, private base64: Base64) {
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

        this.checkOutDetails={
            employeeId:'',
            employeeEmpId:'',
            projectId:'',
            siteId:'',
            jobId:'',
            latitudeOut:'',
            longitude:'',
            completeJob:false,
            id:null,
            jobMaterials:[],

        };


    }

    createDb(){
        return this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'taskman.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                console.log("Database");
                console.log(db);
                this.database = db;
                // this.database.executeSql("ATTACH DATABASE 'taskman.db' as 'taskman'");
                this.databaseReady.next(true);
                return true;
            },err=>{
                console.log("Error in creating database");
                console.log(err);
                return err;
            });
        });
    }

    addDeveloper(name: any, skill: any, years: any) {
        let data = [name, skill, years];
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

    checkForData(tableName: string){
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
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS employee(id int , firstName TEXT NOT NULL,lastName TEXT, empId TEXT NOT NULL , siteId int NOT NULL, attendanceId int, checkedIn BOOLEAN,notCheckedOut BOOLEAN, faceAuthorised boolean, syncedToServer BOOLEAN, UNIQUE(id,siteId) ON CONFLICT REPLACE)  ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    createAttendanceTable(){
        this.database.executeSql("DROP TABLE IF EXISTS attendance");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS attendance(id int , employeeId int NOT NULL UNIQUE,empId TEXT,siteId int NOT NULL,  checkInImage TEXT, checkInTime DATE, checkoutImage TEXT, checkOutTime DATE, syncedToServer BOOLEAN)  ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    createAttendanceCheckInTable(){
        this.database.executeSql("DROP TABLE IF EXISTS checkIn");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS checkIn(employeeId int NOT NULL ,empId TEXT,siteId int NOT NULL,  checkInImage TEXT, checkInTime DATE, attendanceId int, offline BOOLEAN,syncedToServer BOOLEAN , UNIQUE(employeeId,siteId) ON CONFLICT REPLACE)  ",[]).then((data)=>{
            console.log("Attendance Check in Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query for creating attendance check in table");
            console.log(err);
            return null;
        })
    }

    createAttendanceCheckOutTable(){
        this.database.executeSql("DROP TABLE IF EXISTS checkOut");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS checkOut(employeeId int NOT NULL ,empId TEXT,siteId int NOT NULL,  checkOutImage TEXT, checkOutTime DATE, attendanceId int, offline BOOLEAN,syncedToServer BOOLEAN, UNIQUE(employeeId,siteId) ON CONFLICT REPLACE)  ",[]).then((data)=>{
            console.log("Attendance Check out Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query for creating attendance check out table");
            console.log(err);
            return null;
        })
    }

    createCheckListTable(){
        this.database.executeSql("DROP TABLE IF EXISTS checklist");
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS checklist(jobId int, completed BOOLEAN, itemName TEXT, remarks TEXT, UNIQUE(jobId,itemName) )  ",[]).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    createAssetTable(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS asset(id INT UNIQUE,active TEXT,title TEXT,code TEXT,assetType TEXT,assetGroup TEXT,siteId INT,siteName TEXT,block TEXT,floor TEXT,zone TEXT,manufacturerName TEXT,modelNumber TEXT,serialNumber TEXT,acquiredDate TEXT,purchasePrice TEXT,currentPrice TEXT,estimatedDisposePrice TEXT, syncedToServer TEXT )",[]).then((data)=>{
            console.log("Asset table creation result");
            console.log(data);
        },err=>{
            console.log("Error in creating asset table");
            console.log(err);
        })

    }

    createJobImage(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS jobImages(jobId int NOT NULL, image TEXT UNIQUE)").then(jobImage=>{
            this.createSavedJobImagesTable();
        },err=>{
            console.log("Error in creating job image table");
            console.log(err);
        })
    }

    createSavedJobImagesTable(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS savedJobImages(jobId int NOT NULL , imageUrl TEXT, base64 TEXT)").then(imageCreationResponse=>{
            console.log("Save images table successfully created");
        },err=>{
            console.log("Error in creating saved job images table");
            console.log(err);
        })
    }

    addSavedJobImages(jobId){
        this.jobService.getJobDetails(jobId).subscribe(jobDetails=>{
            console.log("Job details for getting saved images");
            console.log(jobDetails);
            if(jobDetails && jobDetails.images && jobDetails.images.length>0){
                for(let i=0; i<jobDetails.images.length;i++){
                    this.insertSavedJobImages(jobId,jobDetails.images.url,null)
                }
            }
        })
    }

    addJobImages(job,images){
        if(images && images.length>0){
            for(var i=0; i<images.length;i++){
                return this.insertJobImage(job.id,images[i]).then(data=>{
                    return data;
                },err=>{
                    console.log("Error in inserting job images");
                    console.log(err);
                    return err;
                })
            }
        }
    }

    insertJobImage(jobId,image){
        let data = [jobId,image];
        return this.database.executeSql("INSERT INTO jobImages(jobId,image) VALUES (?,?)",data).then(data=>{
            return data;
        },err=>{
            console.log("Error in adding Job images");
            console.log(err);
            return err;
        })
    }

    insertSavedJobImages(jobId,imageUrl, base64){
        let data= [jobId,imageUrl,base64];
        return this.database.executeSql("INSERT INTO savedJobImages(jobId,imageUrl,base64) VALUES (?,?,?)",data).then(data=>{
            console.log("Saved job images successfully inserted to SQLite");
            return data;
        },err=>{
            console.log("Error in inserting saved job image to SQLite");
            console.log(err);
            return err;
        })
    }

    getJobImages(jobId){
        var query = "SELECT * FROM jobImages WHERE jobId="+jobId;
        return this.database.executeSql(query,[]).then(jobImages=>{
            let jobImagesList=[];
            if(jobImages.rows.length>0){
                for(var i=0; i<jobImages.rows.length;i++){
                    jobImagesList.push({
                        jobId:jobImages.rows.item(i).jobId,
                        image:jobImages.rows.item(i).image
                    })
                }
                return jobImagesList;
            }
        },err=>{
            console.log("Error in getting job images ");
            console.log(err);
            return [];
        })
    }
    getSavedJobImages(jobId){
        var query = "SELECT * FROM savedJobImages WHERE jobId="+jobId;
        return this.database.executeSql(query,[]).then(jobImages=>{
            let jobImagesList=[];
            if(jobImages.rows.length>0){
                for(var i=0; i<jobImages.rows.length;i++){
                    jobImagesList.push({
                        jobId:jobImages.rows.item(i).id,
                        imageUrl:jobImages.rows.item(i).imageUrl,
                        base64: jobImages.rows.item(i).base64
                    })
                }
                return jobImagesList;
            }
        },err=>{
            console.log("Error in getting job images ");
            console.log(err);
            return [];
        })
    }

    addAssetData(){
        var searchCriteria ={
            list:true
        };
        this.assetService.searchAssets(searchCriteria).subscribe(data=>{
            console.log("Asset data");
            console.log(data);
            let assetList = data.transactions;
            if(assetList.length>0){
                for(let i=0;i<assetList.length;i++){
                    console.log("Asset count");
                    console.log(i);
                    console.log(assetList.length);
                    this.insertAssetData(assetList[i].id, assetList[i].active, assetList[i].title, assetList[i].code, assetList[i].assetType, assetList[i].assetGroup, assetList[i].siteId, assetList[i].siteName,assetList[i].block,assetList[i].floor,assetList[i].zone,assetList[i].manufacturerName,assetList[i].modelNumber,assetList[i].serialNumber,assetList[i].acquiredDate,assetList[i].purchasePrice,assetList[i].curentPrice,assetList[i].estimatedDisposePrice).then(data=>{
                        console.log("Asset data added to SQLite");
                        this.getAssetConfigData(assetList[i].assetType,assetList[i].id).then(data=>{
                            console.log("Asset config data count for asset id - "+assetList[i].id);
                            console.log(data);
                            if(data.length>0){
                                this.deleteAssetConfigData(assetList[i].assetType,assetList[i].id).then(response=>{
                                    this.addAssetConfig(assetList[i].assetType,assetList[i].id);
                                },err=>{
                                    this.addAssetConfig(assetList[i].assetType,assetList[i].id);
                                })
                            }else{
                                this.addAssetConfig(assetList[i].assetType,assetList[i].id);
                            }
                        },err=>{
                            console.log("Error in getting asset config data");
                            console.log(err);
                            this.addAssetConfig(assetList[i].assetType,assetList[i].id);
                        });

                        this.getAssetAMC(assetList[i].id).then(data=>{
                            console.log("Asset amc data count for asset id - "+assetList[i].id);
                            console.log(data);
                            if(data.length>0){
                                this.deleteAssetAMCData(assetList[i].id).then(response=>{
                                    this.addAMCData(assetList[i].id);
                                },err=>{
                                    this.addAMCData(assetList[i].id);
                                })

                            }else{
                                this.addAMCData(assetList[i].id);
                            }
                        },err=>{
                            console.log("Error in getting asset amc data");
                            console.log(err);
                            this.addAMCData(assetList[i].id);

                        });

                        this.getAssetPPM(assetList[i].id).then(data=>{
                            console.log("Asset PPM data count for asset id - "+assetList[i].id);
                            console.log(data);
                            if(data.length>0){
                                this.deleteAssetPPMData(assetList[i].id).then(response=>{
                                    this.addPPMData(assetList[i].id);
                                },err=>{
                                    this.addPPMData(assetList[i].id);
                                })
                            }else{
                                this.addPPMData(assetList[i].id);
                            }
                        },err=>{
                            console.log("Error in getting asset PPM data");
                            console.log(err);
                            this.addPPMData(assetList[i].id);
                        })

                        this.getAssetReadings(assetList[i].id).then(data=>{
                            if(data && data.length>0){
                                this.deleteAssetReadings(assetList[i].id).then(response=>{
                                    this.addAssetReadingData(assetList[i].id);
                                },err=>{
                                    this.addAssetReadingData(assetList[i].id);
                                })
                            }else{
                                this.addAssetReadingData(assetList[i].id);
                            }
                        },err=>{
                            this.addAssetReadingData(assetList[i].id);
                        })

                    },err=>{
                        console.log("Error in adding asset data to SQLite");
                        console.log(err);

                    });

                    if(i==assetList.length){
                        console.log("All assets synced");
                    }else{
                        console.log("Assets loading");
                    }
                }
            }else{
                console.log("NO Asset data found");
            }
        })
    }

    deleteAssetConfigData(assetType,assetId){
        return this.database.executeSql("DELETE FROM config WHERE assetType=? AND assetId=?",[assetType,assetId]).then(response=>{
            console.log("Asset config data successfully deleted");
            return response;
        },err=>{
            console.log("Error in deleting config data");
            console.log(err);
            return err;
        })
    }

    deleteAssetAMCData(assetId){
        return this.database.executeSql("DELETE FROM amc WHERE assetId=?",[assetId]).then(response=>{
            console.log("Asset config data successfully deleted");
            return response;
        },err=>{
            console.log("Error in deleting config data");
            console.log(err);
            return err;
        })
    }

    deleteAssetPPMData(assetId){
        return this.database.executeSql("DELETE FROM ppm WHERE assetId=?",[assetId]).then(response=>{
            console.log("Asset config data successfully deleted");
            return response;
        },err=>{
            console.log("Error in deleting config data");
            console.log(err);
            return err;
        })
    }

    deleteAssetReadings(assetId){
        return this.database.executeSql("DELETE FROM assetReadings WHERE assetId=?",[assetId]).then(response=>{
            console.log("Asset config data successfully deleted");
            return response;
        },err=>{
            console.log("Error in deleting config data");
            console.log(err);
            return err;
        })
    }

    insertAssetData(id, active, title, code, assetType, assetGroup, siteId, siteName, block, floor, zone, manufacturerName, modelNumber, serialNumber, acquiredDate,purchasePrice,  currentPrice,estimatedDisposePrice ){
        let data = [id, active, title, code, assetType, assetGroup, siteId, siteName, block, floor, zone, manufacturerName, modelNumber, serialNumber, acquiredDate,purchasePrice,  currentPrice,estimatedDisposePrice ];
        return this.database.executeSql("INSERT INTO asset (id,active,title,code,assettype,assetGroup,siteId,siteName,block,floor,zone,manufacturerName,modelNumber,serialNumber,acquiredDate,purchasePrice,currentPrice,estimatedDisposePrice) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",data).then(data=>{

            return data;
        },err=>{
            console.log("Error in adding asset data");
            console.log(err);
            return err;
        })

    }

    getAssetData(){
        console.log("SQLite aset data");
        var query = "SELECT * FROM asset";
        return this.database.executeSql(query, []).then(data=>{
            console.log(data.rows.length);
            let assetList = [];
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    console.log("Asset data in SQLite");
                    console.log(data.rows.item(i));
                    console.log(data.rows.item(i).id);
                    assetList.push({
                        id:data.rows.item(i).id,
                        active: data.rows.item(i).active,
                        title: data.rows.item(i).title,
                        code: data.rows.item(i).code,
                        assetType: data.rows.item(i).assetType,
                        assetGroup: data.rows.item(i).assetGroup,
                        siteId: data.rows.item(i).siteId,
                        siteName: data.rows.item(i).siteName,
                        block: data.rows.item(i).block,
                        floor: data.rows.item(i).floor,
                        zone: data.rows.item(i).zone,
                        manufacturerName: data.rows.item(i).manufacturerName,
                        modelNumber: data.rows.item(i).modelNumber,
                        serialNumber: data.rows.item(i).serialNumber,
                        acquiredDate: data.rows.item(i).acquiredDate,
                        purchasePrice: data.rows.item(i).purchasePrice,
                        currentPrice: data.rows.item(i).currentPrice,
                        estimatedDisposePrice: data.rows.item(i).estimatedDisposePrice
                    })
                }
            }
            return assetList;
        },err=>{
            console.log("Error in getting assets");
            console.log(err);
            return [];

        })
    }

    getAssetDataByCode(assetCode){

        var query = "SELECT * FROM asset WHERE code="+assetCode;
        return this.database.executeSql("SELECT * FROM asset WHERE code=?", [assetCode]).then(data=>{
            let assetList :any;
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    assetList = {
                        id:data.rows.item(i).id,
                        active: data.rows.item(i).active,
                        title: data.rows.item(i).title,
                        code: data.rows.item(i).code,
                        assetType: data.rows.item(i).assetType,
                        assetGroup: data.rows.item(i).assetGroup,
                        siteId: data.rows.item(i).siteId,
                        siteName: data.rows.item(i).siteName,
                        block: data.rows.item(i).block,
                        floor: data.rows.item(i).floor,
                        zone: data.rows.item(i).zone,
                        manufacturerName: data.rows.item(i).manufacturerName,
                        modelNumber: data.rows.item(i).modelNumber,
                        serialNumber: data.rows.item(i).serialNumber,
                        acquiredDate: data.rows.item(i).acquiredDate,
                        purchasePrice: data.rows.item(i).purchasePrice,
                        currentPrice: data.rows.item(i).currentPrice,
                        estimatedDisposePrice: data.rows.item(i).estimatedDisposePrice
                    }
                }
            }
            return assetList;
        },err=>{
            console.log("Error in getting assets");
            console.log(err);
            return err;
        })
    }

    createAMC(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS amc(id INT,title TEXT,status TEXT,frequency TEXT,frequencyPrefix TEXT,assetId INT, startDate TEXT,endDate TEXT)").then(data=>{
            console.log("AMC schedule table created successfully");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in creating amc table");
            console.log(err);
            return err;
        })
    }

    addAMCData(assetId){
        console.log("Getting asset amc data for SQLite");
        console.log(assetId);
        this.assetService.getAssetAMCSchedule(assetId).subscribe(response=>{
            console.log("Asset amc schedule details");
            console.log(response);

            if(response && response.errorStatus){
                console.log("error in getting asset amc schedule");
                console.log(response.errorMessage);
            }else{
                console.log(response.length);
                if(response && response.length>0){
                    for(let i=0; i<response.length;i++){
                        console.log(response[i].id);
                        this.insertAssetAMC(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate).then(response=>{
                            console.log("Data inserted");
                        },err=>{
                            console.log("error in inserting data");
                            console.log(err);
                        });
                    }
                }
            }



        })
    }

    insertAssetAMC(id, title, status, frequency, frequencyPrefix, assetId, startDate, endData){
        let data = [id, title, status, frequency, frequencyPrefix, assetId, startDate, endData];
        return this.database.executeSql("INSERT INTO amc(id,title,status,frequency,frequencyPrefix,assetId,startDate,endDate) VALUES (?,?,?,?,?,?,?,?)",data).then(data=>{
            return data;
        },err=>{
            console.log("Error in inserting asset ppm schedule");
            console.log(err);
            return err;
        })
    }

    getAssetAMC(assetId){
        var query = "SELECT * FROM amc WHERE assetId="+assetId;
        return this.database.executeSql(query,[]).then(data=>{
            let amc=[];
            if(data.rows.length>0){
                for (let i=0;i<data.rows.length;i++){
                    amc.push({
                        id:data.rows.item(i).id,
                        title:data.rows.item(i).title,
                        status: data.rows.item(i).status,
                        frequency: data.rows.item(i).frequency,
                        frequencyPrefix:data.rows.item(i).frequencyPrefix,
                        assetId: data.rows.item(i).assetId,
                        startDate: data.rows.item(i).startDate,
                        endDate:data.rows.item(i).endDate
                    })
                }
            }
            return amc;
        },err=>{
            console.log("Error in getting amc details for asset");
            console.log(err);
            return [];
        })
    }

    createPPM(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS ppm(id INT,title TEXT,status TEXT,frequency TEXT,frequencyPrefix TEXT,assetId INT, startDate TEXT,endDate TEXT)").then(data=>{
            console.log("PPM schedule table created successfully");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in creating amc table");
            console.log(err);
            return err;
        })
    }

    addPPMData(assetId){
        console.log("Getting asset ppm data for SQLite");
        console.log(assetId);
        this.assetService.getAssetPPMSchedule(assetId).subscribe(response=>{
            console.log("Asset ppm schedule details");
            console.log(response);
            if(response && response.errorStatus){
                console.log("Error in getting asset ppm schedule");
                console.log(response.errorMessage);
            }else{
                if(response && response.length>0){
                    for(let i=0; i<response.length;i++){
                        this.insertAssetPPM(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate);
                    }
                }
            }



        })
    }

    insertAssetPPM(id, title, status, frequency, frequencyPrefix, assetId, startDate, endData){
        let data = [id, title, status, frequency, frequencyPrefix, assetId, startDate, endData];
        return this.database.executeSql("INSERT INTO ppm(id,title,status,frequency,frequencyPrefix,assetId,startDate,endDate) VALUES (?,?,?,?,?,?,?,?)",data).then(data=>{
            return data;
        },err=>{
            console.log("Error in inserting asset ppm schedule");
            console.log(err);
            return err;
        })
    }

    getAssetPPM(assetId){
        console.log(assetId);
        var query = "SELECT * FROM ppm WHERE assetId="+assetId;
        return this.database.executeSql(query,[]).then(data=>{
            let amc=[];
            console.log(data.rows.length);
            if(data.rows.length>0){
                console.log(data.rows);
                for (let i=0;i<data.rows.length;i++){
                    console.log(data.rows.item(i));
                    amc.push({
                        id:data.rows.item(i).id,
                        title:data.rows.item(i).title,
                        status: data.rows.item(i).status,
                        frequency: data.rows.item(i).frequency,
                        frequencyPrefix:data.rows.item(i).frequencyPrefix,
                        assetId: data.rows.item(i).assetId,
                        startDate: data.rows.item(i).startDate,
                        endDate:data.rows.item(i).endDate
                    })
                }
            }
            return amc;
        },err=>{
            console.log("Error in getting ppm details for asset");
            console.log(err);
            return [];
        })
    }

    createConfigTable(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS config(assetId INT,assetTitle TEXT,assetType TEXT,consumptionMonitoringRequired TEXT,max TEXT,min TEXT,name TEXT,rule TEXT,status TEXT,threshold TEXT,uom TEXT,userId TEXT,validationRequired TEXT,syncedToServer TEXT)", []).then((data)=>{
            console.log("Table creation result");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in executing query");
            console.log(err);
            return null;
        })
    }

    addAssetConfig(assetType,assetId){
        console.log("asset type and asset id");
        console.log(assetType,assetId);
        this.assetService.getAssetConfig(assetType,assetId).subscribe(
            response=>{
                console.log("Get asset config");
                console.log(response);
                if(response.length>0){
                    for (var j=0;j<response.length;j++){
                        this.insertAssetConfigData(response[j].assetId,response[j].assetTitle,response[j].assetType, response[j].consumptionMonitoringRequired, response[j].max,response[j].min,response[j].name,response[j].rule,response[j].status,response[j].threshold, response[j].uom, response[j].userId, response[j].validationRequired);
                    }
                }
            },err=>{

            })
    }

    insertAssetConfigData(assetId, assetTitle,assetType, consumptionMonitoringRequired,name, max, min, rule, status, threshold, uom, userId, validationRequired ){
        let data = [assetId, assetTitle,assetType, consumptionMonitoringRequired, max, min,name, rule, status, threshold, uom, userId, validationRequired, false];
        return this.database.executeSql("INSERT INTO config(assetId ,assetTitle,assetType,consumptionMonitoringRequired,max,min,name,rule,status,threshold,uom,userId,validationRequired,syncedToServer) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", data).then(data => {
            console.log("Asset config data inserted successfully");
            return data;
        }, err => {
            console.log('Error in inserting asset config data: ', err);
            return err;
        });
    }

    getAssetConfigData(assetType, assetId){
        var query = "SELECT * FROM config WHERE assetType=? AND assetId=?";
        return this.database.executeSql(query, [assetType, assetId]).then(data=>{
            let assetConfig = [];
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    assetConfig.push({
                        assetId:data.rows.item(i).assetId,
                        assetTitle: data.rows.item(i).assetTitle,
                        assetType:data.rows.item(i).assetType,
                        consumptionMonitoringRequired:data.rows.item(i).consumptionMonitoringRequired,
                        max: data.rows.item(i).max,
                        min:data.rows.item(i).min,
                        name:data.rows.item(i).name,
                        rule:data.rows.item(i).rule,
                        status: data.rows.item(i).status,
                        threshold:data.rows.item(i).threshold,
                        uom: data.rows.item(i).uom,
                        userId: data.rows.item(i).userId,
                        validationRequired: data.rows.item(i).validationRequired,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }

            return assetConfig;
        },err=>{
            console.log("Error in getting asset config from SQLite");
            console.log(err);
            return [];
        })


    }

    addSites(){
        // this.cs.showLoader('Syncing site data');
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
                }
                this.cs.closeAll();
            });

    }

    insertSitesData(id: any,name: any) {
        let data = [id,name];
        return this.database.executeSql("INSERT INTO site (id,name) VALUES (?, ?)", data).then(data => {
            this.addEmployee(id);
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
            siteId:siteId,
            report:true
        };
        this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(response=>{
            let employee = [];
            employee = response.transactions;
            console.log(response.transactions);
            if (employee.length > 0) {
                for (let i = 0; i < employee.length; i++) {
                        this.insertEmployeeData(employee[i].id, employee[i].name,employee[i].lastName, employee[i].empId,siteId, employee[i].attendanceId, employee[i].checkedIn,employee[i].notCheckedOut, employee[i].faceAuthorised);
                }
            }
        })
    }

    insertEmployeeData(id: any, firstname: any, lastname: any, empId:any, siteId: any, attendanceId: any,checkedIn: any, notCheckedOut: any, faceAuthorised: any){

        let data = [id, firstname, lastname, empId, siteId, attendanceId,checkedIn,notCheckedOut, faceAuthorised, false];
        return this.database.executeSql("INSERT INTO employee (id, firstName, lastName, empId, siteId, attendanceId, checkedIn, notCheckedOut, faceAuthorised, syncedToServer ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
            console.log("Employee data inserted");
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });

    }

    updateEmployeeData( checkedIn, notCheckedOut, employeeId,attendanceId,syncedToServer){
        var query = "UPDATE employee SET checkedIn=?, notCheckedOut=?, syncedToServer=?, attendanceId=? where id=?";
        return this.database.executeSql(query,[checkedIn, notCheckedOut, syncedToServer, attendanceId,employeeId]).then(data => {
            console.log("Employee data updated");
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });
    }

    insertAttendanceCheckInData(employeeId,empId, siteId, checkInImage, checkInTime,attendanceId, offline){
        let data = [employeeId, empId, siteId, checkInImage, checkInTime, attendanceId, offline,false];
        return this.database.executeSql("INSERT INTO checkIn(employeeId, empId, siteId, checkInImage, checkInTime, attendanceId, offline,syncedToServer) VALUES (?,?,?,?,?,?,?,?)", data).then(data=>{
            console.log("Attendance checkIn data inserted");
            return data;
        },err=>{
            console.log("Error in inserting attendance check in data",err);
            console.log(err);
            return err;
        })
    }

    updateAttendanceCheckInData(employeeId,empId, siteId, checkInImage, checkInTime,attendanceId, offline){
        return this.database.executeSql("UPDATE checkIn SET employeeId=?, empId=?, siteId=?, checkInImage =?, checkInTime =?,attendanceId=?,offline=?",[employeeId,empId,siteId,checkInImage, checkInTime,attendanceId,true]).then(data=>{
            console.log("Attendance data updated");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in updating attendance data");
            console.log(err);
            return err;
        })
    }

    insertAttendanceCheckOutData(employeeId,empId, siteId, checkOutImage, checkOutTime,attendanceId, offline){
        let data = [employeeId, empId, siteId, checkOutImage, checkOutTime, attendanceId, offline,false];
        return this.database.executeSql("INSERT INTO checkOut(employeeId, empId, siteId, checkOutImage, checkOutTime, attendanceId, offline,syncedToServer) VALUES (?,?,?,?,?,?,?,?)", data).then(data=>{
            console.log("Attendance checkout data inserted");
            return data;
        },err=>{
            console.log("Error in inserting attendance check out data",err);
            console.log(err);
            return err;
        })
    }

    updateAttendanceCheckOutData(employeeId,siteId,attendanceId){
        return this.database.executeSql("UPDATE checkOut SET employeeId=?, siteId=?,attendanceId=?,offline=?",[employeeId,siteId,attendanceId,true]).then(data=>{
            console.log("Attendance data updated");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in updating attendance data");
            console.log(err);
            return err;
        })
    }

    deleteAttendanceCheckInData(employeeId,siteId){
        return this.database.executeSql("DELETE * FROM checkIn WHERE employeeId=?, siteId=?",[employeeId,siteId]).then(data=>{
            console.log("Attendance Checkin data deleted");
            return data;
        },err=>{
            console.log("Error in deleting record");
            console.log(err);
            return err;
        })
    }

    insertAttendanceData(id,employeeId, empId, siteId, checkInImage, checkInTime, checkOutImage, checkOutTime){
        let data = [id, employeeId, empId,siteId, checkInImage, checkInTime, checkOutImage, checkOutTime, false];
        return this.database.executeSql("INSERT INTO attendance (id, employeeId, empId,siteId, checkInImage, checkInTime, checkoutImage, checkOutTime, syncedToServer ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)", data).then(data => {
            console.log("Employee data inserted");
            return data;
        }, err => {
            console.log('Error: ', err);
            return err;
        });

    }

    updateAttendanceData( employeeId, siteId, checkOutImage, checkOutTime){
        var query = "UPDATE attendance SET checkOutImage = ?, checkOutTime=? where employeeId = ? and siteId=?";
        return this.database.executeSql(query,[checkOutImage, checkOutTime,employeeId, siteId]).then(data=>{
            console.log("Attendance data updated");
            console.log(data);
            return data;
        },err=>{
            console.log("Error in updating attendance data");
            console.log(err);
            return err;
        })
    }

    getEmployeeData(){
        return this.database.executeSql("SELECT * FROM employee",[]).then(data=>{
            console.log("Employee data from sqlite with faceauthorised true");
            console.log(data);
            let employees = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    employees.push({id:data.rows.item(i).id, firstName: data.rows.item(i).firstName, lastName: data.rows.item(i).lastName, siteId: data.rows.item(i).siteId, checkInImage: data.rows.item(i).checkInImage, checkoutImage: data.rows.item(i).checkoutImage, attendanceId: data.rows.item(i).attendanceId, checkedIn: data.rows.item(i).checkedIn, notCheckedOut: data.rows.item(i).notCheckedOut,
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

    getEmployeeDataBySiteId(siteId: any){
        var query = "SELECT * FROM employee WHERE faceAuthorised = 'true' and siteId = "+siteId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Employee data from sqlite with faceauthorised true");
            console.log(data);
            let employees = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    employees.push({
                        id:data.rows.item(i).id,
                        firstName: data.rows.item(i).firstName,
                        lastName: data.rows.item(i).lastName,
                        siteId: data.rows.item(i).siteId,
                        empId:data.rows.item(i).empId,
                        checkInImage: data.rows.item(i).checkInImage,
                        checkoutImage: data.rows.item(i).checkoutImage,
                        attendanceId: data.rows.item(i).attendanceId,
                        checkedIn: data.rows.item(i).checkedIn,
                        notCheckedOut: data.rows.item(i).notCheckedOut,
                        faceAuthorised: data.rows.item(i).faceAuthorised,
                        syncedToServer: data.rows.item(i).syncedToServer})
                }
            }
            return employees;
        },err=>{
            console.log("Error in getting employee data from sqlite");
            console.log(err);
            return [];
        })
    }

    getEmployeeDataById(employeeId){
        var query = "SELECT * FROM employee WHERE faceAuthorised = 'true' and id = "+employeeId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Employee data from sqlite with faceauthorised true");
            console.log(data);
            let employee={};
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    employee = {id:data.rows.item(i).id, firstName: data.rows.item(i).firstName, lastName: data.rows.item(i).lastName, siteId: data.rows.item(i).siteId, checkInImage: data.rows.item(i).checkInImage, checkoutImage: data.rows.item(i).checkoutImage, attendanceId: data.rows.item(i).attendanceId, checkedIn: data.rows.item(i).checkedIn, notCheckedOut: data.rows.item(i).notCheckedOut,
                        faceAuthorised: data.rows.item(i).faceAuthorised, syncedToServer: data.rows.item(i).syncedToServer};
                }
            }
            return employee;
        },err=>{
            console.log("Error in getting employee data from sqlite");
            console.log(err);
            return null;
        })
    }

    updateEmployeeStatus(employeeId){
        var query = "UPDATE employee SET syncedToServer = "+true+"WHERE employeeId = "+employeeId;
        return this.database.executeSql(query, []).then(data=>{
            console.log("Employee updated");
            return data;
        },err=>{
            console.log("Error in updating employee");
            return err;
        })
    }

    getAttendanceDataByEmployeeId(employeeId:any){
        var query = "SELECT * FROM attendance WHERE siteId = "+employeeId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        id:data.rows.item(i).id,
                        employeeId: data.rows.item(i).employeeId,
                        siteId: data.rows.item(i).siteId,
                        checkInImage: data.rows.item(i).checkInImage,
                        checkInTime: data.rows.item(i).checkInTime,
                        checkOutTime: data.rows.item(i).checkOutTime,
                        checkOutImage: data.rows.item(i).checkOutImage,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    getAttendanceData(){
        var query = "SELECT * FROM attendance ";
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        id:data.rows.item(i).id,
                        employeeId: data.rows.item(i).employeeId,
                        siteId: data.rows.item(i).siteId,
                        checkInImage: data.rows.item(i).checkInImage,
                        checkInTime: data.rows.item(i).checkInTime,
                        checkOutTime: data.rows.item(i).checkOutTime,
                        checkOutImage: data.rows.item(i).checkOutImage,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    getAttendanceCheckInData(){
        var query = "SELECT * FROM checkIn ";
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId,
                        siteId: data.rows.item(i).siteId,
                        checkInImage: data.rows.item(i).checkInImage,
                        checkInTime: data.rows.item(i).checkInTime,
                        attendanceId: data.rows.item(i).attendanceId,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    getAttendanceCheckInDataByEmployeeAndSite(employeeId, siteId){
        var query = "SELECT * FROM checkIn WHERE employeeId = "+employeeId+" And siteId="+siteId;
        console.log(query);
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance checkIn data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId,
                        siteId: data.rows.item(i).siteId,
                        checkInImage: data.rows.item(i).checkInImage,
                        checkInTime: data.rows.item(i).checkInTime,
                        attendanceId: data.rows.item(i).attendanceId,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    getAttendanceCheckOutData(){
        var query = "SELECT * FROM checkOut ";
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId,
                        siteId: data.rows.item(i).siteId,
                        checkOutImage: data.rows.item(i).checkOutImage,
                        checkOutTime: data.rows.item(i).checkOutTime,
                        attendanceId: data.rows.item(i).attendanceId,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    getAttendanceCheckOutDataByEmployeeAndSite(employeeId, siteId){
        var query = "SELECT * FROM checkOut WHERE employeeId = "+employeeId+" And siteId="+siteId;
        console.log(query);
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Attendance checkout data from sqlite");
            console.log(data);
            let attendanceData = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    attendanceData.push({
                        employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId,
                        siteId: data.rows.item(i).siteId,
                        checkOutImage: data.rows.item(i).checkOutImage,
                        checkOutTime: data.rows.item(i).checkOutTime,
                        attendanceId: data.rows.item(i).attendanceId,
                        syncedToServer: data.rows.item(i).syncedToServer
                    })
                }
            }
            return attendanceData;
        },err=>{
            console.log("Error in getting attendance data from sqlite");
            console.log(err);
            return [];
        })
    }

    createJobsTable(){
        this.database.executeSql("DROP TABLE IF EXISTS jobs");
        try {
            const data = this.database.executeSql("CREATE TABLE IF NOT EXISTS jobs(id int UNIQUE PRIMARY KEY , siteId int NOT NULL,assetId int, siteName TEXT, title TEXT, description TEXT,status TEXT, maintenanceType TEXT,jobType TEXT, employeeId int, empId TEXT, employeeName TEXT, plannedStartTime DATE, actualEndTime DATE, updated BOOLEAN) ", []);
            console.log("Table creation result");
            console.log(data);
            return data;
        }
        catch (err) {
            console.log("Error in executing query");
            console.log(err);
            return null;
        }
    }

    addJobs(){
        var search = {report:true,checkInDateTimeFrom:new Date(),schedule:"ONCE"};
        this.jobService.getJobs(search).subscribe( response=>{
           console.log("Jobs to sqlite");
           console.log(response.transactions);
           let jobs = [];
           jobs = response.transactions;
           if(jobs.length>0){
               for(var i=0; i<jobs.length;i++){
                   console.log(jobs[i].checklistItems);
                   this.insertJobsData(jobs[i].id, jobs[i].siteId, jobs[i].siteName, jobs[i].title,jobs[i].assetId, jobs[i].status, jobs[i].description, jobs[i].maintenanceType,jobs[i].jobType, jobs[i].employeeId, jobs[i].empId, jobs[i].employeeName, jobs[i].plannedStartTime)
                   if(jobs[i].checklistItems!=null && jobs[i].checklistItems.length>0){
                       console.log("checklist items");
                       console.log(jobs[i].checklistItems);
                       this.insertChecklistData(jobs[i].checklistItems, jobs[i].id, jobs[i].checklistItems.length);
                   }
                   this.addSavedJobImages(jobs[i].id);
               }
           }
        },err=>{
            console.log("Error in syncing jobs");
            console.log(err);
        });

    }

    insertJobsData(id: any,siteId: any, siteName: any, title: any,assetId, status: any, description: any, maintenanceType: any,jobType: any, employeeId: any, empId: any, employeeName: any, plannedStartTime: any){
        let data = [id,siteId,assetId, siteName, title, status, description, maintenanceType, jobType, employeeId, empId, employeeName, plannedStartTime, null];
        return this.database.executeSql("INSERT INTO jobs (id, siteId,assetId, siteName, title, status, description, maintenanceType, jobType, employeeId, empId, employeeName, plannedStartTime, actualEndTime, updated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,FALSE)",data).then(data=>{
            console.log("JObs data successfully inserted");
            return data;
        },err=>{
            console.log("Error in inserting jobs data: ", err );
            return err;
        })
    }

    updateJobsData(jobData){
        console.log(jobData.status);
        console.log(jobData.actualEndTime);
        console.log(jobData.id);

        return this.database.executeSql("UPDATE jobs SET status=?, actualEndTime=?, updated=TRUE WHERE id=?",[jobData.status,jobData.actualEndTime,jobData.id]).then(data=>{
            console.log("Job successfully updated in SQLite");
            return data;
        },err=>{
            console.log("Error in updating job to SQLite");
            console.log(err);
            return err;
        })
    }

    insertChecklistData(checklistItems, jobId, count){
        this.getChecklistItemsForJob(jobId).then(jobs=>{
            console.log("Count for jobId - "+jobId);
            if(jobs && jobs.length>0){
                console.log(jobs.length);
                console.log("Checklist already available");
            }else{
                for(let i=0;i<checklistItems.length;i++){
                    console.log(checklistItems[i]);
                    let data= [jobId, checklistItems[i].completed, checklistItems[i].checklistItemName, checklistItems[i].remarks];
                    this.database.executeSql("INSERT INTO checklist(jobId, completed, itemName, remarks) VALUES (?,?,?,?)",data ).then(data=>{
                        console.log("Checklist item successfully inserted");
                        // console.log(data);

                    },err=>{
                        console.log("Error in adding item to checklist table: ", err);
                    })
                }
            }
        },err=>{
            console.log("Error in getting checklist items count");
        });


    }

    updateChecklistData(checklistItem){
        return this.database.executeSql("UPDATE checklist SET completed=?, remarks =? WHERE jobId=? and itemName=?",[checklistItem.completed,checklistItem.remarks,checklistItem.jobId,checklistItem.itemName]).then(response=>{
            console.log("Checklist item - "+checklistItem.itemName+" has been updated successfully");
            return response;
        },err=>{
            console.log("Error in updating checklist item - "+checklistItem.itemName+" - of job - "+checklistItem.jobId);
            console.log(err);
            return err;
        })
    }

    getChecklistItemsCountForJob(jobId){
        var query = "SELECT COUNT(*) FROM checklist WHERE jobId="+jobId;

        return this.database.executeSql(query,[]).then(data=>{
            console.log("Checklist Items count for job - "+jobId);
            console.log(data.rows.item(0)
            );

            return data.rows.item(0);
        },err=>{
            console.log("Error in getting checklist items");
            console.log(err);
            return null;
        })
    }

    getChecklistItemsForJob(jobId){
        var query = "SELECT * FROM checklist WHERE jobId= "+jobId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Checklist Items for job - "+jobId);
            console.log(data);
            let checklistItems = [];
            if(data.rows.length>0){
                for(var i=0; i<data.rows.length;i++){
                    checklistItems.push({
                        jobId:data.rows.item(i).jobId,
                        completed: data.rows.item(i).completed,
                        itemName: data.rows.item(i).itemName,
                        remarks: data.rows.item(i).remarks
                    })

                }
                return checklistItems;

            }

        },err=>{
            console.log("Error in getting checklist items");
            console.log(err);
            return [];
        })
    }

    getJobsData(){
        return this.database.executeSql("SELECT * FROM jobs  ",[]).then(data=>{
            console.log("Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({
                        id:data.rows.item(i).id,
                        siteId: data.rows.item(i).siteId,
                        siteName: data.rows.item(i).siteName,
                        title: data.rows.item(i).title,
                        status: data.rows.item(i).status,
                        description: data.rows.item(i).description,
                        maintenanceType: data.rows.item(i).maintenanceType,
                        employeeId: data.rows.item(i).employeeId,
                        jobType:data.rows.item(i).jobType,
                        empId: data.rows.item(i).empId,
                        employeeName: data.rows.item(i).employeeName,
                        plannedStartTime: data.rows.item(i).plannedStartTime,
                        actualEndTime: data.rows.item(i).actualEndTime,
                        jobStatus:data.rows.item(i).status,
                        updated:data.rows.item(i).updated
                    })
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
        var query = "SELECT * FROM jobs WHERE type= "+"PPM";
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({id:data.rows.item(i).id,assetId:data.rows.item(i).assetId, siteId: data.rows.item(i).siteId, siteName: data.rows.item(i).siteName, title: data.rows.item(i).title,
                        status: data.rows.item(i).status, description: data.rows.item(i).description, maintenanceType: data.rows.item(i).maintenanceType, employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId, employeeName: data.rows.item(i).employeeName, plannedStartTime: data.rows.item(i).plannedStartTime, actualEndTime: data.rows.item(i).actualEndTime})
                }
            }
            return jobs;
        },err=>{
            console.log("Error in getting PPM jobs data from sqlite");
            console.log(err);
            return [];
        })

    }

    getAMCJobsData(){

        var query = "SELECT * FROM jobs WHERE type= "+"AMC";
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({id:data.rows.item(i).id, siteId: data.rows.item(i).siteId, siteName: data.rows.item(i).siteName, title: data.rows.item(i).title,
                        status: data.rows.item(i).status, description: data.rows.item(i).description, maintenanceType: data.rows.item(i).maintenanceType, employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId, employeeName: data.rows.item(i).employeeName, plannedStartTime: data.rows.item(i).plannedStartTime, actualEndTime: data.rows.item(i).actualEndTime})
                }
            }
            return jobs;
        },err=>{
            console.log("Error in getting AMC jobs data from sqlite");
            console.log(err);
            return [];
        })

    }

    getAssetPPMJobsData(assetId){
        var query = "SELECT * FROM jobs WHERE maintenanceType= "+"'PPM'"+"AND assetId = "+assetId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("PPM Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({id:data.rows.item(i).id,assetId:data.rows.item(i).assetId, siteId: data.rows.item(i).siteId, siteName: data.rows.item(i).siteName, title: data.rows.item(i).title,
                        status: data.rows.item(i).status, description: data.rows.item(i).description, maintenanceType: data.rows.item(i).maintenanceType, employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId, employeeName: data.rows.item(i).employeeName, plannedStartTime: data.rows.item(i).plannedStartTime, actualEndTime: data.rows.item(i).actualEndTime})
                }
            }
            return jobs;
        },err=>{
            console.log("Error in getting PPM jobs data from sqlite");
            console.log(err);
            return [];
        })

    }

    getAssetAMCJobsData(assetId){

        var query = "SELECT * FROM jobs WHERE maintenanceType= "+"'AMC'"+"AND assetId="+assetId;
        return this.database.executeSql(query,[]).then(data=>{
            console.log("Jobs data from sqlite");
            console.log(data);
            let jobs = [];
            if(data.rows.length>0){
                for(var i =0; i<data.rows.length;i++){
                    jobs.push({id:data.rows.item(i).id, siteId: data.rows.item(i).siteId, siteName: data.rows.item(i).siteName, title: data.rows.item(i).title,
                        status: data.rows.item(i).status, description: data.rows.item(i).description, maintenanceType: data.rows.item(i).maintenanceType, employeeId: data.rows.item(i).employeeId,
                        empId: data.rows.item(i).empId, employeeName: data.rows.item(i).employeeName, plannedStartTime: data.rows.item(i).plannedStartTime, actualEndTime: data.rows.item(i).actualEndTime})
                }
            }
            return jobs;
        },err=>{
            console.log("Error in getting AMC jobs data from sqlite");
            console.log(err);
            return [];
        })

    }

    createReadingsTable(){
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS assetReadings(id Int, name VARCHAR, uom VARCHAR, initialValue INT, initialValueTime DAte, finalValue INT, finalValueTime DATE, consumption INT, assetId INT, assetParameterConfigId INT, consumptionMonitoringRequired BOOLEAN, assetType TEXT)",[]).then(data=>{
            console.log("Asset Reading table created sucessfully");
            return data;
        },err=>{
            console.log("Error in creating asset reading table");
            console.log(err);
            return err;
        });
    }

    addAssetReadingData(assetId){

        var searchCriteria = {assetId: assetId};
        this.assetService.viewReading(searchCriteria).subscribe(
            response=>{
                console.log("asset reading");
                console.log(response);
                let readings = response.transactions;
                if(readings && readings.length>0){
                    for(let i=0;i<readings.length;i++){
                        this.insertAssetReading(readings[i].id,readings[i].name,readings[i].uom,readings[i].initialValue,readings[i].initialReadingTime, readings[i].finalValue, readings[i].finalReadingTime, readings[i].consumption, readings[i].assetId, readings[i].assetParameterConfigId,readings[i].consumptionMonitoringRequired, readings[i].assetType );

                    }
                }
            }
        )

    }

    insertAssetReading(id, name, uom, initialValue, initialValueTime, finalValue, finalValueTime, consumption, assetId, assetParameterConfigId, consumptionMonitoringRequired, assetType ){
        let data = [id, name, uom, initialValue, initialValueTime, finalValue, finalValueTime, consumption, assetId, assetParameterConfigId, consumptionMonitoringRequired, assetType];
        return this.database.executeSql("INSERT INTO assetReadings(id, name, uom, initialValue, initialValueTime, finalValue, finalValueTime, consumption, assetId, assetParameterConfigId, consumptionMonitoringRequired, assetType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",data).then(response=>{
            return data;
        },err=>{
            console.log("Error in inserting asset Readings");
            console.log(err);
            return err;
        })
    }

    getAssetReadings(assetId){
        var query = "SELECT * FROM assetReadings WHERE assetId="+assetId;
        return this.database.executeSql(query, []).then(response=>{
            let assetReadings = [];
            if(response && response.rows.length>0){
                for(let i=0; i<response.rows.length;i++){
                    assetReadings.push({
                        id:response.rows.item(i).id,
                        name:response.rows.item(i).name,
                        uom:response.rows.item(i).uom,
                        initialValue:response.rows.item(i).initialValue,
                        initialValueTime:response.rows.item(i).initialValueTime,
                        finalValue:response.rows.item(i).finalValue,
                        finalValueTime:response.rows.item(i).finalValueTime,
                        consumption:response.rows.item(i).consumption,
                        assetId:response.rows.item(i).assetId,
                        assetParameterConfigId:response.rows.item(i).assetParameterConfigId,
                        consumptionMonitoringRequired:response.rows.item(i).consumptionMonitoringRequired,
                        assetType:response.rows.item(i).assetType,

                    })
                }

                return assetReadings;
            }
        },err=>{
            console.log("Error in getting asset readings");
            console.log(err);
            return err;
        })
    }

    dropAllTables(){
        return this.sqlite.deleteDatabase({
            name: 'taskman.db',
            location: 'default'
        }).then(data=>{
            console.log("Database successfully droped");
            return true;
        },err=>{
            console.log("Error in dropping database");
            return false;
        });
    }

    createAllTables(){
        this.createSiteTable();
        this.createEmployeeTable();
        this.createJobsTable();
        this.createCheckListTable();
        this.createAttendanceCheckInTable();
        this.createAttendanceCheckOutTable();
        this.createAssetTable();
        this.createConfigTable();
        this.createAMC();
        this.createPPM();
    }

    saveJob(jobDetails,jobImages){
        this.cs.showLoader("Saving Job");
        return this.jobService.saveJob(jobDetails).subscribe(
            response=>{
                    if(response.errorStatus){
                        this.cs.closeAll();
                        demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                        return response;
                    }else{
                        this.cs.closeAll();
                        console.log("Save Job response");
                        console.log(response);
                        console.log(jobDetails.checkInOutId);
                        if(jobImages && jobImages.length>0){
                            this.cs.closeAll();
                            this.cs.showLoader('Uploading Images');
                            console.log("checkout details");
                            console.log(this.checkOutDetails);
                            this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                            this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                            this.checkOutDetails.projectId =jobDetails.siteProjectId;
                            this.checkOutDetails.siteId = jobDetails.siteId;
                            this.checkOutDetails.jobId = jobDetails.id;
                            this.checkOutDetails.id=jobDetails.checkInOutId;
                            console.log("checkoutDetails",this.checkOutDetails);
                            this.jobService.updateJobImages(this.checkOutDetails).subscribe(
                                response=>{
                                    console.log("complete job response");
                                    console.log(response);
                                    //TODO
                                    for(let k=0;k<jobImages.length;k++) {
                                        var employeeId=Number;
                                        employeeId=this.checkOutDetails.employeeId;
                                        let token_header=window.localStorage.getItem('session');
                                        let options: FileUploadOptions = {
                                            fileKey: 'photoOutFile',
                                            fileName:this.checkOutDetails.employeeId+'_photoOutFile_'+response.transactionId,
                                            headers:{
                                                'X-Auth-Token':token_header
                                            },
                                            params:{
                                                employeeEmpId: this.checkOutDetails.employeeEmpId,
                                                employeeId: this.checkOutDetails.employeeId,
                                                projectId:this.checkOutDetails.projectId,
                                                siteId:this.checkOutDetails.siteId,
                                                checkInOutId:response.transactionId,
                                                jobId:this.checkOutDetails.jobId,
                                                action:"OUT"
                                            }
                                        };

                                        this.fileTransfer.upload(jobImages[k].image, this.config.Url+'api/employee/image/upload', options)
                                            .then((data) => {
                                                this.cs.closeAll();
                                                console.log(data);
                                                console.log("image upload");
                                                return {
                                                    status: true,
                                                    msg:"Image upload successful"
                                                }

                                            }, (err) => {
                                                this.cs.closeAll();
                                                console.log(err);
                                                console.log("image upload fail");
                                                return {
                                                    status:false,
                                                    msg:"Error in uploading job image"
                                                }

                                            })

                                    }

                                },err=>{
                                    console.log("Error in completing or saving job");
                                    this.cs.closeAll();
                                    return {
                                        status:false,
                                        msg:"Error in completing or saving job"
                                    }

                               })
                        }else{
                            this.cs.closeAll();
                            return {
                                status:true,
                                msg:"Job Completion success, no Images found"
                            };
                        }
                    }
            },err=>{
                console.log("Error in saving response");
                console.log(err);
                this.cs.closeAll();
                this.cs.showToastMessage('Error in saving job, please try again...','bottom');
                return {
                    status:false,
                    msg:"Error in completing or saving job"
                }

            })

    }

    completeJob(job, takenImages){
        this.cs.showLoader('Completing Job');
        console.log("getJobs",job);
        console.log("getImages",takenImages);
        let checkOutDetails:any;
        this.jobService.getJobDetails(job.id).subscribe(jobDetails=>{
            console.log("Job details from server");
            console.log(jobDetails);
            jobDetails.status = job.status;
            jobDetails.checklistItems = job.checklistItems;
            this.jobService.saveJob(jobDetails).subscribe(
                response=>{
                    console.log("get jobs",job);
                    this.checkOutDetails.completeJob=true;
                    this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                    this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                    this.checkOutDetails.projectId =job.siteProjectId;
                    this.checkOutDetails.siteId = job.siteId;
                    this.checkOutDetails.jobId = job.id;
                    // this.checkOutDetails.latitudeOut = this.latitude;
                    // this.checkOutDetails.longitude = this.longitude;
                    this.checkOutDetails.id=job.checkInOutId;
                    this.jobService.updateJobImages(this.checkOutDetails).subscribe(
                        response=>{
                            if(response.errorStatus){
                                this.cs.closeAll();
                                // demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                            }else{
                                this.cs.closeAll();
                                console.log("complete job response");
                                console.log(response);
                                console.log(job);
                                this.cs.showToastMessage('Job Completed Successfully','bottom');
                                // this.component.showLoader('Uploading Images');
                                //TODO
                                //File Upload after successful checkout
                                for(let i in takenImages) {

                                    console.log("image loop");
                                    console.log(i);
                                    console.log(takenImages[i]);
                                    console.log(takenImages[i].file);
                                    // console.log(this.jobDetails.id);
                                    // console.log(this.jobDetails.id+i);
                                    console.log(this.checkOutDetails.employeeId);
                                    console.log(this.checkOutDetails.employeeEmpId);
                                    console.log(this.checkOutDetails.projectId);
                                    console.log(this.checkOutDetails.siteId);
                                    console.log(this.checkOutDetails.jobId);
                                    var employeeId=Number;
                                    console.log(typeof employeeId);
                                    employeeId=this.checkOutDetails.employeeId;
                                    let token_header=window.localStorage.getItem('session');
                                    let options: FileUploadOptions = {
                                        fileKey: 'photoOutFile',
                                        fileName:this.checkOutDetails.employeeId+'_photoOutFile_'+response.transactionId,
                                        headers:{
                                            'X-Auth-Token':token_header
                                        },
                                        params:{
                                            employeeEmpId: this.checkOutDetails.employeeEmpId,
                                            employeeId: this.checkOutDetails.employeeId,
                                            projectId:this.checkOutDetails.projectId,
                                            siteId:this.checkOutDetails.siteId,
                                            checkInOutId:response.transactionId,
                                            jobId:this.checkOutDetails.jobId,
                                            action:"OUT"
                                        }
                                    };

                                    this.fileTransfer.upload(takenImages[i], this.config.Url+'api/employee/image/upload', options)
                                        .then((data) => {
                                            console.log(data);
                                            console.log("image upload");
                                            this.cs.closeLoader();
                                        }, (err) => {
                                            console.log(err);
                                            console.log("image upload fail");
                                            this.cs.closeLoader();
                                        })

                                }

                            }
                        },
                        err=>{
                            this.cs.closeLoader();
                            demo.showSwal('warning-message-and-confirmation-ok','Error in Uploading images');

                        }
                    )
                },error2 => {
                    this.cs.closeLoader();
                    console.log(error2);
                    demo.showSwal('warning-message-and-confirmation-ok','Error in Completing Job',error2.errorMessage);
                }
            )

        });

        this.cs.closeLoader();

    }


}