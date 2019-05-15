import {Component, Inject} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
// import {Component, Inject} from '@angular/core';
// import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
// import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {AssetService} from "../service/assetService";
import {componentService} from "../service/componentService";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import{OfflineAttendanceSites} from "../employee/offline-attendance-sites";
// import {win} from "@angular/platform-browser/src/browser/tools/browser";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SiteService} from "../service/siteService";
import {DBService} from "../service/dbService";
import {Network} from "@ionic-native/network";
import { Diagnostic } from '@ionic-native/diagnostic';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import {FileTransferObject, FileUploadOptions, FileTransfer} from "@ionic-native/file-transfer";
import set = Reflect.set;
import {ScanQR} from "../jobs/scanQR";
import{OfflineAsset} from "../offline-asset/offline-asset";
import {ScanQRAsset} from "../asset-list/scanQR-asset";
import {DatabaseProvider} from "../../providers/database-provider";

/**
 * Generated class for the OfflineAssetlist page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-offline-assetList',
  templateUrl: 'offline-assetList.html',
})
export class
OfflineAssetList {
    assetList:any;
    searchCriteria:any;
    page:1;
    totalPages:0;
    open:any;
    qr:any;
    assetDetails:any;

    sites:any;
    test:any;
    database:any;
    asset:any;
    db:any;
    fileTransfer: FileTransferObject = this.transfer.create();

  constructor(@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,private transfer: FileTransfer,
              public modalCtrl:ModalController,private diagnostic: Diagnostic,private sqlite: SQLite,
              public componentService:componentService, public navCtrl: NavController, public navParams: NavParams,
              public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService,
              public dbService:DBService,private network:Network, private dbProvider: DatabaseProvider) {
      this.assetList = [];
      this.test = [];
      this.searchCriteria = {};
  }

    ionViewWillEnter()
    {
        this.componentService.showLoader("Asset List");

        //     //offline
        this.dbProvider.getAssetData().then(
            (res)=>{
                this.componentService.closeLoader();
                console.log(res);
                this.assetList = res;
            },
            (err)=>{
                this.assetList = [];
                this.componentService.closeLoader()
        })


    }

    ionViewDidLoad() {

        console.log('ionViewDidLoad Offline AssetList');
        // this.componentService.showLoader("Loading Assets");
        this.open = true;
        // After Set Pagination
        // var searchCriteria={}
        // this.getAsset(searchCriteria)




        if(this.navParams.get('text'))
        {
            // this.componentService.closeLoader();
            var text = this.navParams.get('text');
            console.log("Asset scanned");
            console.log(text);
            this.dbProvider.getAssetDataByCode(text).then(
                response=>{
                    console.log(response);
                    if(response ){
                        this.componentService.showToastMessage('Asset found, navigating..','bottom');
                        console.log("Search by asset code response");
                        console.log(response);
                        window.document.querySelector('ion-app').classList.add('transparentBody');
                        this.navCtrl.push(OfflineAsset,{assetDetails:response}); //offline
                    }else{
                        this.componentService.showToastMessage('Asset not found','bottom');
                    }


                },
                err=>{
                    console.log("Error in getting asset by code");
                    console.log(err);
                    this.componentService.showToastMessage('Asset not found, please try again','bottom');
                }
            )



        }

    }

    viewAsset(asset){
        console.log("asset");
        console.log(asset);
        this.navCtrl.push(OfflineAsset,{assetDetails:asset});
    }


    saveReadingToServer(readings)
    {
        return new Promise((resolve,reject)=>{
            for(var i=0;i<readings.length;i++)
            {
                this.assetService.saveReading({name:readings[i].name,uom:readings[i].uom,initialValue:readings[i].initialValue,finalValue:readings[i].finalValue,consumption:readings[i].consumption,assetId:readings[i].assetId,assetParameterConfigId:readings[i].assetParameterConfigId}).subscribe(
                    response => {
                        console.log("save reading sync to server");
                        console.log(response);
                        resolve("s")
                    },
                    error => {
                        console.log("save readings error sync to server");
                        reject("no")
                    })
            }

        })
    }


    scanQR(){
        this.navCtrl.push(ScanQRAsset,{offline:true});

    }




}
