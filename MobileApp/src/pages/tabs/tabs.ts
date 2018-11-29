import {Component, Inject} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {DashboardPage} from "../dashboard/dashboard";
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {ReportsPage} from "../reports/reports";
import {QuotationPage} from "../quotation/quotation";
import {AttendancePage} from "../attendance/attendance";
import {CustomerDetailPage} from "../customer-detail/customer-detail";
import {EmployeeDetailPage} from "../employee-list/employee-detail";
import {EmployeeListPage} from "../employee-list/employee-list";
import {LoginPage} from "../login/login";
import {componentService} from "../service/componentService";
import {Network} from "@ionic-native/network";
import {SiteService} from "../service/siteService";
import {AttendanceService} from "../service/attendanceService";
import {OfflineAttendance} from "../employee/offline-attendance";
import {SQLite,SQLiteObject} from "@ionic-native/sqlite";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import {authService} from "../service/authService";
import {AppVersion} from "@ionic-native/app-version";
import {Market} from "@ionic-native/market";
import {Platform} from "ionic-angular";
import {SplashLogo} from "../splash-logo/splash-logo";
import {UpdateApp} from "../update-app/update-app";
import {OfflineAttendanceSites} from "../employee/offline-attendance-sites";
import {AlertController} from "ionic-angular";
import {DBService} from "../service/dbService";
import {OfflinePage} from "../offline-page/offline-page";
import {JobService} from "../service/jobService";

