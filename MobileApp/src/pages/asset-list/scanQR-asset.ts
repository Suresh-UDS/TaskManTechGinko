import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {AssetService} from "../service/assetService";
import {componentService} from "../service/componentService";
import {AssetList} from "./asset-list";
import {OfflineAssetList} from "../offline-assetlist/offline-assetlist";

/**
 * Generated class for the AssetList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'scanQR-Asset',
    templateUrl: 'scanQR-asset.html',
})
export class ScanQRAsset {

    assetList: any;
    data:any;
    offline:any;

    constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController, public qrScanner: QRScanner, public assetService:AssetService, public cs:componentService) {

        this.offline = this.navParams.data.offline;

    }

    ionViewDidLoad() {
        window.document.querySelector('ion-app').classList.add('transparentBody')
        this.qrScanner.prepare().then((status:QRScannerStatus)=>{
            console.log("Opening Scanner");
            this.qrScanner.show();
            let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
                console.log('Scanned Something',text);
                if(text!=""){
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    if(this.offline)
                    {
                        this.navCtrl.pop();
                        this.navCtrl.setRoot(OfflineAssetList,{text:text})
                    }
                    else {
                        this.navCtrl.pop();
                        this.navCtrl.setRoot(AssetList,{text:text})
                    }

                    // this.navCtrl.pop();
                    // this.assetService.getAssetByCode(text).subscribe(
                    //     response=>{
                    //         this.cs.showToastMessage('Asset found, navigating..','bottom')
                    //         console.log("Search by asset code response");
                    //         console.log(response);
                    //         window.document.querySelector('ion-app').classList.add('transparentBody')
                    //         // this.navCtrl.setRoot(AssetList,{assetDetails:response,qr:true});
                    //         this.navCtrl.push(AssetView,{assetDetails:response});
                    //
                    //     },
                    //     err=>{
                    //         console.log("Error in getting asset by code");
                    //         console.log(err);
                    //         this.cs.showToastMessage('Asset not found, please try again','bottom')
                    //     }
                    // )
                }else {
                    this.qrScanner.hide();
                    scanSub.unsubscribe();
                    if(this.offline)
                    {
                        this.navCtrl.pop();
                        this.navCtrl.setRoot(OfflineAssetList,{text:text})
                    }
                    else {
                        this.navCtrl.pop();
                        this.navCtrl.setRoot(AssetList,{text:text})
                    }
                    window.document.querySelector('ion-app').classList.add('transparentBody')
                    this.cs.showToastMessage('Asset not found, please try again','bottom')
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