import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {ScanQR} from "./scanQR";
import {AssetService} from "../service/assetService";
import {componentService} from "../service/componentService";

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
    page:1;
    totalPages:0;
  constructor(public componentService:componentService, public navCtrl: NavController, public navParams: NavParams, public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService) {
    this.assetList = [];
    this.searchCriteria = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetList');
    this.componentService.showLoader("Loading Assets")

    this.assetService.findAllAssets().subscribe(
        response=>{
            this.componentService.closeLoader()
            console.log(response);
            this.assetList = response;
        },
        error=>{
            console.log("")
        }
    );


      // After Set Pagination
      // var searchCriteria={}
      // this.getAsset(searchCriteria)
  }

  getAsset(searchCriteria)
  {
      this.assetService.searchAssets(searchCriteria).subscribe(
          response=>{
              this.componentService.closeLoader()
              console.log("Asset search filters response");
              console.log(response)
              // this.assetList=response.transactions
          },err=>{
              this.componentService.closeLoader();
              console.log("Error in filtering assets");
              console.log(err);
          }
      )
  }

  openFilters(){
      console.log("Opening filter modal");
      let modal = this.modalController.create(AssetFilter);
      modal.onDidDismiss(data=>{
          console.log("Modal dismissed");
          console.log(data);
          var searchCriteria = {
              siteId:data.siteId,
              projectId:data.projectId,
          };
          this.assetService.searchAssets(searchCriteria).subscribe(
              response=>{
                  this.componentService.closeLoader()
                  console.log("Asset search filters response");
                  console.log(response)
              },err=>{
                  this.componentService.closeLoader();
                  console.log("Error in filtering assets");
                  console.log(err);
              }
          )
          // this.getAsset(searchCriteria);

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

    // Pull to refresh
    doRefresh(refresher)
    {
        this.componentService.showLoader("");
        var searchCriteria={};
        this.getAsset(searchCriteria)
        refresher.complete()
    }

    // Scroll
    doInfiniteTodaysJobs(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria ={
            currPage:this.page+1
        };
        if(this.page>this.totalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.componentService.showToastMessage('All Asset Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(()=>{
                this.assetService.searchAssets(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad jobs list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.assetList.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.componentService.closeLoader();
                    },
                    error=>{
                        console.log('ionViewDidLoad Jobs Page:'+error);
                    }
                );
                infiniteScroll.complete();
            },1000);
        }


    }
}
