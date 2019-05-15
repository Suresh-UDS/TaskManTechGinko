
import { Component, Inject } from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {componentService} from "../service/componentService";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import{ModalController} from "ionic-angular";
import{Checklist} from "../checklist/checklist";
import{ImageViewerController} from "ionic-img-viewer";
import {AttendancePopoverPage} from "../attendance/attendance-popover";
import {JobsPage} from "../jobs/jobs";
import {JobPopoverPage} from "../jobs/job-popover";
import {DBService} from "../service/dbService";
import {OfflineAsset} from "../offline-asset/offline-asset";
import {OfflineAssetList} from "../offline-assetlist/offline-assetlist";
import {OfflinePage} from "../offline-page/offline-page";
import {DatabaseProvider} from "../../providers/database-provider";
// import { PhotoViewer } from '@ionic-native/photo-viewer';

declare  var demo;

@Component({
  selector: 'page-offline-complete-job',
  templateUrl: 'offline-complete-job.html',
})
export class OfflineCompleteJob {
  _imageViewerCtrl: ImageViewerController;

  jobDetails:any;
  jobPhotos:any;
  takenImages:any;
  taken64Images: any;
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
  latitude:any;
  longitude:any;

  checkList:any;
  count:any;
  sLength:any;
  onButton:any;
  completedImages:any;
  fileTransfer: FileTransferObject = this.transfer.create();

  checkListItems:any;
    checkListItemsBefore:any;
  checkListOffline: any;
  showIcon:any;
  index:any;
  spinner:any;
  categories:any;
  savedImages:any;
  jobs:any;
  jobData:any;
  savedCheckList:any;
  jobChecklist: any;

  constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,
              private loadingCtrl:LoadingController, public camera: Camera,private geolocation:Geolocation, private jobService: JobService,
              private attendanceService: AttendanceService,public popoverCtrl: PopoverController, private component:componentService,private transfer: FileTransfer,
              private file: File,private modalCtrl:ModalController,imageViewerCtrl: ImageViewerController,private dbService: DBService, private dbProvider:DatabaseProvider) {
    this._imageViewerCtrl = imageViewerCtrl;
    this.spinner=true;
    this.categories = 'details';
    this.checkListItems=[];
    this.checkListItemsBefore=[];
    this.checkListOffline = [];
    this.takenImages=[];
    this.taken64Images = [];
    this.jobDetails=[];
    this.jobDetails=this.navParams.get('job');
    this.takenImages = [];
    this.savedImages = [];
    this.completedImages = [];
    this.jobs = [];
    this.jobChecklist = [];
    this.jobData ={};
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
    };
    /*
    this.jobService.loadCheckLists().subscribe(
        response=>{
            console.log("Checklist items");
            console.log(response[0].items);
            this.checkList = response[0].items;
        }
    )
    */
  }

  ionViewDidLoad() {
    this.component.showLoader('Loading Job Details');

    this.dbProvider.getJobImages(this.jobDetails.id).then(jobImages=>{
        console.log("Saved Images from SQLite");
        this.savedImages= jobImages;
        if(this.savedImages && this.savedImages.length>0){
            for(let i=0;i<this.savedImages.length;i++){
                let imageData = this.savedImages[i].image;
                let base64Image = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");
                this.completedImages.push(base64Image);
                this.component.closeAll();
            }
        }else{
            this.component.closeAll();
        }
    },err=>{
        console.log("Error in getting saved Images");
        console.log(err);
        this.savedImages = [];
        this.component.closeAll();
    });

      this.dbProvider.getChecklistItemsForJob(this.jobDetails.id).then(
          (res)=>{
              console.log("saved checklist");
              console.log(res);
              this.checkListItemsBefore=res;
              for(var i =0;i<this.checkListItemsBefore.length; i++){
                  if(this.checkListItemsBefore[i].completed=="false"){
                      this.checkListItemsBefore[i].completeOffline = false;
                      this.checkListItemsBefore[i].completed = false;
                  }else {
                      this.checkListItemsBefore[i].completeOffline = true;
                      this.checkListItemsBefore[i].completed = true;
                  }
                  if(i+1 == this.checkListItemsBefore.length){
                      this.checkListItems = this.checkListItemsBefore;
                  }
              }
          },(err)=>{
              console.log("Error in Saved checklist");
              console.log(err);
          }
      )

  }
  viewImage(index,img)
  {
    let popover = this.popoverCtrl.create(JobPopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:true});
    popover.present({

    });

    popover.onDidDismiss(data=>
    {
      console.log(data)
      if(data)
      {
        this.takenImages.pop(data);
      }

    })
  }

  viewCamera(status,job) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log('imageData -' +imageData);
      var base64ImageString = imageData;
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      let base64Image = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")
      this.taken64Images.push(base64ImageString);
      this.takenImages.push(base64Image);
    })
  }

  saveJob(job,takenImages){
    this.component.showLoader('Saving Job');
    console.log("saving jobs",job);
    console.log(takenImages);
      if(takenImages && takenImages.length>0){
          for(let i=0;i<takenImages.length;i++){
              console.log(takenImages[i]);
              this.dbProvider.insertJobImage(job.id,takenImages[i]).then(response=>{
                  console.log("Job image sucessfully inserted");
                  this.dbProvider.updateJobsData(job).then(jobResponse=>{
                      console.log("Job successfully updated");
                      this.component.closeAll();
                  },err=>{
                      console.log("Error in updating job");
                      console.log(err);
                      this.component.closeAll();
                  })
              },err=>{
                  console.log("Error in inserting image");
                  console.log(err);
                  this.component.closeAll();
              })
          }
      }else{
          console.log("No images found");
          this.component.closeLoader();
          demo.showSwal('success-message-and-ok','Success','Job Saved Successfully');
      }
  }

  completeJob(job, takenImages){
    this.component.showLoader('Completing Job');

      if(takenImages && takenImages.length>0){
          for(let i=0;i<takenImages.length;i++){
              console.log(takenImages[i]);
              this.dbProvider.insertJobImage(job.id,takenImages[i]).then(response=>{
                  console.log("Job image sucessfully inserted");
                  this.jobData.id = job.id;
                  this.jobData.assetId = job.assetId;
                  this.jobData.title = job.title;
                  this.jobData.employeeName = job.employeeName;
                  this.jobData.siteName = job.siteName;
                  this.jobData.plannedEndTime = job.plannedEndTime;
                  this.jobData.plannedStartTime = job.plannedStartTime;
                  this.jobData.description = job.description;
                  this.jobData.status = "COMPLETED";
                  this.jobData.maintenanceType = job.maintenanceType;
                  this.jobData.checkInDateTimeFrom = job.checkInDateTimeFrom;
                  this.jobData.checkInDateTimeTo = new Date();
                  this.jobData.offlineUpdate = 1;

                  this.jobs.push(this.jobData);

                  console.log("Job data");
                  console.log(this.jobData);
                  this.dbProvider.updateJobsData(this.jobData).then(jobResponse=>{
                      console.log("Job successfully updated");
                      this.component.closeAll();
                      demo.showSwal('success-message-and-ok','Success','Job Completed Successfully');
                      this.navCtrl.pop();
                  },err=>{
                      console.log("Error in updating job");
                      console.log(err);
                      this.component.closeAll();
                  })
              },err=>{
                  console.log("Error in inserting image");
                  console.log(err);
                  this.component.closeAll();
                  demo.showSwal('warning-message-and-confirmation-ok','Error in Completing Job- '+err);

              })
          }
      }else{
          console.log("No images found");
          this.component.closeLoader();
          this.jobData.id = job.id;
          this.jobData.assetId = job.assetId;
          this.jobData.title = job.title;
          this.jobData.employeeName = job.employeeName;
          this.jobData.siteName = job.siteName;
          this.jobData.plannedEndTime = job.plannedEndTime;
          this.jobData.plannedStartTime = job.plannedStartTime;
          this.jobData.description = job.description;
          this.jobData.status = "COMPLETED";
          this.jobData.maintenanceType = job.maintenanceType;
          this.jobData.checkInDateTimeFrom = job.checkInDateTimeFrom;
          this.jobData.checkInDateTimeTo = new Date();
          this.jobData.offlineUpdate = 1;

          this.jobs.push(this.jobData);

          console.log("Job data");
          console.log(this.jobData);
          this.dbProvider.updateJobsData(this.jobData).then(jobResponse=>{
              console.log("Job successfully updated");
              this.component.closeAll();
              demo.showSwal('success-message-and-ok','Success','Job Completed Successfully');
          },err=>{
              console.log("Error in updating job");
              console.log(err);
              this.component.closeAll();
              demo.showSwal('warning-message-and-confirmation-ok','Error in Completing Job- '+err);

          })
      }

  }

  saveJobCheckList(checklistItems,jobDetails){
    console.log("checkListitems");
    console.log(checklistItems);
    if(checklistItems && checklistItems.length>0){
        for(let i=0;i<checklistItems.length;i++){
            console.log(checklistItems[i]);
            this.dbProvider.updateChecklistData(checklistItems[i]).then(response=>{
                console.log("checklist items successfully updated");
                console.log(checklistItems[i].itemName);
                this.dbProvider.updateJobsData(jobDetails).then(response=>{
                    console.log("Job successfully updated");
                    // demo.showSwal('success-message-and-ok','Success','Checklist Updated Successfully');
                    this.navCtrl.pop();
                },err=>{
                    console.log("Error in updating job");
                    console.log(err);
                    // demo.showSwal('warning-message-and-confirmation-ok',"Error in updating job");
                });
            },err=>{
                console.log("Error in updating checklist items to SQLite");
                console.log(err);
                // demo.showSwal('warning-message-and-confirmation-ok',"Error in updating job checklist");

            });

            if(i+1 == checklistItems.length){
                this.component.closeAll();
            }
        }
    }else{
        console.log("Checklist items not found");
    }



  }


  changeStatus(i)
  {
    this.sLength=this.jobDetails.checklistItems.length;
    this.count=this.jobDetails.checklistItems.filter((data,i)=>{
      return data.status;
    }).length;
    console.log(this.jobDetails.checklistItems[i].status);

    this.jobDetails.checklistItems[i].status=true;
    this.jobDetails.checklistItems[i].completed=true;
    console.log("Count:"+this.count);
    console.log("Slength"+this.sLength);
    this.onButton=true;

  }

  call()
  {

  }


  presentCheckListModal(jobDetails) {
    let profileModal = this.modalCtrl.create(Checklist, {jobDetails:jobDetails});
    profileModal.onDidDismiss(data => {
      console.log(data);
      this.jobDetails.checkListItems = data;
    });
    profileModal.present();
  }


  viewCameraCheckList(i) {
    console.log(i);
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {

      // console.log('imageData -' +imageData);
      imageData = 'data:image/jpeg;base64,' + imageData;
      // imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

      // if(this.checkListItems[i].image_1 !=null){
      //     console.log("image_1"+this.checkListItems[i].image_1);
      //     if(this.checkListItems[i].image_2 !=null){
      //         console.log("image_2"+this.checkListItems[i].image_2);
      //
      //         if(this.checkListItems[i].image_3 !=null){
      //             console.log("image_3"+this.checkListItems[i].image_3);
      //
      //             this.cs.showToastMessage('Cannot add more than 3 images','bottom');
      //         }else{
      //             console.log("No third image");
      //             this.checkListItems[i].image_3 = imageData;
      //         }
      //     }else{
      //         console.log("No second image");
      //         this.checkListItems[i].image_2 = imageData;
      //     }
      // }else{
      //     console.log("No first image");
      //     this.checkListItems[i].image_1 = imageData;
      // }

      this.checkListItems[i].image_1 = imageData;


    })

  }

  resetRemarks(i,completed){
    console.log(i);
    console.log(completed);
    if(completed){
      this.checkListItems[i].remarks=null;
    }
  }

  show(show,i)
  {
    this.showIcon = !show;
    this.index = i;
  }

  // openImage(imageToView){ const viewer =  this._imageViewerCtrl .create(imageToView)
  //     viewer.present(); }

  viewImg(img)
  {
    let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:img},{cssClass:'view-img checklist-img',showBackdrop:true});
    popover.present({
    });
  }
  imgViewer(image){
    // this.photoViewer.show(image);
    let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:image},{cssClass:'view-img checklist-img',showBackdrop:true});
    popover.present({
    });
  }
}

