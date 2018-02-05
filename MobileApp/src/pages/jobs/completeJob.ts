import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {JobsPage} from "./jobs";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";

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


    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService,
                private loadingCtrl:LoadingController, public camera: Camera,private geolocation:Geolocation, private jobService: JobService,
                private attendanceService: AttendanceService) {
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

        this.jobService.loadCheckLists().subscribe(
            response=>{
                console.log("Checklist items");
                console.log(response[0].items);
                this.checkList = response[0].items;
            }
        )

    }

    ionViewWillEnter() {

    }

    viewCamera(status,job) {

            const options: CameraOptions = {
                quality: 50,
                destinationType: this.camera.DestinationType.NATIVE_URI,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE
            };

        this.camera.getPicture(options).then((imageData) => {

            console.log(imageData);

            this.takenImages.push(imageData);


        })

    }

    completeJob(job, takenImages){

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
                console.log(response);
                this.navCtrl.push(JobsPage);
                //TODO
                //File Upload after successful checkout
            }
        )

    }


}
