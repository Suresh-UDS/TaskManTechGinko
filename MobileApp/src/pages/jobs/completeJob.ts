import { Component, Inject } from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {JobsPage} from "./jobs";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {JobPopoverPage} from "./job-popover";
import {componentService} from "../service/componentService";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import{ModalController} from "ionic-angular";
import{Checklist} from "../checklist/checklist";
import{ImageViewerController} from "ionic-img-viewer";
import {AttendancePopoverPage} from "../attendance/attendance-popover";
// import { PhotoViewer } from '@ionic-native/photo-viewer';

declare  var demo;

@Component({
    selector: 'page-complete-job',
    templateUrl: 'completeJob.html'
})
export class CompleteJobPage {
    _imageViewerCtrl: ImageViewerController;

    jobDetails:any;
    jobPhotos:any;
    takenImages:any;
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

    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,
                private loadingCtrl:LoadingController, public camera: Camera,private geolocation:Geolocation, private jobService: JobService,
                private attendanceService: AttendanceService,public popoverCtrl: PopoverController, private component:componentService,private transfer: FileTransfer,
                private file: File,private modalCtrl:ModalController,imageViewerCtrl: ImageViewerController) {
        this._imageViewerCtrl = imageViewerCtrl;
        this.spinner=true;
        this.categories = 'details';
        this.checkListItems=[];
        this.takenImages=[];
        this.jobDetails=[];
        this.jobDetails=this.navParams.get('job');
        this.takenImages = [];
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
        this.jobService.getJobDetails(this.jobDetails.id).subscribe(
            response=>{
                if(response.errorStatus){
                    this.component.closeAll();
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    this.component.closeLoader();
                    console.log("Response on job details");
                    console.log(response);
                    this.jobDetails = response;
                    this.checkListItems = this.jobDetails.checklistItems;
                    if(response.images.length>0){
                        this.component.showLoader('Getting saved images');
                        console.log("Images available");
                        this.completedImages=[];
                        for(let image of response.images){
                            this.jobService.getCompletedImage(image.employeeEmpId,image.photoOut).subscribe(
                                imageData=>{
                                    this.component.closeLoader();
                                    console.log(imageData);
                                    this.completedImages.push(imageData._body);
                                },err=>{
                                    this.component.closeLoader();
                                    console.log("Error in getting images");
                                    console.log(err);
                                }
                            )
                        }

                    }
                }

            },error=>{
                this.component.closeLoader();
                console.log("Error in getting job details");
                console.log(error);
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

    viewOnlyImage(index,img){
        let popover = this.popoverCtrl.create(JobPopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:true});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {
            // this.takenImages.pop(data);
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
            imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")

            this.takenImages.push(imageData);


        })

    }

    saveJob(job){
        this.component.showLoader('Saving Job');
        console.log(job)
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
                    if(this.takenImages.length>0){
                        this.component.showLoader('Uploading Images');
                        this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                        this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                        this.checkOutDetails.projectId =job.siteProjectId;
                        this.checkOutDetails.siteId = job.siteId;
                        this.checkOutDetails.jobId = job.id;
                        this.checkOutDetails.id=job.checkInOutId;
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
                                    console.log(this.jobDetails.id);
                                    console.log(this.jobDetails.id+i);
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
      console.log("getJobs",job);
      console.log("getImages",takenImages);
        this.component.showLoader('Completing Job');
        this.geolocation.getCurrentPosition().then((response)=>{
            this.component.closeAll();
            console.log("Current location");
            console.log(response);
            this.latitude = response.coords.latitude;
            this.longitude = response.coords.longitude;
        }).catch((error)=>{
            this.latitude = 0;
            this.longitude = 0;
        })
        this.jobService.saveJob(job).subscribe(
            response=>{
                console.log(job);
                this.checkOutDetails.completeJob=true;
                this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
                this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
                this.checkOutDetails.projectId =job.siteProjectId;
                this.checkOutDetails.siteId = job.siteId;
                this.checkOutDetails.jobId = job.id;
                this.checkOutDetails.latitudeOut = this.latitude;
                this.checkOutDetails.longitude = this.longitude;
                this.checkOutDetails.id=job.checkInOutId;
                console.log(this.checkOutDetails);
                this.jobService.updateJobImages(this.checkOutDetails).subscribe(
                    response=>{
                        if(response.errorStatus){
                            this.component.closeAll();
                            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
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
                                console.log(this.jobDetails.id);
                                console.log(this.jobDetails.id+i);
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
                            this.navCtrl.setRoot(JobsPage);

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
