import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";


@Component({
    selector: 'page-complete-job',
    templateUrl: 'completeJob.html'
})
export class CompleteJobPage {

    jobDetails:any;
    jobPhotos:any;
    takenImages:any;


    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController, public camera: Camera) {
        this.jobDetails=this.navParams.get('job');
        this.takenImages = [];
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


}
