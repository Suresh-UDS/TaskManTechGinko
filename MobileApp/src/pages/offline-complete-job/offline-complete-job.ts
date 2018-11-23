
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
  showIcon:any;
  index:any;
  spinner:any;
  categories:any;
  savedImages:any;
  jobs:any;
  jobData:any;

  constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,
              private loadingCtrl:LoadingController, public camera: Camera,private geolocation:Geolocation, private jobService: JobService,
              private attendanceService: AttendanceService,public popoverCtrl: PopoverController, private component:componentService,private transfer: FileTransfer,
              private file: File,private modalCtrl:ModalController,imageViewerCtrl: ImageViewerController,private dbService: DBService) {
    this._imageViewerCtrl = imageViewerCtrl;
    this.spinner=true;
    this.categories = 'details';
    this.checkListItems=[];
    this.takenImages=[];
    this.taken64Images = [];
    this.jobDetails=[];
    this.jobDetails=this.navParams.get('job');
    this.takenImages = [];
    this.savedImages = [];
    this.completedImages = [];
    this.jobs = [];
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

    setTimeout(()=>{
      console.log("job id ",this.jobDetails.id);
      this.dbService.getSavedImages(this.jobDetails.id).then(
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
          console.log("error",err)
          this.savedImages = [];
          this.component.closeLoader();
        }
      )
    },3000);

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

  saveJob(job){
    this.component.showLoader('Saving Job');
    console.log("saving jobs",job);
    setTimeout(()=>{
      this.dbService.setSaveJobs(job, this.taken64Images).then(
        (res)=>{
          console.log("image saved in local db",res);
          this.component.closeLoader();
        },(err)=>{
          console.log("error in saving image",err);
          this.component.closeLoader();
        }
      )
    },3000);

  }

  completeJob(job, takenImages){
    this.component.showLoader('Completing Job');

    setTimeout(()=>{
      this.dbService.setSaveJobs(job, this.taken64Images).then(
        (res)=>{
          console.log("image saved in local db",res);
            this.jobs=[];
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

            this.jobs.push(this.jobData);
            console.log("jobs",this.jobs);

          this.dbService.setPPMCompletJobs(this.jobData).then(
            (res)=>{
              console.log("complete job",res);
              this.component.closeLoader();
              this.navCtrl.setRoot(OfflinePage);
            },(err)=>{
              console.log("error job",err);
              this.component.closeLoader();

            }
          );

        },(err)=>{
          console.log("error in saving image",err);
          this.component.closeLoader();
        }
      )
    },3000);

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

