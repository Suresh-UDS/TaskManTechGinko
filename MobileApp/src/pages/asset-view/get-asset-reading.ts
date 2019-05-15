import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams, PopoverController, ViewController} from "ionic-angular";
import {ModalController} from "ionic-angular";
import{DBService} from "../service/dbService";
// import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {componentService} from "../service/componentService";
import {JobPopoverPage} from "../jobs/job-popover";
import {Camera, CameraOptions} from "@ionic-native/camera";
import{AssetService} from "../service/assetService";
import {CalenderPage} from "../calender-page/calender-page";
import{SQLite,SQLiteObject } from "@ionic-native/sqlite";

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
    assetConfig:any;
    current:any;
    enableButton:any;
    offlineReading:any;


    constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController,
                public componentService:componentService, public popoverCtrl:PopoverController, public camera:Camera,
                public assetService:AssetService,public viewCtrl:ViewController,private sqlite:SQLite,
                private dbService:DBService) {
        this.assetDetails = this.navParams.get('assetDetails');
        console.log(this.navParams.get('assetDetails'));
        this.dateTime = new Date();
        this.takenImages = [];
        this.assetConfig=[];
        this.offlineReading = [];
        this.enableButton = true;

    }
    ionViewWillEnter(){
        // this.componentService.showLoader("Readings")
       this.getAssetConfigsReading();
    }

    showHide(i){
        console.log("Show hide"+i);
        // this.collapseHide
    }

    showCalendar(){
        this.navCtrl.push(CalenderPage);
    }

    dismiss() {
        let data = {};
        this.viewCtrl.dismiss(data);
    }


    getAssetConfigsReading()
    {
        console.log("Get Asset reading page");
        console.log(this.assetDetails);
        console.log(this.assetDetails.config);
        this.assetService.getAssetConfig(this.assetDetails.assetType,this.assetDetails.id).subscribe(
        //
            response=>{
                console.log("Asset config details");
                console.log(response);
                this.assetConfig = response;
                for(let config of this.assetConfig){
                    this.assetService.getAssetPreviousReadings(config.assetId,config.id).subscribe(
                        response=>{
                            console.log("Get Asset Previous readings");
                            console.log(response);
                            this.componentService.closeLoader()
                            if(response.consumptionMonitoringRequired){
                                if(response.initialValue>0){
                                    config.previousValue = response.initialValue;
                                }else{
                                    config.previousValue = null;
                                }
                            }else{
                                if(response.value>0){
                                    config.previousValue = response.value;
                                }else{
                                    config.previousValue = null;
                                }
                            }

                            if(response.initialValue<0){

                                if(response.value>0){
                                    config.previousValue=response.value;
                                }
                            }
                            else if(response.finalValue<=0)
                            {
                                config.previousValue=response.initialValue;
                                config.reading=response.initialValue;
                                console.log(this.assetConfig);
                                config.previousReadingId=response.id;
                            }else{
                                config.previousValue=response.finalValue;
                                config.reading=response.initialValue;
                                console.log(this.assetConfig);

                            }
                        }
                    )
                }
            },err=>{
                this.componentService.closeLoader();
                console.log("Error in getting asset config");
                console.log(err);
            }
        )

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
            imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");
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
        this.enableButton = false;
        console.log("Save Reading");
        console.log(reading);
        console.log(reading.name);
        var assetReading={};
        console.log(reading.currentValue);
        console.log(reading.min);
        console.log(reading.max);


        if(reading.consumptionMonitoringRequired && reading.previousReadingId>0){
            console.log(reading.currentValue);

            if( reading.max>0){
                if(reading.currentValue>0){
                    if(reading.currentValue>reading.min && reading.currentValue<reading.max ){
                        assetReading = {
                            name:reading.name,
                            uom:reading.uom,
                            initialValue:reading.previousValue,
                            finalValue:reading.currentValue,
                            consumption:reading.currentValue-reading.previousValue,
                            assetId:reading.assetId,
                            assetParameterConfigId:reading.id,
                            consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                            id:reading.previousReadingId

                        };
                        console.log(assetReading);
                        this.assetSaveReading(assetReading); //online
                    }else{
                        var msg = "Asset reading should be greater than "+reading.min+"or less than "+reading.max;
                        this.componentService.showToastMessage(msg,'bottom');
                    }
                }else{
                    assetReading = {
                        name:reading.name,
                        uom:reading.uom,
                        initialValue:reading.previousValue,
                        finalValue:reading.currentValue,
                        consumption:reading.currentValue-reading.previousValue,
                        assetId:reading.assetId,
                        assetParameterConfigId:reading.id,
                        consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                        id:reading.previousReadingId

                    };
                    console.log(assetReading);
                    this.assetSaveReading(assetReading); //online

                }


            }else{
                assetReading = {
                    name:reading.name,
                    uom:reading.uom,
                    initialValue:reading.previousValue,
                    finalValue:reading.currentValue,
                    consumption:reading.currentValue-reading.previousValue,
                    assetId:reading.assetId,
                    assetParameterConfigId:reading.id,
                    consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                    id:reading.previousReadingId

                };
                console.log(assetReading);


                this.assetSaveReading(assetReading);//online


            }

        }else if(reading.consumptionMonitoringRequired){
            if( reading.max>0) {
                if(reading.currentValue>0){
                    if(reading.currentValue>reading.min && reading.currentValue<reading.max ){
                        assetReading = {
                            name:reading.name,
                            uom:reading.uom,
                            initialValue:reading.previousValue,
                            finalValue:reading.currentValue,
                            consumption:reading.currentValue-reading.previousValue,
                            assetId:reading.assetId,
                            assetParameterConfigId:reading.id,
                            consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                        };
                        console.log(assetReading);
                        this.assetSaveReading(assetReading); //online

                    }else{
                        var msg = "Asset reading should be greater than "+reading.min+"or less than "+reading.max;
                        this.componentService.showToastMessage(msg,'bottom');
                    }
                }else{
                    assetReading = {
                        name:reading.name,
                        uom:reading.uom,
                        initialValue:reading.previousValue,
                        finalValue:reading.currentValue,
                        consumption:reading.currentValue-reading.previousValue,
                        assetId:reading.assetId,
                        assetParameterConfigId:reading.id,
                        consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                        id:reading.previousReadingId

                    };
                    console.log(assetReading);
                    this.assetSaveReading(assetReading); //online

                }
            }else{
                assetReading = {
                    name:reading.name,
                    uom:reading.uom,
                    initialValue:reading.previousValue,
                    finalValue:reading.currentValue,
                    consumption:reading.currentValue-reading.previousValue,
                    assetId:reading.assetId,
                    assetParameterConfigId:reading.id,
                    consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                };
                console.log(assetReading);
                this.assetSaveReading(assetReading); //online

            }

        }else{
            if( reading.max>0) {
                if (reading.currentValue > reading.min && reading.currentValue < reading.max) {
                    assetReading = {
                        name:reading.name,
                        uom:reading.uom,
                        value:reading.currentValue,
                        assetId:reading.assetId,
                        assetParameterConfigId:reading.id,
                        consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                    };
                    console.log(assetReading);
                    this.assetSaveReading(assetReading); //online


                }else{
                    var msg = "Asset reading should be greater than "+reading.min+"or less than "+reading.max;
                    this.componentService.showToastMessage(msg,'bottom');
                }
            }else{
                assetReading = {
                    name:reading.name,
                    uom:reading.uom,
                    value:reading.currentValue,
                    assetId:reading.assetId,
                    assetParameterConfigId:reading.id,
                    consumptionMonitoringRequired:reading.consumptionMonitoringRequired,
                };
                console.log(assetReading);
                this.assetSaveReading(assetReading); //online?
            }

        }


    }

    assetSaveReading(assetReading)
    {
        //online
        this.assetService.saveReading(assetReading).subscribe(
            response=>{
                console.log("Save Reading Response");
                console.log(response);
                if(response.errorStatus){
                    this.enableButton = true;
                    this.componentService.showToastMessage('Invalid Entry','bottom');
                }else{
                    this.enableButton = true;
                    console.log("Error status false");
                    this.componentService.showToastMessage('Reading Saved','bottom');
                    let data = { 'foo': 'bar' };
                    this.viewCtrl.dismiss(data);
                }
            },
            error=>
            {
                this.enableButton = true;
                console.log("Save Reading Error");
                console.log(error);
                this.componentService.showToastMessage('Save Reading Error','bottom');
            }

        )
    }

}