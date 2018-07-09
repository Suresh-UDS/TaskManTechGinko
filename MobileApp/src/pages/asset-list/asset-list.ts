import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {ScanQR} from "./scanQR";
import {AssetService} from "../service/assetService";
import {componentService} from "../service/componentService";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
// import {win} from "@angular/platform-browser/src/browser/tools/browser";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SiteService} from "../service/siteService";
import {DBService} from "../service/dbService";
import {Network} from "@ionic-native/network";
import { Diagnostic } from '@ionic-native/diagnostic';

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
    open:any;
    qr:any;
    assetDetails:any;

    sites:any;
    test:any;
    database:any;
    asset:any;
    db:any;
  constructor(public modalCtrl:ModalController,private diagnostic: Diagnostic,private sqlite: SQLite,public componentService:componentService, public navCtrl: NavController, public navParams: NavParams, public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService,public dbService:DBService) {
    this.assetList = [];
    this.test = [];
    this.searchCriteria = {};
    // this.qr = this.navParams.get('qr')


  }

  ionViewWillEnter()
  {

  }

  ionViewDidLoad() {

      console.log('ionViewDidLoad AssetList');
      this.componentService.showLoader("Loading Assets")




    this.open = true;
      // After Set Pagination
      // var searchCriteria={}
      // this.getAsset(searchCriteria)



          //offline
      setTimeout(() => {
          this.dbService.getAsset().then(
              (res)=>{
                  this.componentService.closeLoader()
                  console.log(res)
                  this.assetList = res;
                  // this.dbService.setAMC();
                  // this.dbService.setPPM();
                  // this.dbService.setConfig();
                  // this.dbService.setJobs();
                  // this.dbService.setSites();
              },
              (err)=>{

              })
      },3000)



              //online
              // this.assetService.findAllAssets().subscribe(
              //     response=>{
              //         this.componentService.closeLoader()
              //         console.log(response);
              //         this.assetList = response;
              //     },
              //     error=>{
              //         console.log("")
              //     }
              // );


      if(this.navParams.get('text'))
      {
          this.componentService.closeLoader();
          var text = this.navParams.get('text');


          // this.dbService.getAssetByCode(text).then(
          this.assetService.getAssetByCode(text).subscribe(
              response=>{
                  this.componentService.showToastMessage('Asset found, navigating..','bottom')
                  console.log("Search by asset code response");
                  console.log(response);
                  window.document.querySelector('ion-app').classList.add('transparentBody')
                  // this.navCtrl.setRoot(AssetList,{assetDetails:response,qr:true});
                  this.navCtrl.push(AssetView,{assetDetails:response});

              },
              err=>{
                  console.log("Error in getting asset by code");
                  console.log(err);
                  this.componentService.showToastMessage('Asset not found, please try again','bottom')
              }
          )



      }

  }



    setDataSync()
    {
        this.componentService.showLoader("Data Sync");
        this.dbService.setAsset().then(
            response=>{
                console.log(response)
                this.dbService.setPPM().then(
                    response=>{
                        console.log(response)
                        this.dbService.setAMC().then(
                            response=>{
                                console.log(response)
                                this.dbService.setConfig().then(
                                    response=>{
                                        console.log(response)
                                        this.dbService.setJobs().then(
                                            response=>{
                                                console.log(response)
                                                this.dbService.setTickets().then(
                                                    response=> {
                                                        console.log(response)
                                                        this.dbService.setSites().then(
                                                            response=> {
                                                                console.log(response)
                                                                this.dbService.setEmployee().then(
                                                                    response=> {
                                                                        console.log(response)
                                                                        this.componentService.closeLoader()
                                                                    })
                                                            })

                                                    })

                                            })
                                    })
                            })
                    })
            })
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
      this.open = false;
      console.log("Opening filter modal");
      let modal = this.modalController.create(AssetFilter,{},{cssClass : 'asset-filter',showBackdrop : true});
      modal.onDidDismiss(data=>{
          console.log("Modal dismissed");
          this.open = true;
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


      // let modal = this.modalCtrl.create(ScanQR);
      // modal.present();
      //
      // modal.onDidDismiss(data => {
      //     this.viewAsset(data)
      // });
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
