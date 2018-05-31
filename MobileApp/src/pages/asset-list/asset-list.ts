import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {ScanQR} from "./scanQR";
import {AssetService} from "../service/assetService";

/**
 * Generated class for the AssetList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-asset-list',
  templateUrl: 'asset-list.html',
})
export class AssetList {

    assetList:any;
    searchCriteria:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService) {
    this.assetList = [];
    this.searchCriteria = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetList')
    this.assetService.findAllAssets().subscribe(
        response=>{
            console.log(response);
            this.assetList = response;
        }
    );

  }

  openFilters(){
      console.log("Opening filter modal");
      let modal = this.modalController.create(AssetFilter);
      modal.onDidDismiss(data=>{
          console.log("Modal dismissed");
          console.log(data);
          this.searchCriteria = {
              siteId:data.siteId,
              projectId:data.projectId,
          }

      });
      modal.present();

  }

  scanQRCode(){
      window.document.querySelector('ion-app').classList.add('transparentBody')
      this.qrScanner.prepare().then((status:QRScannerStatus)=>{
          console.log("Opening Scanner");
          this.qrScanner.show();
          let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
              console.log('Scanned Something',text);
              this.qrScanner.hide();
              scanSub.unsubscribe();
              window.document.querySelector('ion-app').classList.add('transparentBody')
              this.navCtrl.push(AssetView);
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

  scanQR(){
      this.navCtrl.push(ScanQR)
  }

  searchAssets(){

  }

    viewAsset(asset){
      this.navCtrl.push(AssetView,{assetDetails:asset});
    }






}
