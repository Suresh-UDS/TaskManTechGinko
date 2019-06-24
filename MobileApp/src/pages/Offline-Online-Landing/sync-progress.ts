import {Component, Inject} from '@angular/core';
import {NavController,NavParams,ViewController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Network} from "@ionic-native/network";
import {OfflinePage} from "../offline-page/offline-page";
import {DashboardPage} from "../dashboard/dashboard";
import {DatabaseProvider} from "../../providers/database-provider";
import {AttendanceService} from "../service/attendanceService";
import {AssetService} from "../service/assetService";
import {componentService} from "../service/componentService";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import {JobService} from "../service/jobService";

declare  var demo ;

/**
 * Generated class for the Splash page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sync-progress',
  templateUrl: 'sync-progress.html',
})
export class SyncProgress {

    online:any;
    offline:any;
    startSync:any;
    syncMessage:any;
    syncCount:any;
    syncError:any;
    syncComplete:any;
    jobsCount:any;
    attendanceCount:any;
    errorMessages:any;
    error:any;
    jobsError:boolean;
    attendanceError:any;
    assetError:any;
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


  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen, public network:Network, private navCtrl:NavController,
              private dbProvider:DatabaseProvider, private attendanceService:AttendanceService, private assetService: AssetService, private cs:componentService, private transfer: FileTransfer, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig, private jobService: JobService) {
    this.startSync = false;
    this.syncComplete = false;
    this.jobsCount = 0;
    this.attendanceCount = 0;
    this.errorMessages = [];
    this.jobsError = false;
    this.attendanceError= false;
    this.assetError = false;
    this.error=false;

      this.dbProvider.getJobsData().then(jobs=>{
          if(jobs && jobs.length>0){
              this.jobsCount = jobs.length;
          }
          this.dbProvider.getAttendanceData().then(attendances =>{
              if(attendances && attendances.length>0)
              {
                  this.attendanceCount = attendances.length;
              }
          })
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad offline online landing');
      if(this.network.type!='none'){
          this.online = true;
          this.offline = false;

      }else{
          this.online = false;
          this.offline = true;
      }



  }

  goOffline(){
      this.navCtrl.setRoot(OfflinePage);
  }

  goOnline(){
      this.navCtrl.setRoot(DashboardPage);
  }

  syncJobData(){
      this.startSync = true;
        this.dbProvider.getJobsData().then(jobs=>{
            if(jobs && jobs.length>0){
                for(let i=0;i<jobs.length;i++){
                    console.log("Jobs to server");
                    console.log(jobs[i]);
                    var count = i+1;
                    this.syncMessage = "Pushing job "+count+" of "+jobs.length+" to server";
                    if(jobs[i].updated){
                        this.jobService.getJobDetails(jobs[i].id).subscribe(jobDetails=>{
                            console.log("Job details");
                            console.log(jobDetails);
                            jobDetails.status = jobs[i].status;
                            jobDetails.actualEndTime = jobs[i].actualEndTime;
                            jobDetails.actualHours = jobs[i].plannedStartTime - jobs[i].actualEndTime;
                            this.dbProvider.getChecklistItemsForJob(jobs[i].id).then(checklistItems=> {
                                if (checklistItems && checklistItems.length > 0) {
                                    console.log("Checklist items for job id while saving job");
                                    console.log(checklistItems);
                                    if (jobDetails && jobDetails.checklistItems && (jobDetails.checklistItems.length == checklistItems.length)){
                                        console.log("checklist items from local and server are equal");
                                        for(let j =0;j<jobDetails.checklistItems.length;j++){
                                            jobDetails.checklistItems[j].active = "Y";
                                            jobDetails.checklistItems[j].completed= checklistItems[j].completed;
                                            jobDetails.checklistItems[j].remarks= checklistItems[j].remarks;

                                            if(j+1 == checklistItems.length){
                                                this.dbProvider.getJobImages(jobs[i].id).then(jobImages=>{
                                                    console.log("Job images found");
                                                    console.log(jobImages);
                                                    console.log(jobs[i]);
                                                    this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                                        if(saveJobResponse.errorStatus){
                                                            console.log("error in saving job");
                                                            console.log(saveJobResponse);
                                                        }else{
                                                            console.log("Job Saved Successfully");
                                                            console.log(saveJobResponse);
                                                            
                                                            if(jobDetails.status =="COMPLETED"){
                                                                this.checkOutDetails.completeJob=true;
                                                            }
                                                            this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                            this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                            this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                            this.checkOutDetails.siteId = jobDetails.siteId;
                                                            this.checkOutDetails.jobId = jobDetails.id;
                                                            this.checkOutDetails.id = jobDetails.checkInOutId;
                                                            console.log("checkinout details - ");
                                                            console.log(this.checkOutDetails);
                                                            this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                                console.log("Save job images response");
                                                                console.log(saveJobImagesResponse);
                                                                if(jobImages && jobImages.length>0){

                                                                    for(let k=0; k<jobImages.length;k++){
                                                                        var employeeId = Number;
                                                                        employeeId = this.checkOutDetails.employeeId;
                                                                        let token_header = window.localStorage.getItem('session');
                                                                        let options:FileUploadOptions = {
                                                                            fileKey: 'photoOutFile',
                                                                            fileName: this.checkOutDetails.employeeId+'_photoOutFile_'+saveJobImagesResponse.transactionId,
                                                                            headers:{
                                                                                'X-Auth-Token': token_header
                                                                            },
                                                                            params:{
                                                                                employeeEmpId:this.checkOutDetails.employeeEmpId,
                                                                                employeeId: this.checkOutDetails.employeeId,
                                                                                projectId: this.checkOutDetails.projectId,
                                                                                siteId: this.checkOutDetails.siteId,
                                                                                checkInOutId: saveJobImagesResponse.transactionId,
                                                                                jobId: this.checkOutDetails.jobId,
                                                                                action: 'OUT'
                                                                            }
                                                                            
                                                                        };

                                                                        this.fileTransfer.upload(jobImages[k].image, this.config.Url+'api/employee/image/upload', options)
                                                                            .then((data) => {
                                                                                console.log(data);
                                                                                console.log("image upload");
                                                                                if(i+1==jobs.length){
                                                                                    console.log("Jobs sync completed");
                                                                                    console.log("Start Asset Attendances sync..");
                                                                                    this.syncAttendanceData();
                                                                                }
                                                                                
                                                                            }, (err) => {
                                                                                console.log(err);
                                                                                console.log("image upload fail");
                                                                                if(i+1==jobs.length){
                                                                                    console.log("Jobs sync completed");
                                                                                    console.log("Start Asset Attendances sync..");
                                                                                    this.syncAttendanceData();
                                                                                }
                                                                                
                                                                            })
                                                                    }

                                                                }else{
                                                                    console.log("Job save success no images found");
                                                                    if(i+1==jobs.length){
                                                                        console.log("Jobs sync completed");
                                                                        console.log("Start Asset Attendances sync..");
                                                                        this.syncAttendanceData();
                                                                    }
                                                                }
                                                                
                                                             })

                                                        }
                                                    },err=>{
                                                        console.log("Error in saving job");
                                                         this.jobsError = true;          
                                                         this.startSync = false;
                                                         var msg = "Error in saving job "+err;
                                                        this.errorMessages.push({msg:msg});
                                                        if(i+1==jobs.length){
                                                            console.log("Jobs sync completed");
                                                            console.log("Start Asset Attendances sync..");
                                                            // this.syncAttendanceData();
                                                        }
                                                    })

                                            },err=>{
                                                console.log("Error in getting job images");
                                                console.log(jobs[i]);
                                                this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                                    if(saveJobResponse.errorStatus){
                                                        console.log("error in saving job");
                                                        console.log(saveJobResponse);
                                                        if(i+1==jobs.length){
                                                            console.log("Jobs sync completed");
                                                            console.log("Start Asset Attendances sync..");
                                                            this.syncAttendanceData();
                                                        }
                                                    }else{
                                                        console.log("Job Saved Successfully");
                                                        console.log(saveJobResponse);
                                                        
                                                        if(jobDetails.status =="COMPLETED"){
                                                            this.checkOutDetails.completeJob=true;
                                                        }
                                                        this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                        this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                        this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                        this.checkOutDetails.siteId = jobDetails.siteId;
                                                        this.checkOutDetails.jobId = jobDetails.id;
                                                        this.checkOutDetails.id = jobDetails.checkInOutId;
                                                        console.log("checkinout details - ");
                                                        console.log(this.checkOutDetails);
                                                        this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                            console.log("Save job images response");
                                                            console.log(saveJobImagesResponse);
                                                            if(i+1==jobs.length){
                                                                console.log("Jobs sync completed");
                                                                console.log("Start Asset Attendances sync..");
                                                                this.syncAttendanceData();
                                                            }
                                                        },err=>{
                                                            if(i+1==jobs.length){
                                                                console.log("Jobs sync completed");
                                                                console.log("Start Asset Attendances sync..");
                                                                this.syncAttendanceData();
                                                            }
                                                        })
                                                    }
                                                },err=>{
                                                    console.log("Error in saving job")
                                                    if(i+1==jobs.length){
                                                        console.log("Jobs sync completed");
                                                        console.log("Start Asset Attendances sync..");
                                                        // this.syncAttendanceData();
                                                    }
                                                });
                                                
                                            });
                                            }

                                        }
                                    }else{
                                        console.log("Checklist items in local and server are not equal");
                                        this.dbProvider.getJobImages(jobs[i].id).then(jobImages=>{
                                            console.log("Job images found");
                                            console.log(jobImages);
                                            console.log(jobs[i]);
                                            this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                                if(saveJobResponse.errorStatus){
                                                    console.log("error in saving job");
                                                    console.log(saveJobResponse);
                                                }else{
                                                    console.log("Job Saved Successfully");
                                                    console.log(saveJobResponse);
                                                    
                                                    if(jobDetails.status =="COMPLETED"){
                                                        this.checkOutDetails.completeJob=true;
                                                    }
                                                    this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                    this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                    this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                    this.checkOutDetails.siteId = jobDetails.siteId;
                                                    this.checkOutDetails.jobId = jobDetails.id;
                                                    this.checkOutDetails.id = jobDetails.checkInOutId;
                                                    console.log("checkinout details - ");
                                                    console.log(this.checkOutDetails);
                                                    this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                        console.log("Save job images response");
                                                        console.log(saveJobImagesResponse);
                                                        if(jobImages && jobImages.length>0){

                                                            for(let k=0; k<jobImages.length;k++){
                                                                var employeeId = Number;
                                                                employeeId = this.checkOutDetails.employeeId;
                                                                let token_header = window.localStorage.getItem('session');
                                                                let options:FileUploadOptions = {
                                                                    fileKey: 'photoOutFile',
                                                                    fileName: this.checkOutDetails.employeeId+'_photoOutFile_'+saveJobImagesResponse.transactionId,
                                                                    headers:{
                                                                        'X-Auth-Token': token_header
                                                                    },
                                                                    params:{
                                                                        employeeEmpId:this.checkOutDetails.employeeEmpId,
                                                                        employeeId: this.checkOutDetails.employeeId,
                                                                        projectId: this.checkOutDetails.projectId,
                                                                        siteId: this.checkOutDetails.siteId,
                                                                        checkInOutId: saveJobImagesResponse.transactionId,
                                                                        jobId: this.checkOutDetails.jobId,
                                                                        action: 'OUT'
                                                                    }
                                                                    
                                                                };

                                                                this.fileTransfer.upload(jobImages[k].image, this.config.Url+'api/employee/image/upload', options)
                                                                    .then((data) => {
                                                                        console.log(data);
                                                                        console.log("image upload");
                                                                        if(i+1==jobs.length){
                                                                            console.log("Jobs sync completed");
                                                                            console.log("Start Asset Attendances sync..");
                                                                            this.syncAttendanceData();
                                                                        }
                                                                        
                                                                    }, (err) => {
                                                                        console.log(err);
                                                                        console.log("image upload fail");
                                                                        if(i+1==jobs.length){
                                                                            console.log("Jobs sync completed");
                                                                            console.log("Start Asset Attendances sync..");
                                                                            this.syncAttendanceData();
                                                                        }
                                                                        
                                                                    })
                                                            }

                                                        }else{
                                                            console.log("Job save success no images found");
                                                            if(i+1==jobs.length){
                                                                console.log("Jobs sync completed");
                                                                console.log("Start Asset Attendances sync..");
                                                                this.syncAttendanceData();
                                                            }
                                                        }
                                                        
                                                     })

                                                }
                                            },err=>{
                                                console.log("Error in saving job");
                                                    this.jobsError = true; 
                                                    this.startSync = false; 
                                                    var msg = "Error in saving job "+err;
                                                this.errorMessages.push({msg:msg});
                                                if(i+1==jobs.length){
                                                    console.log("Jobs sync completed");
                                                    console.log("Start Asset Attendances sync..");
                                                    // this.syncAttendanceData();
                                                }
                                            })
                                            


                                            },err=>{
                                                console.log("Error in getting job images");
                                                console.log(jobs[i]);
                                                this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                                    if(saveJobResponse.errorStatus){
                                                        console.log("error in saving job");
                                                        console.log(saveJobResponse);
                                                    }else{
                                                        console.log("Job Saved Successfully");
                                                        console.log(saveJobResponse);
                                                        
                                                        if(jobDetails.status =="COMPLETED"){
                                                            this.checkOutDetails.completeJob=true;
                                                        }
                                                        this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                        this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                        this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                        this.checkOutDetails.siteId = jobDetails.siteId;
                                                        this.checkOutDetails.jobId = jobDetails.id;
                                                        this.checkOutDetails.id = jobDetails.checkInOutId;
                                                        console.log("checkinout details - ");
                                                        console.log(this.checkOutDetails);
                                                        this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                            console.log("Save job images response");
                                                            console.log(saveJobImagesResponse);
                                                            if(i+1==jobs.length){
                                                                console.log("Jobs sync completed");
                                                                console.log("Start Asset Attendances sync..");
                                                                this.syncAttendanceData();
                                                            }
                                                        },err=>{
                                                            if(i+1==jobs.length){
                                                                console.log("Jobs sync completed");
                                                                console.log("Start Asset Attendances sync..");
                                                                this.syncAttendanceData();
                                                            }
                                                        })
                                                    }
                                                },err=>{
                                                    console.log("Error in saving job");
                                                    this.jobsError = true;
                                                    this.startSync = false;
                                                    var msg = "Error in saving job "+err;
                                                    this.errorMessages.push({msg:msg});
                                                    if(i+1==jobs.length){
                                                        console.log("Jobs sync completed");
                                                        console.log("Start Asset Attendances sync..");
                                                        // this.syncAttendanceData();
                                                    }
                                                });
                                                
                                        });

                                    }
                                }else{
                                    console.log("No checklist items found");
                                    this.dbProvider.getJobImages(jobs[i].id).then(jobImages=>{
                                        console.log("Job images found");
                                        console.log(jobImages);
                                        console.log(jobs[i]);
                                        this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                            if(saveJobResponse.errorStatus){
                                                console.log("error in saving job");
                                                console.log(saveJobResponse);
                                            }else{
                                                console.log("Job Saved Successfully");
                                                console.log(saveJobResponse);
                                                
                                                if(jobDetails.status =="COMPLETED"){
                                                    this.checkOutDetails.completeJob=true;
                                                }
                                                this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                this.checkOutDetails.siteId = jobDetails.siteId;
                                                this.checkOutDetails.jobId = jobDetails.id;
                                                this.checkOutDetails.id = jobDetails.checkInOutId;
                                                console.log("checkinout details - ");
                                                console.log(this.checkOutDetails);
                                                this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                    console.log("Save job images response");
                                                    console.log(saveJobImagesResponse);
                                                    if(jobImages && jobImages.length>0){

                                                        for(let k=0; k<jobImages.length;k++){
                                                            var employeeId = Number;
                                                            employeeId = this.checkOutDetails.employeeId;
                                                            let token_header = window.localStorage.getItem('session');
                                                            let options:FileUploadOptions = {
                                                                fileKey: 'photoOutFile',
                                                                fileName: this.checkOutDetails.employeeId+'_photoOutFile_'+saveJobImagesResponse.transactionId,
                                                                headers:{
                                                                    'X-Auth-Token': token_header
                                                                },
                                                                params:{
                                                                    employeeEmpId:this.checkOutDetails.employeeEmpId,
                                                                    employeeId: this.checkOutDetails.employeeId,
                                                                    projectId: this.checkOutDetails.projectId,
                                                                    siteId: this.checkOutDetails.siteId,
                                                                    checkInOutId: saveJobImagesResponse.transactionId,
                                                                    jobId: this.checkOutDetails.jobId,
                                                                    action: 'OUT'
                                                                }
                                                                
                                                            };

                                                            this.fileTransfer.upload(jobImages[k].image, this.config.Url+'api/employee/image/upload', options)
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    console.log("image upload");
                                                                    if(i+1==jobs.length){
                                                                        console.log("Jobs sync completed");
                                                                        console.log("Start Asset Attendances sync..");
                                                                        this.syncAttendanceData();
                                                                    }
                                                                    
                                                                }, (err) => {
                                                                    console.log(err);
                                                                    console.log("image upload fail");
                                                                    if(i+1==jobs.length){
                                                                        console.log("Jobs sync completed");
                                                                        console.log("Start Asset Attendances sync..");
                                                                        this.syncAttendanceData();
                                                                    }
                                                                    
                                                                })
                                                        }

                                                    }else{
                                                        console.log("Job save success no images found");
                                                        if(i+1==jobs.length){
                                                            console.log("Jobs sync completed");
                                                            console.log("Start Asset Attendances sync..");
                                                            this.syncAttendanceData();
                                                        }
                                                    }
                                                    
                                                 })

                                            }
                                        })
                                        


                                    },err=>{
                                        console.log("Error in getting job images");
                                        console.log(jobs[i]);
                                        this.jobService.saveJob(jobDetails).subscribe(saveJobResponse=>{
                                            if(saveJobResponse.errorStatus){
                                                console.log("error in saving job");
                                                console.log(saveJobResponse);
                                            }else{
                                                console.log("Job Saved Successfully");
                                                console.log(saveJobResponse);
                                                
                                                if(jobDetails.status =="COMPLETED"){
                                                    this.checkOutDetails.completeJob=true;
                                                }
                                                this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                                                this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                                                this.checkOutDetails.projectId = jobDetails.siteProjectId;
                                                this.checkOutDetails.siteId = jobDetails.siteId;
                                                this.checkOutDetails.jobId = jobDetails.id;
                                                this.checkOutDetails.id = jobDetails.checkInOutId;
                                                console.log("checkinout details - ");
                                                console.log(this.checkOutDetails);
                                                this.jobService.updateJobImages(this.checkOutDetails).subscribe(saveJobImagesResponse=>{
                                                    console.log("Save job images response");
                                                    console.log(saveJobImagesResponse);
                                                    if(i+1==jobs.length){
                                                        console.log("Jobs sync completed");
                                                        console.log("Start Asset Attendances sync..");
                                                        this.syncAttendanceData();
                                                    }
                                                },err=>{
                                                    if(i+1==jobs.length){
                                                        console.log("Jobs sync completed");
                                                        console.log("Start Asset Attendances sync..");
                                                        this.syncAttendanceData();
                                                    }
                                                })
                                            }
                                        });
                                        
                                    });

                                    }
                                });


                        });
                    }else{
                        console.log("No job updates found in local");
                        this.syncMessage = "No Jobs data found";
                        console.log("No jobs data found..");
                        console.log("Start Attendance sync...");
                        // setTimeout(()=>{
                        //     this.syncAttendanceData();
                        // },2000);
                        if(i+1==jobs.length){
                            console.log("Jobs sync completed");
                            console.log("Start Asset Attendances sync..");
                            this.syncAttendanceData();
                        }
                    }

                }
            }else{
                this.syncMessage = "No Jobs data found";
                console.log("No jobs data found..");
                console.log("Start Attendance sync...");
                setTimeout(()=>{
                    this.syncAttendanceData();
                },2000);

            }
        },err=>{
            // this.jobsError = true;
            // this.errorMessages.push("Error in getting jobs from local");
            console.log("Error in getting jobs data");
            console.log("Start attendance sync...");
            this.syncAttendanceData();

        })

  }



  syncAttendanceData(){
      this.jobsError = false;
    //   this.error
      this.dbProvider.getAttendanceCheckInData().then(attendances=>{
          if(attendances && attendances.length>0){
              for(let i =0; i<attendances.length;i++){
                  var count = i+1;
                  console.log("Attendance details to server");
                  console.log(i);
                  console.log(attendances.length);
                  console.log(attendances[i]);
                  this.syncMessage = "Pushing attendance "+count+" of "+attendances.length+" to server";
                  if(attendances[i].checkInTime!=null){
                      console.log("Checkin time not null");
                      this.attendanceService.markAttendanceCheckIn(attendances[i].siteId, attendances[i].empId, 0.0,0.0,attendances[i].checkInImage, new Date(attendances[i].checkInTime),true).subscribe(checkInResponse=>{
                          console.log("Attendance check in successful");
                          console.log(checkInResponse);
                          if(checkInResponse.errorStatus){
                              var message = checkInResponse.errorMessage+" for employee - "+attendances[i].employeeId;
                              this.errorMessages.push({msg:message});
                              this.error = true;
                              this.startSync = false;
                              this.attendanceError = true;
                              this.jobsError = false;
                              this.assetError = false;
                          }else {
                              console.log("Successfully synced data to server");
                              if (i + 1 == attendances.length) {
                                  this.dbProvider.updateAttendanceCheckOutData(checkInResponse.employeeId,checkInResponse.siteId,checkInResponse.id).then(response=>{
                                      console.log("Attendance Id successfully updated to checkout table SQLite");
                                      console.log(response);
                                      this.syncAttendanceCheckOutData();
                                  },err=>{
                                      console.log("Error in updating attendance id to checkout table");
                                      console.log(err);
                                  })
                              }else{
                                  //Update checkout table with attendance Id
                                  this.dbProvider.updateAttendanceCheckOutData(checkInResponse.employeeId,checkInResponse.siteId,checkInResponse.id).then(response=>{
                                      console.log("Attendance Id successfully updated to checkout table SQLite");
                                      console.log(response);
                                  },err=>{
                                      console.log("Error in updating attendance id to checkout table");
                                      console.log(err);
                                  })
                              }
                          }
                      });

                  }
              }
          }else{
              this.syncMessage = "No Attendance data found...";
              console.log("No attendance data found..");
              console.log("Start syncing asset data");
              this.syncAttendanceCheckOutData();
          }
      })

  }

  syncAttendanceCheckOutData(){
        this.dbProvider.getAttendanceCheckOutData().then(attendances=>{
            if(attendances && attendances.length>0){
                for(let i =0; i<attendances.length;i++){
                    var count = i+1;
                    console.log("Attendance details to server");
                    console.log(attendances[i]);
                    this.syncMessage = "Pushing attendance "+count+" of "+attendances.length+" to server";
                    if(attendances[i].attendanceId!=null && attendances[i].attendanceId>0){
                        console.log("Checkin time not null");
                        this.attendanceService.markAttendanceCheckOut(attendances[i].siteId, attendances[i].empId, 0.0,0.0,attendances[i].checkOutImage,attendances[i].attendanceId, new Date(attendances[i].checkOutTime),true).subscribe(checkOutResponse=>{
                            console.log("Attendance check out successful");
                            console.log(checkOutResponse);
                            if(checkOutResponse.errorStatus){
                                var message = checkOutResponse.errorMessage+" for employee - "+attendances[i].employeeId;
                                this.errorMessages.push({msg:message});
                                this.error = true;
                                this.startSync = false;
                                this.attendanceError = true;
                                this.jobsError = false;
                                this.assetError = false;
                            }else {
                                console.log("Successfully synced data to server");
                                if (i + 1 == attendances.length) {
                                    this.syncAssetData();
                                }
                            }
                        });

                    }else{
                        console.log("Attendance id not available, so cannot checkout, so skipping attendance sync");
                        this.syncAssetData();
                    }
                }
            }else{
                this.syncMessage = "No Attendance data found...";
                console.log("No attendance data found..");
                console.log("Start syncing asset data");
                this.syncAssetData();
            }
        })

    }

  syncAssetData(){
      this.dbProvider.getAssetData().then(assets=>{
          if(assets && assets.length>0){
                for(let i=0; i<assets.length;i++){
                    console.log(assets);
                    this.dbProvider.getAssetReadings(assets[i].id).then(readings=>{
                        console.log(readings);
                        if(readings && readings.length>0){
                            for(let j=0;j<readings.length;j++)
                            {
                                this.assetService.saveReading({name:readings[j].name,uom:readings[j].uom,initialValue:readings[j].initialValue,finalValue:readings[j].finalValue,consumption:readings[j].consumption,assetId:readings[j].assetId,assetParameterConfigId:readings[j].assetParameterConfigId}).subscribe(
                                    response => {
                                        if(response.errorStatus){
                                            var message = response.errorMessage+" for Asset ";
                                            this.errorMessages.push({msg:message});
                                            this.error = true;
                                            this.startSync = false;
                                            this.jobsError = false;
                                            this.attendanceError =false;
                                            this.assetError = true;
                                            this.createTablesAndSyncData();

                                        }else{
                                            console.log("save reading sync to server");
                                            console.log(response);
                                            this.createTablesAndSyncData();

                                        }

                                    },
                                    error => {
                                        console.log("save readings error sync to server");
                                        var message = "Error in syncing asset";
                                        this.errorMessages.push({msg:message});
                                        this.error = true;
                                        this.startSync = false;
                                        this.jobsError = false;
                                        this.attendanceError =false;
                                        this.assetError = true;
                                        this.createTablesAndSyncData();

                                    })
                            }
                        }else{
                            this.syncMessage = "No Asset reading data found...";
                            console.log("No Asset reading data found..");
                            console.log("Drop db and start syncing new data");
                            this.createTablesAndSyncData();
                        }
                    })
                }
          }else{
              this.syncMessage = "No Asset data found...";
              console.log("No Asset data found..");
              console.log("Drop db and start syncing new data");
              this.createTablesAndSyncData();
          }

      },err=>{
          this.syncMessage = "No Asset data found...";
          console.log("No Asset data found..");
          console.log("Drop db and start syncing new data");
          this.createTablesAndSyncData();
      })
  }

  getJobsCoutn(){
      this.dbProvider.getJobsData().then(jobs=> {
          if (jobs && jobs.length > 0) {
              this.jobsCount = jobs.length;
          }
      })
  }

  createTablesAndSyncData(){
        this.syncMessage = "Cleaning Database...";
        this.dbProvider.dropAllTables().then(data=>{
            if(data){
                console.log("Database sucessfully dropped");
                this.syncMessage = "Database successfully cleaned...";
                this.dbProvider.createDb().then(data=>{

                    this.dbProvider.createSiteTable().then(data=>{
                        this.syncMessage = "Site Table successfully Created...";
                        this.dbProvider.createEmployeeTable().then(data=>{
                            this.syncMessage = "Employee Table successfully Created...";
                            this.dbProvider.addSites();
                            this.dbProvider.createAttendanceCheckInTable().then(data=>{
                                this.syncMessage = "Attendance Check In  Table successfully Created...";
                                this.dbProvider.createAttendanceCheckOutTable().then(data=>{
                                    this.syncMessage = "Attendance Check Out Table successfully Created...";
                                },err=>{
                                    console.log(err);
                                    this.syncMessage = "Error in creating attendance table..";
                                    this.startSync = false;
                                    this.syncError = true;
                                });
                            },err=>{
                                console.log(err);
                                this.syncMessage = "Error in creating attendance table..";
                                this.startSync = false;
                                this.syncError = true;
                            });
                        },err=>{
                            console.log(err);
                            this.syncMessage = "Error in creating Employee table..";
                            this.startSync = false;
                            this.syncError = true;
                        });
                    },err=>{
                        console.log(err);
                        this.syncMessage = "Error in creating site table..";
                        this.startSync = false;
                        this.syncError = true;
                    });

                    this.dbProvider.createJobsTable().then(data=>{
                        this.syncMessage = "Jobs Table successfully Created...";
                        this.dbProvider.createCheckListTable().then(data=>{
                            this.syncMessage = "Checklist Table successfully Created...";
                            this.dbProvider.addJobs();
                        },err=>{
                            console.log(err);
                            this.syncMessage = "Error in creating Checklist table..";
                            this.startSync = false;
                            this.syncError = true;
                        });
                    },err=>{
                        console.log(err);
                        this.syncMessage = "Error in creating Jobs table..";
                        this.startSync = false;
                        this.syncError = true;
                    });

                    this.dbProvider.createAssetTable().then(data=>{
                        this.syncMessage = "Asset Table successfully Created...";
                        this.dbProvider.createConfigTable().then(data=>{
                            this.syncMessage = "Asset Parameter config Table successfully Created...";
                            this.dbProvider.createAMC().then(data=>{
                                this.syncMessage = "Asset AMC Table successfully Created...";
                                this.dbProvider.createPPM().then(data=>{
                                    this.syncMessage = "Asset PPM Table successfully Created...";
                                    this.dbProvider.createReadingsTable().then(data=>{
                                        this.syncMessage = "Asset Readings tables successfully created...";
                                        this.dbProvider.createJobImage().then(data=>{
                                            // this.dbProvider.addAssetData();
                                            let assetSearchCriteria={
                                                list:true
                                            };
                                            this.assetService.searchAssets(assetSearchCriteria).subscribe(data=>{
                                                console.log("Asset data");
                                                console.log(data);
                                                let assetList = data.transactions;
                                                if(assetList && assetList.length>0) {
                                                    for(let i=0;i<assetList.length;i++){
                                                        console.log("Asset count");
                                                        console.log(i);
                                                        console.log(assetList.length);
                                                        this.dbProvider.insertAssetData(assetList[i].id, assetList[i].active, assetList[i].title, assetList[i].code, assetList[i].assetType, assetList[i].assetGroup, assetList[i].siteId, assetList[i].siteName,assetList[i].block,assetList[i].floor,assetList[i].zone,assetList[i].manufacturerName,assetList[i].modelNumber,assetList[i].serialNumber,assetList[i].acquiredDate,assetList[i].purchasePrice,assetList[i].curentPrice,assetList[i].estimatedDisposePrice).then(data=>{
                                                            console.log("Asset data added to SQLite");
                                                            this.dbProvider.getAssetConfigData(assetList[i].assetType,assetList[i].id).then(data=>{
                                                                console.log("Asset config data count for asset id - "+assetList[i].id);
                                                                console.log(data);
                                                                if(data && data.length>0){
                                                                    this.dbProvider.deleteAssetConfigData(assetList[i].assetType,assetList[i].id).then(response=>{
                                                                        this.assetService.getAssetConfig(assetList[i].assetType,assetList[i].id).subscribe(
                                                                            response=>{
                                                                                console.log("Get asset config");
                                                                                console.log(response);
                                                                                if(response && response.length>0){
                                                                                    for (var j=0;j<response.length;j++){
                                                                                        this.dbProvider.insertAssetConfigData(response[j].assetId,response[j].assetTitle,response[j].assetType, response[j].consumptionMonitoringRequired, response[j].max,response[j].min,response[j].name,response[j].rule,response[j].status,response[j].threshold, response[j].uom, response[j].userId, response[j].validationRequired);
                                                                                    }
                                                                                }
                                                                            },err=>{
                                                                                console.log("Error in inserting asset config data");
                                                                                console.log(err);

                                                                        })
                                                                    },err=>{
                                                                        this.assetService.getAssetConfig(assetList[i].assetType,assetList[i].id).subscribe(
                                                                            response=>{
                                                                                console.log("Get asset config");
                                                                                console.log(response);
                                                                                if( response && response.length>0){
                                                                                    for (var j=0;j<response.length;j++){
                                                                                        this.dbProvider.insertAssetConfigData(response[j].assetId,response[j].assetTitle,response[j].assetType, response[j].consumptionMonitoringRequired, response[j].max,response[j].min,response[j].name,response[j].rule,response[j].status,response[j].threshold, response[j].uom, response[j].userId, response[j].validationRequired);
                                                                                    }
                                                                                }
                                                                            },err=>{
                                                                                console.log("Error in inserting asset config data");
                                                                                console.log(err);

                                                                        })
                                                                    })
                                                                }else{
                                                                    this.assetService.getAssetConfig(assetList[i].assetType,assetList[i].id).subscribe(
                                                                        response=>{
                                                                            console.log("Get asset config");
                                                                            console.log(response);
                                                                            if(response && response.length>0){
                                                                                for (var j=0;j<response.length;j++){
                                                                                    this.dbProvider.insertAssetConfigData(response[j].assetId,response[j].assetTitle,response[j].assetType, response[j].consumptionMonitoringRequired, response[j].max,response[j].min,response[j].name,response[j].rule,response[j].status,response[j].threshold, response[j].uom, response[j].userId, response[j].validationRequired);
                                                                                }
                                                                            }
                                                                        },err=>{
                                                                            console.log("Error in inserting asset config data");
                                                                            console.log(err);

                                                                    })
                                                                }
                                                            },err=>{
                                                                console.log("Error in getting asset config data");
                                                                console.log(err);
                                                                this.dbProvider.addAssetConfig(assetList[i].assetType,assetList[i].id);
                                                            });

                                                            this.dbProvider.getAssetAMC(assetList[i].id).then(data=>{
                                                                console.log("Asset amc data count for asset id - "+assetList[i].id);
                                                                console.log(data);
                                                                if(data && data.length>0){
                                                                    this.dbProvider.deleteAssetAMCData(assetList[i].id).then(response=>{
                                                                        this.assetService.getAssetAMCSchedule(assetList[i].id).subscribe(response=>{
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
                                                                                        this.dbProvider.insertAssetAMC(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate).then(response=>{
                                                                                            console.log("Data inserted");
                                                                                        },err=>{
                                                                                            console.log("error in inserting data");
                                                                                            console.log(err);
                                                                                        });
                                                                                    }
                                                                                }
                                                                            }



                                                                        })
                                                                    },err=>{
                                                                        this.assetService.getAssetAMCSchedule(assetList[i].id).subscribe(response=>{
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
                                                                                        this.dbProvider.insertAssetAMC(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate).then(response=>{
                                                                                            console.log("Data inserted");
                                                                                        },err=>{
                                                                                            console.log("error in inserting data");
                                                                                            console.log(err);
                                                                                        });
                                                                                    }
                                                                                }
                                                                            }



                                                                        })
                                                                    })

                                                                }else{
                                                                    this.assetService.getAssetAMCSchedule(assetList[i].id).subscribe(response=>{
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
                                                                                    this.dbProvider.insertAssetAMC(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate).then(response=>{
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
                                                            },err=>{
                                                                console.log("Error in getting asset amc data");
                                                                console.log(err);
                                                                this.assetService.getAssetAMCSchedule(assetList[i].id).subscribe(response=>{
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
                                                                                this.dbProvider.insertAssetAMC(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate).then(response=>{
                                                                                    console.log("Data inserted");
                                                                                },err=>{
                                                                                    console.log("error in inserting data");
                                                                                    console.log(err);
                                                                                });
                                                                            }
                                                                        }
                                                                    }



                                                                })

                                                            });

                                                            this.dbProvider.getAssetPPM(assetList[i].id).then(data=>{
                                                                console.log("Asset PPM data count for asset id - "+assetList[i].id);
                                                                console.log(data);
                                                                if(data && data.length>0){
                                                                    this.dbProvider.deleteAssetPPMData(assetList[i].id).then(response=>{
                                                                        this.assetService.getAssetPPMSchedule(assetList[i].id).subscribe(response=>{
                                                                            console.log("Asset ppm schedule details");
                                                                            console.log(response);
                                                                            if(response && response.errorStatus){
                                                                                console.log("Error in getting asset ppm schedule");
                                                                                console.log(response.errorMessage);
                                                                            }else{
                                                                                if(response && response.length>0){
                                                                                    for(let i=0; i<response.length;i++){
                                                                                        this.dbProvider.insertAssetPPM(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate);
                                                                                    }
                                                                                }
                                                                            }
                                                                        },err=>{
                                                                            console.log("Error in getting Asset ppm jobs");
                                                                            console.log(err);
                                                                        })
                                                                    },err=>{
                                                                        this.assetService.getAssetPPMSchedule(assetList[i].id).subscribe(response=>{
                                                                            console.log("Asset ppm schedule details");
                                                                            console.log(response);
                                                                            if(response && response.errorStatus){
                                                                                console.log("Error in getting asset ppm schedule");
                                                                                console.log(response.errorMessage);
                                                                            }else{
                                                                                if(response && response.length>0){
                                                                                    for(let i=0; i<response.length;i++){
                                                                                        this.dbProvider.insertAssetPPM(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate);
                                                                                    }
                                                                                }
                                                                            }
                                                                        },err=>{
                                                                            console.log("Error in getting Asset ppm jobs");
                                                                            console.log(err);
                                                                        })                                                                    })
                                                                }else{
                                                                    this.assetService.getAssetPPMSchedule(assetList[i].id).subscribe(response=>{
                                                                        console.log("Asset ppm schedule details");
                                                                        console.log(response);
                                                                        if(response && response.errorStatus){
                                                                            console.log("Error in getting asset ppm schedule");
                                                                            console.log(response.errorMessage);
                                                                        }else{
                                                                            if(response && response.length>0){
                                                                                for(let i=0; i<response.length;i++){
                                                                                    this.dbProvider.insertAssetPPM(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate);
                                                                                }
                                                                            }
                                                                        }
                                                                    },err=>{
                                                                        console.log("Error in getting Asset ppm jobs");
                                                                        console.log(err);
                                                                    })                                                                }
                                                            },err=>{
                                                                console.log("Error in getting asset PPM data");
                                                                console.log(err);
                                                                this.assetService.getAssetPPMSchedule(assetList[i].id).subscribe(response=>{
                                                                    console.log("Asset ppm schedule details");
                                                                    console.log(response);
                                                                    if(response && response.errorStatus){
                                                                        console.log("Error in getting asset ppm schedule");
                                                                        console.log(response.errorMessage);
                                                                    }else{
                                                                        if(response && response.length>0){
                                                                            for(let i=0; i<response.length;i++){
                                                                                this.dbProvider.insertAssetPPM(response[i].id, response[i].title, response[i].status, response[i].frequency, response[i].frequencyPrefix, response[i].assetId, response[i].startDate,  response[i].endDate);
                                                                            }
                                                                        }
                                                                    }
                                                                },err=>{
                                                                    console.log("Error in getting Asset ppm jobs");
                                                                    console.log(err);
                                                                })
                                                            });

                                                            this.dbProvider.getAssetReadings(assetList[i].id).then(data=>{
                                                                if(data && data.length>0){
                                                                    this.dbProvider.deleteAssetReadings(assetList[i].id).then(response=>{
                                                                        var searchCriteria = {assetId: assetList[i].id};
                                                                        this.assetService.viewReading(searchCriteria).subscribe(
                                                                            response=>{
                                                                                console.log("asset reading");
                                                                                console.log(response);
                                                                                let readings = response.transactions;
                                                                                if(readings && readings.length>0){
                                                                                    for(let i=0;i<readings.length;i++){
                                                                                        this.dbProvider.insertAssetReading(readings[i].id,readings[i].name,readings[i].uom,readings[i].initialValue,readings[i].initialReadingTime, readings[i].finalValue, readings[i].finalReadingTime, readings[i].consumption, readings[i].assetId, readings[i].assetParameterConfigId,readings[i].consumptionMonitoringRequired, readings[i].assetType );

                                                                                    }
                                                                                }
                                                                            },err=>{
                                                                                console.log("Error in getting asset reading");
                                                                                console.log(err);
                                                                            }
                                                                        )
                                                                    },err=>{
                                                                        var searchCriteria = {assetId: assetList[i].id};
                                                                        this.assetService.viewReading(searchCriteria).subscribe(
                                                                            response=>{
                                                                                console.log("asset reading");
                                                                                console.log(response);
                                                                                let readings = response.transactions;
                                                                                if(readings && readings.length>0){
                                                                                    for(let i=0;i<readings.length;i++){
                                                                                        this.dbProvider.insertAssetReading(readings[i].id,readings[i].name,readings[i].uom,readings[i].initialValue,readings[i].initialReadingTime, readings[i].finalValue, readings[i].finalReadingTime, readings[i].consumption, readings[i].assetId, readings[i].assetParameterConfigId,readings[i].consumptionMonitoringRequired, readings[i].assetType );

                                                                                    }
                                                                                }
                                                                            },err=>{
                                                                                console.log("Error in getting asset reading");
                                                                                console.log(err);
                                                                            }
                                                                        )
                                                                    })
                                                                }else{
                                                                    var searchCriteria = {assetId: assetList[i].id};
                                                                    this.assetService.viewReading(searchCriteria).subscribe(
                                                                        response=>{
                                                                            console.log("asset reading");
                                                                            console.log(response);
                                                                            let readings = response.transactions;
                                                                            if(readings && readings.length>0){
                                                                                for(let i=0;i<readings.length;i++){
                                                                                    this.dbProvider.insertAssetReading(readings[i].id,readings[i].name,readings[i].uom,readings[i].initialValue,readings[i].initialReadingTime, readings[i].finalValue, readings[i].finalReadingTime, readings[i].consumption, readings[i].assetId, readings[i].assetParameterConfigId,readings[i].consumptionMonitoringRequired, readings[i].assetType );

                                                                                }
                                                                            }
                                                                        },err=>{
                                                                            console.log("Error in getting asset reading");
                                                                            console.log(err);
                                                                        }
                                                                    )
                                                                }
                                                            },err=>{
                                                                var searchCriteria = {assetId: assetList[i].id};
                                                                this.assetService.viewReading(searchCriteria).subscribe(
                                                                    response=>{
                                                                        console.log("asset reading");
                                                                        console.log(response);
                                                                        let readings = response.transactions;
                                                                        if(readings && readings.length>0){
                                                                            for(let i=0;i<readings.length;i++){
                                                                                this.dbProvider.insertAssetReading(readings[i].id,readings[i].name,readings[i].uom,readings[i].initialValue,readings[i].initialReadingTime, readings[i].finalValue, readings[i].finalReadingTime, readings[i].consumption, readings[i].assetId, readings[i].assetParameterConfigId,readings[i].consumptionMonitoringRequired, readings[i].assetType );

                                                                            }
                                                                        }
                                                                    },err=>{
                                                                        console.log("Error in getting asset reading");
                                                                        console.log(err);
                                                                    }
                                                                )
                                                            })

                                                        },err=>{
                                                            console.log("Error in adding asset data to SQLite");
                                                            console.log(err);

                                                        });

                                                        if(i+1==assetList.length){
                                                            console.log("All assets synced");
                                                            this.startSync=false;
                                                            this.syncError=false;
                                                            this.error = false;
                                                            this.errorMessages = [];
                                                            this.syncComplete = true;
                                                        }else{
                                                            console.log("Assets loading");
                                                            this.syncMessage = "Loading Asset - "+i+" of assets "+assetList.length;
                                                        }
                                                    }
                                                }else{
                                                    console.log("Assets not found");
                                                    this.startSync=false;
                                                    this.syncError=false;
                                                    this.error = false;
                                                    this.errorMessages = [];
                                                    this.syncComplete = true;
                                                }
                                            },err=>{
                                                console.log("error in searching assets");
                                                console.log(err);
                                                this.startSync=false;
                                                this.syncError=false;
                                                this.error = false;
                                                this.errorMessages = [];
                                                this.syncComplete = true;
                                            });

                                        })
                                    },err=>{
                                        console.log(err);
                                        this.syncMessage = "Error in creating Asset Readings table..";
                                        this.startSync = false;
                                        this.syncError = true;
                                    })

                                },err=>{
                                    console.log(err);
                                    this.syncMessage = "Error in creating Asset PPM table..";
                                    this.startSync = false;
                                    this.syncError = true;
                                });
                            },err=>{
                                console.log(err);
                                this.syncMessage = "Error in creating Asset AMC table..";
                                this.startSync = false;
                                this.syncError = true;
                            });
                        },err=>{
                            console.log(err);
                            this.syncMessage = "Error in creating Asset parameter config table..";
                            this.startSync = false;
                            this.syncError = true;
                        });
                    },err=>{
                        console.log(err);
                        this.syncMessage = "Error in creating Asset table..";
                        this.startSync = false;
                        this.syncError = true;
                    });

                },err=>{

                    this.syncMessage = "Error in Creating Database Please try again later";
                    this.startSync = false;
                    this.syncError = true;
                });

            }else{
                this.syncMessage = "Error in cleaning Database Please try again later";
                this.startSync = false;
                this.syncError = true;
            }
        },err=>{
            this.syncMessage = "Error in cleaning Database Please try again later";
            this.startSync = false;
            this.syncError = true;
        });
    }

  saveJob(job,takenImages){
        this.cs.showLoader('Saving Job');
        console.log(job);
        let checkOutDetails: any;
        return this.jobService.saveJob(job).subscribe(
            response=>{
                if(response.errorStatus){
                    this.cs.closeAll();
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                    return response;
                }else{
                    console.log("Save Job response");
                    // this.component.closeLoader();
                    this.cs.showToastMessage('Job Saved Successfully','bottom');
                    console.log(response);
                    console.log(job.checkInOutId);
                    console.log("takenimages length",takenImages.length);
                    if(takenImages.length>0){
                        this.cs.showLoader('Uploading Images');
                        checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                        checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                        checkOutDetails.projectId =job.siteProjectId;
                        checkOutDetails.siteId = job.siteId;
                        checkOutDetails.jobId = job.id;
                        checkOutDetails.id=job.checkInOutId;
                        console.log("checkoutDetails",checkOutDetails);
                        this.jobService.updateJobImages(checkOutDetails).subscribe(
                            response=>{
                                // this.component.closeLoader();
                                console.log("complete job response");
                                console.log(response);
                                console.log(job);
                                // this.component.showToastMessage('Job Completed Successfully','bottom');
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
                                    console.log(checkOutDetails.employeeId);
                                    console.log(checkOutDetails.employeeEmpId);
                                    console.log(checkOutDetails.projectId);
                                    console.log(checkOutDetails.siteId);
                                    console.log(checkOutDetails.jobId);
                                    var employeeId=Number;
                                    console.log(typeof employeeId);
                                    employeeId=checkOutDetails.employeeId;
                                    console.log(typeof employeeId);
                                    console.log(employeeId);
                                    let token_header=window.localStorage.getItem('session');
                                    let options: FileUploadOptions = {
                                        fileKey: 'photoOutFile',
                                        fileName:checkOutDetails.employeeId+'_photoOutFile_'+response.transactionId,
                                        headers:{
                                            'X-Auth-Token':token_header
                                        },
                                        params:{
                                            employeeEmpId: checkOutDetails.employeeEmpId,
                                            employeeId: checkOutDetails.employeeId,
                                            projectId:checkOutDetails.projectId,
                                            siteId:checkOutDetails.siteId,
                                            checkInOutId:response.transactionId,
                                            jobId:checkOutDetails.jobId,
                                            action:"OUT"
                                        }
                                    };

                                    this.fileTransfer.upload(takenImages[i], this.config.Url+'api/employee/image/upload', options)
                                        .then((data) => {
                                            this.cs.closeAll();
                                            console.log(data);
                                            console.log("image upload");
                                        }, (err) => {
                                            this.cs.closeAll();
                                            console.log(err);
                                            console.log("image upload fail");
                                        })

                                }

                            },err=>{
                                this.cs.closeLoader();
                                // this.navCtrl.pop();
                            }
                        )
                    }else{
                        this.cs.closeAll();
                    }
                }
            }
            ,err=>{
                console.log("Error in saving response");
                console.log(err);
                this.cs.closeLoader();
                this.cs.showToastMessage('Error in saving job, please try again...','bottom');
            }
        )
    }

  completeJob(job, takenImages){
        this.cs.showLoader('Completing Job');
        console.log("getJobs",job);
        console.log("getImages",takenImages);
        let checkOutDetails:any;
        this.jobService.saveJob(job).subscribe(
            response=>{
                console.log("get jobs",job);
                checkOutDetails.completeJob=true;
                checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                checkOutDetails.projectId =job.siteProjectId;
                checkOutDetails.siteId = job.siteId;
                checkOutDetails.jobId = job.id;
                // this.checkOutDetails.latitudeOut = this.latitude;
                // this.checkOutDetails.longitude = this.longitude;
                checkOutDetails.id=job.checkInOutId;
                this.jobService.updateJobImages(checkOutDetails).subscribe(
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
                                console.log(checkOutDetails.employeeId);
                                console.log(checkOutDetails.employeeEmpId);
                                console.log(checkOutDetails.projectId);
                                console.log(checkOutDetails.siteId);
                                console.log(checkOutDetails.jobId);
                                var employeeId=Number;
                                console.log(typeof employeeId);
                                employeeId=checkOutDetails.employeeId;
                                let token_header=window.localStorage.getItem('session');
                                let options: FileUploadOptions = {
                                    fileKey: 'photoOutFile',
                                    fileName:checkOutDetails.employeeId+'_photoOutFile_'+response.transactionId,
                                    headers:{
                                        'X-Auth-Token':token_header
                                    },
                                    params:{
                                        employeeEmpId: checkOutDetails.employeeEmpId,
                                        employeeId: checkOutDetails.employeeId,
                                        projectId:checkOutDetails.projectId,
                                        siteId:checkOutDetails.siteId,
                                        checkInOutId:response.transactionId,
                                        jobId:checkOutDetails.jobId,
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
        this.cs.closeLoader();

    }


}
