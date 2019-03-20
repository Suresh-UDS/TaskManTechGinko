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
import {DatabaseProvider} from "../../providers/database-provider";

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
              private alertController:AlertController, private dbService:DBService,private jobService:JobService, private databaseProvider: DatabaseProvider,
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

    console.log(this.network.type);
    var session = window.localStorage.getItem('session');
      if(window.localStorage.getItem('session')){
          console.log("Session available");

          if(this.network.type != 'none'){
            // this.setJobsSync();
          }else {
            console.log("data not sync");
          }
      }else{
          console.log("Session not Available");
          // this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }
    this.databaseProvider.getDatabaseState().subscribe(status=>{
        console.log("Database status - "+status);
        if(status){
            this.databaseProvider.getSiteData().then(sites=>{
                console.log("Site information from sqlite - ");
                console.log(sites);
                if(sites && sites.length>0){
                    this.databaseProvider.addSites();
                    this.databaseProvider.addJobs();
                }else{
                    this.databaseProvider.createSiteTable();
                }
            },err=>{
               console.log("Error in getting site information from sqlite");
               console.log(err);

            });

        }

    })

  }

  ionViewWillEnter(){
    console.log("Check Network Connection");
      if(this.network.type!='none'){

      }else{
          this.navCtrl.setRoot(OfflinePage);
      }

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
