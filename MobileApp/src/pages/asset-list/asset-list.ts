import {Component, Inject} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
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
import {OfflineAsset} from "../offline-asset/offline-asset";
import {ScanQRAsset} from "./scanQR-asset";
import{AlertController} from "ionic-angular";
import{JobService} from "../service/jobService";


declare  var demo;

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
    page:any;
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
    clientFilter:any;
    siteFilter:any;
    assetGroup:any;
    assetType:any;


    constructor(@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,private transfer: FileTransfer,
                public modalCtrl:ModalController,private diagnostic: Diagnostic,private sqlite: SQLite,
                public componentService:componentService, public navCtrl: NavController, public navParams: NavParams,
                public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService,
                public dbService:DBService,private network:Network,private alertCtrl:AlertController,private jobService:JobService) {
    this.assetList = [];
    this.test = [];
    this.searchCriteria = {};
    this.page = 1;
  }

  ionViewWillEnter()
  {

      if(this.navParams.get('text'))
      {

      }else{

          console.log("Check Network Connection");
          // this.componentService.showLoader("Loading Assets");

          var searchCriteria ={
              currPage:this.page
          };

          this.getAsset(searchCriteria)

      }

  }

  ionViewDidLoad() {

      console.log('ionViewDidLoad AssetList');
      this.open = true;
      if(this.navParams.get('text'))
      {
          var text = this.navParams.get('text');
          var searchCriteria ={
              currPage:this.page
          };
          this.getAsset(searchCriteria);
          this.assetService.getAssetByCode(text).subscribe(
              response=>{
                  if(response.errorStatus){
                      demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                  }else{
                      this.componentService.showToastMessage('Asset found, navigating..','bottom');
                      console.log("Search by asset code response");
                      console.log(response);
                      window.document.querySelector('ion-app').classList.add('transparentBody');
                      // this.navCtrl.setRoot(AssetList,{assetDetails:response,qr:true});
                      this.navCtrl.push(AssetView,{assetDetails:response}); //online
                      // this.navCtrl.push(AssetView,{assetDetails:response[0]}); //offline
                  }
              },
              err=>{
                  console.log("Error in getting asset by code");
                  console.log(err);
                  this.componentService.showToastMessage('Asset not found, please try again','bottom')
              }
          )
      }

  }

  saveReadingToServer(readings){
        return new Promise((resolve,reject)=>{
            for(var i=0;i<readings.length;i++)
            {
                this.assetService.saveReading({name:readings[i].name,uom:readings[i].uom,initialValue:readings[i].initialValue,finalValue:readings[i].finalValue,consumption:readings[i].consumption,assetId:readings[i].assetId,assetParameterConfigId:readings[i].assetParameterConfigId}).subscribe(
                    response => {
                        if(response.errorStatus){
                            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                        }else{
                            console.log("save reading sync to server");
                            console.log(response);
                            resolve("s")
                        }

                    },
                    error => {
                        console.log("save readings error sync to server");
                        reject("no")
                    })
            }

        })
    }

    setDataSync()
    {
        this.componentService.showLoader("Data Sync");
        this.dbService.getReading().then(
            response=> {
                console.log(response)
                    this.saveReadingToServer(response).then(
                        response=>{
                            this.dbService.dropReadingTable().then(
                                response=>{
                                            console.log(response);
                                            this.dbService.dropPPMJobTable().then(
                                                response=>{
                                                    console.log(response);
                                                    this.dbService.dropAMCJobTable().then(
                                                        response=>{
                                                            console.log(response);
                                                            this.setData().then(
                                                                response=>{
                                                                    console.log(response);
                                                                },
                                                                error=>{
                                                                    console.log(error)
                                                                })
                                                            })
                                                        }
                                                    )
                                                }
                                            );

                         },
                         error=>{
                            this.componentService.closeLoader();
                             this.componentService.showToastMessage("Error server sync","bottom")
                         })
            },error=>{
                this.setData().then(
                    response=>{
                        console.log(response);
                    },
                    error=>{
                        console.log(error)
                    })
            })
    }

    setData()
    {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                    this.dbService.setAsset().then(
                        response=>{
                            console.log(response)
                            this.dbService.getAsset().then(
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
                                                                     console.log(response);
                                                                    })
                                                                    // this.dbService.setPPMJobs().then(
                                                                    //     response=>{
                                                                    //         console.log(response)
                                                                    //         this.dbService.setAMCJobs().then(
                                                                    //             response=> {
                                                                                    console.log(response)
                                                                                    this.dbService.setTickets().then(
                                                                                        response => {
                                                                                            console.log(response)
                                                                                            // this.dbService.setSites().then(
                                                                                            //     response=> {
                                                                                            //         console.log(response)
                                                                                            // this.dbService.setEmployee().then(
                                                                                            //     response=> {
                                                                                            //         console.log(response)
                                                                                            this.dbService.setViewReading().then(
                                                                                                response => {
                                                                                                    console.log(response)
                                                                                                    this.dbService.setAssetPreviousReading().then(
                                                                                                        response => {
                                                                                                            console.log(response)
                                                                                                            resolve("data s")
                                                                                                            this.componentService.closeAll();
                                                                                                            demo.showSwal('success-message-and-ok','Success','Data Sync Successful');

                                                                                                        },err=>{
                                                                                                            this.componentService.closeAll();
                                                                                                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');

                                                                                                        })
                                                                                                },err=>{
                                                                                                    this.componentService.closeAll();
                                                                                                    demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                                                                                })
                                                                                            // })
                                                                                            // })
                                                                                        },err=>{
                                                                                            this.componentService.closeAll();
                                                                                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                                                                        })
                                                                                },err=>{
                                                                                            this.componentService.closeAll();
                                                                                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                                                                })
                                                                        },err=>{
                                                            this.componentService.closeAll();
                                                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                                                        })
                                                                },err=>{
                                                    this.componentService.closeAll();
                                                    demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                                                })
                                                        // })
                                                // })
                                },err=>{
                                    this.componentService.closeAll();
                                    demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                })
                        })


            },3000)
        })
    }


  getAsset(searchCriteria)
  {
      this.componentService.showLoader("Loading Assets");
      this.assetService.searchAssets(searchCriteria).subscribe(
          response=>{
              this.componentService.closeAll();
              console.log("Asset search filters response");
              console.log(response);
              this.assetList=response.transactions;
              this.page = response.currPage;
              this.totalPages = response.totalPages;
          },err=>{
              this.componentService.closeAll();
              console.log("Error in filtering assets");
              console.log(err);
          }
      )
  }

    openFilters() {
        let modal = this.modalCtrl.create(AssetFilter,{},{cssClass:'asset-filter',showBackdrop:true});
        modal.onDidDismiss(data=>{
            console.log("Modal Dismiss Asset");
            console.log(data);
            this.clientFilter=data.projectId;
            this.siteFilter=data.siteId;
            this.assetGroup=data.assetGroup;
            this.assetType=data.assetType;
            this.applyFilter(data.projectId,data.siteId,data.assetGroup,data.assetType);
        });
        modal.present();
    }


    applyFilter(project,site,group,type){
        this.componentService.showLoader("");
        var searchCriteria={
            siteId:site.id,
            projectId:project.id,
            assetGroupName:group,
            assetTypeName:type,
        };

        this.assetService.searchAssets(searchCriteria).subscribe(
            response=>{
                this.componentService.closeAll();
                console.log("Filtering Assets");
                console.log(response);
                this.assetList=response.transactions;
            },error=>{
                this.componentService.closeAll();
                console.log("Error in filtering Assets");
                console.log(error);
            }
        )

    }

  scanQRCode(){
      window.document.querySelector('ion-app').classList.add('transparentBody');
      this.qrScanner.prepare().then((status:QRScannerStatus)=>{
          console.log("Opening Scanner");
          this.qrScanner.show();
          let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
              console.log('Scanned Something',text);
              this.qrScanner.hide();
              scanSub.unsubscribe();
              window.document.querySelector('ion-app').classList.add('transparentBody');
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
      this.navCtrl.push(ScanQRAsset);
  }

  searchAssets(){

  }

    viewAsset(asset){
      console.log("asset");
      console.log(asset);
      this.navCtrl.push(AssetView,{assetDetails:asset});
    }

    // Pull to refresh
    doRefresh(refresher)
    {
        this.componentService.showLoader("");
        var searchCriteria={};
        this.getAsset(searchCriteria);
        refresher.complete()
    }

    // Scroll
    doInfiniteAsset(infiniteScroll){
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
                        console.log('ionViewDidLoad Asset list:');
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
                        console.log('ionViewDidLoad Asset-list Page:'+error);
                    }
                );
                infiniteScroll.complete();
            },1000);
        }


    }

}
