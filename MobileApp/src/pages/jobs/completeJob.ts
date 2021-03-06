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
@Component({
    selector: 'page-complete-job',
    templateUrl: 'completeJob.html'
})
export class CompleteJobPage {

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
    };
    latitude:any;
    longitude:any;

    checkList:any;
    count:any;
    sLength:any;
    onButton:any;
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, @Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,
                private loadingCtrl:LoadingController, public camera: Camera,private geolocation:Geolocation, private jobService: JobService,
                private attendanceService: AttendanceService,public popoverCtrl: PopoverController, private component:componentService,private transfer: FileTransfer, private file: File) {
        this.jobDetails=this.navParams.get('job');
        this.takenImages = [];
        this.checkOutDetails={
            employeeId:'',
        employeeEmpId:'',
        projectId:'',
        siteId:'',
        jobId:'',
        latitudeOut:'',
        longitude:''
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

        this.jobService.getJobDetails(this.jobDetails.id).subscribe(
            response=>{
                console.log("Response on job details");
                console.log(response);
                this.jobDetails = response;
            },error=>{
                console.log("Error in getting job details");
                console.log(error);
                this.component.showToastMessage("Errror in getting job details","bottom");
            }
        )

    }

    ionViewDidLoad() {
        console.log(this.jobDetails);
        console.log(this.jobDetails.checklistItems);
    }
    viewImage(index,img)
    {
        let popover = this.popoverCtrl.create(JobPopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:true});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {
            this.takenImages.pop(data);
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

    completeJob(job, takenImages){
        this.component.showLoader('Completing Job');
        this.geolocation.getCurrentPosition().then((response)=>{
            console.log("Current location");
            console.log(response);
            this.latitude = response.coords.latitude;
            this.longitude = response.coords.longitude;
        }).catch((error)=>{
            this.latitude = 0;
            this.longitude = 0;
        })
        console.log(job);
        this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
        this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
        this.checkOutDetails.projectId =job.siteProjectId;
        this.checkOutDetails.siteId = job.siteId;
        this.checkOutDetails.jobId = job.id;
        this.checkOutDetails.latitudeOut = this.latitude;
        this.checkOutDetails.longitude = this.longitude;
        console.log(this.checkOutDetails);
        this.jobService.checkOutJob(this.checkOutDetails).subscribe(
            response=>{
                console.log("complete job response");
                console.log(response);
                console.log(job);
                this.component.closeLoader();
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

            },err=>{
                this.component.closeLoader();
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
        console.log("Count:"+this.count);
        console.log("Slength"+this.sLength);

            this.onButton=true;

    }

    call()
    {

    }
}
