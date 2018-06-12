import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from "ionic-angular";
import {ModalController} from "ionic-angular";
// import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {componentService} from "../service/componentService";
import {JobPopoverPage} from "../jobs/job-popover";
import {Camera, CameraOptions} from "@ionic-native/camera";
import{AssetService} from "../service/assetService";

/**
 * Generated class for the GetAssetReadings page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-get-asset-reading',
    templateUrl: 'get-asset-reading.html',
})
export class GetAssetReading {

    assetDetails:any;
    dateTime:any;
    takenImages:any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController,
                public componentService:componentService, public popoverCtrl:PopoverController, public camera:Camera,
                public assetService:AssetService) {
        this.assetDetails = this.navParams.get('assetDetails');
        console.log(this.navParams.get('assetDetails'));
        this.dateTime = new Date();
        this.takenImages = [];

    }
    ionViewDidLoad(){
        console.log("Get Asset reading page");
        console.log(this.assetDetails);
        console.log(this.assetDetails.config);

    }

    submitReading(){
        this.componentService.showToastMessage('Reading Added','bottom');
        this.navCtrl.pop();
    }

    viewCamera() {

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

    viewImage(index,img)
    {
        let popover = this.popoverCtrl.create(JobPopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:true});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {
            console.log(data);
            if(data)
            {
                this.takenImages.pop(data);
            }
        })
    }

    saveReading(reading){
        console.log("Reading page");
        console.log(reading);
        var assetReading = {
            name:reading.name,
            uom:reading.uom,
            initialValue:reading.previousValue,
            finalValue:reading.currentValue,
            consumption:reading.currentValue-reading.previousValue,
            value:"0.88",
            assetId:reading.assetId,
            assetParameterConfigId:reading.id,
            consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
        };
        this.assetService.saveReading(assetReading).subscribe(
            response=>{
                console.log("Save Reading Response");
                console.log(response);
            },
            error=>
            {
                console.log("Save Reading Error");
                console.log(error);
            }

        )

    }
}