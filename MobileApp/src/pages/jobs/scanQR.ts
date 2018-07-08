import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {componentService} from "../service/componentService";
import {JobsPage} from "./jobs";

/**
 * Generated class for the AssetList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'scanQR',
    templateUrl: 'scanQR.html',
})
export class ScanQR {

    assetList: any;
    data:any;

    constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController, public qrScanner: QRScanner,  public cs:componentService) {


    }

    ionViewDidLoad() {
        window.document.querySelector('ion-app').classList.add('transparentBody')
        this.qrScanner.prepare().then((status:QRScannerStatus)=>{
            console.log("Opening Scanner");
            this.qrScanner.show();
            let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
                console.log('Scanned Something',text);
                console.log(text.split('_'));
                var scannedData = text.split('_');
                var siteId = scannedData[0];
                var locationId =scannedData[1];
                if(text!=""){
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    this.navCtrl.setRoot(JobsPage,{siteId:siteId,locationId:locationId});
                    this.cs.showToastMessage('Jobs for the location','bottom');
                }else {
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    this.navCtrl.setRoot(JobsPage);
                    window.document.querySelector('ion-app').classList.add('transparentBody')
                    this.cs.showToastMessage('Jobs not found, please try again','bottom')
                }
                this.qrScanner.hide();
                scanSub.unsubscribe();
                window.document.querySelector('ion-app').classList.add('transparentBody')
            });
            if(status.authorized){
                console.log("Permission Authorized");

            }else if(status.denied){
                console.log("Permission denied temporarily" );
                this.qrScanner.openSettings();
            }else{
                console.log("Permission denied");
            }
        })
            .catch((e:any)=>console.log("error is",e));
    }



}