declare  var demo ;

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  DashboardTab:any;
  QuotationTab:any;
  CustomerDetailTab:any;
  EmployeeListTab:any;
  userType:any;

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
  };

  sites:any;
  offlineJobs: any;
  offlineAttendanceData:any;
  offlineEmployeeList:any;
  appVersionNumber:any;
  isOnline:boolean;
  appPackageName:any;
  savedImages: any;
  completedImagesComplete: any;
  completedImagesSave: any;
  private db: any;
  offlinesingleJob: any;
  completedImages: any;
  takenImages: any;
  offlineData:any;
  fileTransfer: FileTransferObject = this.transfer.create();
  checklist: any;



  constructor(public events:Events, private navCtrl:NavController, private component:componentService, private network:Network,
              private siteService:SiteService, private attendanceService:AttendanceService, private sqlite:SQLite,
              private authService:authService, private appVersion:AppVersion, private market:Market, private platform:Platform,
              private alertController:AlertController, private dbService:DBService,private jobService:JobService,
              private transfer: FileTransfer, private file: File, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig) {
    this.DashboardTab=DashboardPage;
    this.QuotationTab=QuotationPage;
    this.CustomerDetailTab=CustomerDetailPage;
    this.EmployeeListTab=EmployeeListPage;
    this.sites = [];
    this.offlineAttendanceData = [];
    this.offlineJobs = [];
    this.savedImages = [];
    this.completedImages = [];
    this.completedImagesComplete = [];
    this.completedImagesSave = [];
    this.takenImages = [];
    this.offlineData = [];
    this.checklist =[];
    this.checkOutDetails={
      employeeId:'',
      employeeEmpId:'',
      projectId:'',
      siteId:'',
      jobId:'',
      latitudeOut:'',
      longitude:'',
      completeJob:false,
      id:null
    };    this.events.subscribe('isOnline',(data)=>{
        console.log("Is Online event");
        console.log(data);
        if(data =='no'){
            this.isOnline = false;
        }else{
            this.isOnline=true;
        }
    });

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      console.log("Database connection");
      console.log(this.db)
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');

    this.appVersion.getPackageName().then(response=>{
        this.appPackageName=response;
    });

    this.appVersion.getVersionNumber().then(response=>{
        this.appVersionNumber = response;
    });

    this.authService.getCurrentVersion('Android').subscribe(
        response=>{
            var currentVersion = response[0];
            console.log(currentVersion.applicationVersion);
            console.log(this.appVersionNumber);
            if(this.appVersionNumber && this.appVersionNumber != currentVersion.applicationVersion ){
                console.log("Application needs to be updated");
                this.navCtrl.push(UpdateApp);

            }else{
                console.log("Application up to date");

                // this.market.open(this.appPackageName);
                // this.platform.exitApp();
            }
        }
    );
      this.dbService.getAllSavedImages().then(
        (res)=> {
          console.log("saved images", res);
          this.savedImages = res;
          console.log("savedimages", this.savedImages);
          if (this.savedImages.length > 0) {
            for (var i = 0; i < this.savedImages.length; i++) {
              // console.log("saved images",this.savedImages[i].image);
              let imageData = this.savedImages[i].image;
              let base64Image = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")
              // let base64Image = 'data:image/jpeg;base64,' + this.savedImages[i].image;
              this.completedImages.push(base64Image);
              this.component.closeLoader();

            }
          }else {
            this.component.closeLoader();
          }
        },(err)=>{
          console.log("error",err);
          this.savedImages = [];
          this.component.closeLoader();
        }
      )

    console.log(this.network.type);
    var session = window.localStorage.getItem('session');
      if(window.localStorage.getItem('session')){
          console.log("Session available");

          if(this.network.type != 'none'){
            this.setJobsSync();
          }else {
            console.log("data not sync");
            // this.navCtrl.setRoot()
          }
          // this.createLocalDB();
          // this.component.showToastMessage('Previous Login Detected, Login automatically','bottom');
      }else{
          console.log("Session not Available");
          this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }

  }

  ionViewWillEnter(){
    console.log("Check Network Connection");
      if(this.network.type!='none'){

      }else{
          this.navCtrl.setRoot(OfflinePage);
      }

  }

  createLocalDB(){
      this.siteService.searchSite().subscribe(response=>{
          var siteList = response;
          this.callSqlLite(siteList)
      })
  }

    callSqlLite(siteList)
    {
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {

                db.executeSql('DROP TABLE assetList',[])

                db.executeSql('create table IF NOT EXISTS assetList(id INT,name VARCHAR(32))', [])
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));


                for (var i = 0; i < siteList.length; i++) {
                    var query = "INSERT INTO assetList (id,name) VALUES (?,?)";

                    db.executeSql(query, [siteList[i].id, siteList[i].name])
                        .then(() => console.log('Executed SQL'))
                        .catch(e => console.log(e));
                }

            })

    }


  loadSiteAttendance(){
      window.localStorage.removeItem('offlineAttendanceData');
      for(var i of this.sites){
          console.log(i);
          var searchCriteria = {
              currPage:1,
              pageSort: 15,
              siteId:i.siteId
          };
          // this.siteService.searchSiteEmployee(i.siteId).subscribe(
          this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(
              response=>{
                  console.log("Attendance data in tabs page");
                  console.log(response.transactions);
                  this.offlineAttendanceData.push(response.transactions);
                  window.localStorage.setItem('offlineAttendanceData',JSON.stringify(this.offlineAttendanceData));
              }
          )
      }
      console.log(this.offlineAttendanceData);
  }


    // if(window.localStorage.getItem('attendanceCheckInData')){
    //     console.log("unsynced checkin information available in local storage");
    //     var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckInData'));
    //
    //     this.dbService.getAttendance().then(response=>{
    //         console.log(response);
    //         // this.componentService.closeLoader()
    //         var data = []
    //         data.push(response)
    //         for(var i=0;i<data.length;i++) {
    //             console.log("==================")
    //             console.log(data[i])
    //             this.attendanceService.markAttendanceCheckIn(data[i].siteId, data[i].employeeEmpId, data[i].latitudeIn, data[i].longitudeIn, data[i].checkInImage).subscribe(
    //                 response => {
    //                     console.log("Offline attendance data synced to server");
    //                     console.log("Clearing local storage");
    //                     window.localStorage.removeItem('attendanceCheckInData');
    //                     if (window.localStorage.getItem('attendanceCheckOutData')) {
    //                         console.log("unsynced checkout information available in local storage");
    //                         var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
    //                         this.attendanceService.markAttendanceCheckOut(data[i].siteId, data[i].employeeEmpId, data[i].latitudeIn, data[i].longitudeIn, data[i].checkInImage, response.id).subscribe(
    //                             response => {
    //                                 console.log("Offline attendance data synced to server");
    //                                 console.log("Clearing local storage");
    //                                 window.localStorage.removeItem('attendanceCheckOutData');
    //                             }, error2 => {
    //                                 console.log("Error in syncing attendance to server");
    //                             }
    //                         )
    //                     }
    //                 }, error2 => {
    //                     console.log("Error in syncing attendance to server");
    //                 }
    //             )
    //         }
    //     },err=>{
    //         console.log(err)
    //     })
    //
    //
    //
    //
    //
    //
    // }else if(window.localStorage.getItem('attendanceCheckOutData')){
    //     console.log("unsynced checkout information available in local storage");
    //     var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
    //     this.attendanceService.markAttendanceCheckOut(offlineData.siteId,offlineData.empId,offlineData.lat,offlineData.lng,offlineData.imageData,offlineData.id).subscribe(
    //         response=>{
    //             console.log("Offline attendance data synced to server");
    //             console.log("Clearing local storage");
    //             window.localStorage.removeItem('attendanceCheckOutData');
    //         },error2 => {
    //             console.log("Error in syncing attendance to server");
    //         }
    //     )
    // }
  // }


  setJobsSync() {
    this.component.showLoader("checking offline completed jobs...");
    this.dbService.getCompletedJobs().then(
      response=>{
        this.component.showLoader("completed jobs sync...");
        console.log("jobs sync response",response);
        this.offlineJobs = response;
          console.log("length", this.offlineJobs.length);
          console.log(this.offlineJobs);
          console.log("images", this.savedImages);

        this.component.closeLoader();


        this.offlineData = {};
        for (var i = 0; i < this.offlineJobs.length; i++) {
          this.offlineData.assetId = this.offlineJobs[i].assetId;
          this.offlineData.checkInDateTimeFrom = this.offlineJobs[i].checkInDateTimeFrom;
          this.offlineData.checkInDateTimeTo = this.offlineJobs[i].checkInDateTimeTo;
          this.offlineData.description = this.offlineJobs[i].description;
          this.offlineData.employeeEmpId = this.offlineJobs[i].employeeEmpId;
          this.offlineData.employeeId = this.offlineJobs[i].employeeId;
          this.offlineData.employeeName = this.offlineJobs[i].employeeName;
          this.offlineData.id = this.offlineJobs[i].id;
          this.offlineData.maintenanceType = this.offlineJobs[i].maintenanceType;
          this.offlineData.offlineCompleteResponse = this.offlineJobs[i].offlineCompleteResponse;
          this.offlineData.offlineUpdate = this.offlineJobs[i].offlineUpdate;
          this.offlineData.plannedEndTime = this.offlineJobs[i].plannedEndTime;
          this.offlineData.plannedStartTime = this.offlineJobs[i].plannedStartTime;
          this.offlineData.siteId = this.offlineJobs[i].siteId;
          this.offlineData.siteName = this.offlineJobs[i].siteName;
          this.offlineData.status = this.offlineJobs[i].status;
          this.offlineData.title = this.offlineJobs[i].title;
          this.checklist=[];
          this.offlineData.checklist=[];

          this.dbService.getCheckList(this.offlineJobs[i].id).then(
            res=>{
              console.log("getting checklist",res);
              this.checklist = [];
              this.checklist = res;
              console.log(this.checklist);
              if(this.offlineData.id == this.checklist.jobId){
                for(var c=0; c<this.checklist.length; c++){
                  if(this.checklist[c].completed == 'false'){
                    this.checklist[c].id = null;
                    this.checklist[c].completed = false;
                  }else {
                    this.checklist[c].id = null;
                    this.checklist[c].completed = true;
                  }
                  this.offlineData.checklist.push(this.checklist[c]);
                }
              }



            console.log("offlinejob",this.offlineData);


          if (this.offlineData.offlineCompleteResponse == 0) {
            if (this.offlineData.status == "COMPLETED") {
              console.log("completed jobs", this.offlineData);
              this.offlinesingleJob = this.offlineData;
              this.completedImagesComplete = [];

              for (var k = 0; k < this.savedImages.length; k++) {
                if (this.offlinesingleJob.id == this.savedImages[k].jobId) {
                  this.offlinesingleJob.jobStatus = this.offlinesingleJob.status;
                  this.completedImagesComplete.push(this.savedImages[k].image);
                  console.log("completedImagescomplete", this.completedImagesComplete);
                  this.completeJob(this.offlinesingleJob, this.completedImagesComplete);
                  this.offlinesingleJob.offlineCompleteResponse = 1;
                  console.log("setofflinecompleteResponse", this.offlinesingleJob);
                  this.dbService.setOfflineCompleteResponse(this.offlinesingleJob).then(
                    (res) => {
                      console.log("save offlinecomplete response", res);
                    }, (err) => {
                      console.log("error offlinecomplete response", err);
                    }
                  );
                }
              }
            } else {
              console.log("saved jobs", this.offlineData);
              this.offlinesingleJob = this.offlineData;
              this.completedImagesSave = [];
              for (var k = 0; k < this.savedImages.length; k++) {
                if (this.offlinesingleJob.id == this.savedImages[k].jobId) {
                  this.offlinesingleJob.jobStatus = this.offlinesingleJob.status;
                  this.completedImagesSave.push(this.savedImages[k].image);
                  console.log("completedImagesSave", this.completedImagesSave);
                  this.saveJob(this.offlinesingleJob, this.completedImagesSave);
                  this.offlinesingleJob.offlineCompleteResponse = 1;
                  console.log("setofflinecompleteResponse", this.offlinesingleJob);
                  this.dbService.setOfflineCompleteResponse(this.offlinesingleJob).then(
                    (res) => {
                      console.log("save offlinecomplete response", res);
                      this.component.closeLoader();
                    }, (err) => {
                      console.log("error offlinecomplete response", err);
                      this.component.closeLoader();
                    }
                  );
                }
              }
            }
          }else{
            console.log("job already synced");
            this.component.showToastMessage('job already synced','bottom');
          }
            }
          )
        }
      },(err)=>{
        this.component.closeLoader();
        console.log("error on getting completed jobs",err);
      })
    this.component.closeLoader();
  }

  saveJob(job,takenImages){
    this.component.showLoader('Saving Job');
    console.log(job)
    this.takenImages = takenImages;
    this.jobService.saveJob(job).subscribe(
      response=>{
        if(response.errorStatus){
          this.component.closeAll();
          demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
        }else{
          console.log("Save Job response");
          // this.component.closeLoader();
          this.component.showToastMessage('Job Saved Successfully','bottom');
          console.log(response);
          console.log(job.checkInOutId);
          console.log("takenimages length",this.takenImages.length);
          if(this.takenImages.length>0){
            this.component.showLoader('Uploading Images');
            this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
            this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            this.checkOutDetails.projectId =job.siteProjectId;
            this.checkOutDetails.siteId = job.siteId;
            this.checkOutDetails.jobId = job.id;
            this.checkOutDetails.id=job.checkInOutId;
            console.log("checkoutDetails",this.checkOutDetails);
            this.jobService.updateJobImages(this.checkOutDetails).subscribe(
              response=>{
                // this.component.closeLoader();
                console.log("complete job response");
                console.log(response);
                console.log(job);
                // this.component.showToastMessage('Job Completed Successfully','bottom');
                // this.component.showLoader('Uploading Images');
                //TODO
                //File Upload after successful checkout
                for(let i in this.takenImages) {

                  console.log("image loop");
                  console.log(i);
                  console.log(this.takenImages[i]);
                  console.log(this.takenImages[i].file);
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
                  console.log(typeof employeeId);
                  console.log(employeeId);
                  console.log(typeof this.checkOutDetails.jobId);
                  console.log(typeof this.checkOutDetails.projectId);
                  console.log(typeof this.checkOutDetails.employeeEmpId);
                  console.log(typeof this.checkOutDetails.employeeId);
                  console.log(typeof response.transactionId);
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

                  this.fileTransfer.upload(this.takenImages[i], this.config.Url+'api/employee/image/upload', options)
                    .then((data) => {
                      this.component.closeAll();
                      console.log(data);
                      console.log("image upload");
                      this.navCtrl.pop();
                    }, (err) => {
                      this.component.closeAll();
                      console.log(err);
                      console.log("image upload fail");
                    })

                }

              },err=>{
                this.component.closeLoader();
                // this.navCtrl.pop();
              }
            )
          }else{
            this.component.closeAll();
            this.navCtrl.pop();
          }
        }
      }
      ,err=>{
        console.log("Error in saving response");
        console.log(err);
        this.component.closeLoader();
        this.component.showToastMessage('Error in saving job, please try again...','bottom');
      }
    )
  }

  completeJob(job, takenImages){
    this.component.showLoader('Completing Job');
    /*this.geolocation.getCurrentPosition().then((response)=>{
      this.component.closeAll();
      console.log("Current location");
      console.log(response);
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
    }).catch((error)=>{
      this.latitude = 0;
      this.longitude = 0;
    })*/
    console.log("getJobs",job);
    console.log("getImages",takenImages);
    this.jobService.saveJob(job).subscribe(
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
        console.log(this.checkOutDetails);
        this.jobService.updateJobImages(this.checkOutDetails).subscribe(
          response=>{
            if(response.errorStatus){
              this.component.closeAll();
              // demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
              this.component.closeAll();
              console.log("complete job response");
              console.log(response);
              console.log(job);
              this.component.showToastMessage('Job Completed Successfully','bottom');
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
                console.log(typeof employeeId);
                console.log(employeeId);
                console.log(typeof this.checkOutDetails.jobId);
                console.log(typeof this.checkOutDetails.projectId);
                console.log(typeof this.checkOutDetails.employeeEmpId);
                console.log(typeof this.checkOutDetails.employeeId);
                console.log(typeof response.transactionId);
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
                    this.component.closeLoader();
                  }, (err) => {
                    console.log(err);
                    console.log("image upload fail");
                    this.component.closeLoader();
                  })

              }

            }
          },
          err=>{
            this.component.closeLoader();
            demo.showSwal('warning-message-and-confirmation-ok','Error in Uploading images');

          }
        )
      },error2 => {
        this.component.closeLoader();
        console.log(error2);
        demo.showSwal('warning-message-and-confirmation-ok','Error in Completing Job',error2.errorMessage);
      }
    )
    this.component.closeLoader();

  }


}
