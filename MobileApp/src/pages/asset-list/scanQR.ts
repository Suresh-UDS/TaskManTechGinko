import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";

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

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController, public qrScanner: QRScanner) {
        this.assetList = [{
            name:'Vaccum Cleaner',
            assetGroup:'UDS Housekeeping',
            status:'',
            location:'Updater Services Private Ltd.,',
            site:'Thuraipakkam',
            block:'A-block',
            floor:'First floor',
            zone:'IT-Bay',
            manufacturer:'Eureka-Forbes',
            model:'quickcleandx',
            serial:'B00F3ABSXU',
            acquiredDate:new Date(),
            purchasePrice:'₹3,599',
            currentPrice:'₹3,999',
            estimatedDisposePrice:'₹400',
            serviceProvider:'cloud tail India',
            warrantyType:'product warranty',
            warrantyEndDate:new Date(),
            img:'assets/imgs/vaccum-cleaner.jpg'
        },
            {
                name:'KOEL Diesel Genset',
                assetGroup:'CMRL',
                status:'',
                location:'CMRL - Shenoy Nagar',
                site:'Shenoynagar',
                block:'A-block',
                floor:'Ground floor',
                zone:'Genset-area',
                manufacturer:'KOEL Green',
                model:'4AB 160M1',
                serial:'B00F3ABSXU',
                acquiredDate:new Date(),
                purchasePrice:'₹30,000',
                currentPrice:'₹30,000',
                estimatedDisposePrice:'₹0',
                serviceProvider:'KJ Enterprises',
                warrantyType:'Manufacturer',
                warrantyEndDate:new Date(),
                img:'assets/imgs/dg.jpg'
            }];
    }

    ionViewDidLoad() {
        window.document.querySelector('ion-app').classList.add('transparentBody')
        this.qrScanner.prepare().then((status:QRScannerStatus)=>{
            console.log("Opening Scanner");
            this.qrScanner.show();
            let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
                console.log('Scanned Something',text);
                if(text == 'vaccum'){
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    this.navCtrl.pop();
                    window.document.querySelector('ion-app').classList.add('transparentBody')
                    this.navCtrl.push(AssetView,{assetDetails:this.assetList[0]});

                }else {
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    this.navCtrl.pop();
                    window.document.querySelector('ion-app').classList.add('transparentBody')
                    this.navCtrl.push(AssetView,{assetDetails:this.assetList[1]});

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