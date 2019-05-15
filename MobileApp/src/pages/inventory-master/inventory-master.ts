import {Component, Inject} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams,ViewController} from "ionic-angular";
import{InventoryFilter} from "../inventory-filter/inventory-filter";
import {componentService} from "../service/componentService";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import {FileTransferObject, FileTransfer} from "@ionic-native/file-transfer";
import {SQLite} from "@ionic-native/sqlite";
import {QRScanner} from "@ionic-native/qr-scanner";
import {AssetService} from "../service/assetService";
import {Network} from "@ionic-native/network";
import {DBService} from "../service/dbService";
import {Diagnostic} from "@ionic-native/diagnostic";
import{AddInventoryTransaction} from "../add-inventory-transaction/add-inventory-transaction";
import{InventoryService} from "../service/inventoryService";
import{Indent} from "../indent/indent";
import {InventoryTransaction} from "../inventorytransaction/inventorytransaction";

/**
 * Generated class for the InventoryMaster page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-inventory-master',
  templateUrl: 'inventory-master.html',
})
export class InventoryMaster {

    searchCriteria:any;
    page:1;
    totalPages:0;
    open:any;
    qr:any;
    pageSort:15;



    database:any;
    db:any;
    fileTransfer: FileTransferObject = this.transfer.create();
    material:any;
    spinner:any;
    transactionlist: any;

    filterProject:any;
    filterSite:any;

  constructor(@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,private transfer: FileTransfer,
              public modalCtrl:ModalController,private diagnostic: Diagnostic,private sqlite: SQLite,
              public componentService:componentService, public navCtrl: NavController, public navParams: NavParams,
              public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService,
              public dbService:DBService,private network:Network,private alertCtrl:AlertController,private inventoryService:InventoryService,
              public viewCtrl:ViewController
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventoryMaster');
    var searchCriteria={
        currPage:this.page,
        pageSort: this.pageSort
    };
    this.inventoryMaterial(searchCriteria);
  }

    openFilter()
    {
        this.open = false;
        console.log("Opening filter modal");
        let modal = this.modalController.create(InventoryFilter,{},{cssClass : 'asset-filter',showBackdrop : true});
        modal.onDidDismiss(data=>{
            console.log("Modal dismissed");
          if(data){
            this.open = true;
            console.log(data);
            this.filterProject=data.project;
            this.filterSite=data.site;
            this.applyFilter(data.project,data.site);
            }
            // this.assetService.searchAssets(searchCriteria).subscribe(
            //     response=>{
            //         this.componentService.closeLoader();
            //         console.log("Asset search filters response");
            //         console.log(response)
            //     },err=>{
            //         this.componentService.closeLoader();
            //         console.log("Error in filtering assets");
            //         console.log(err);
            //     }
            // )
            // this.getAsset(searchCriteria);

        });
        modal.present();

    }




   inventoryMaterial(searchCriteria){
      this.spinner=true;
      this.inventoryService.getMaterials(searchCriteria).subscribe(
          response=>{
              this.spinner=false;
              console.log("Getting Inventory Materials");
              console.log(response);
              this.material=response.transactions;
          },err=>{
              this.spinner=false;
              console.log("Error in Getting Inventory Materials");
              console.log(err);
          }
      )
   }

  viewSelectedTransaction(m){
     console.log('ionViewDidLoad selected material transaction');
     console.log(m);
     this.navCtrl.push(InventoryTransaction,{m:m});
  }

    applyFilter(project,site)
    {
      if(project&site){
        console.log("applyfilter")
        this.componentService.showLoader("");
        var searchCriteria = {
            siteId:site.id,
            projectId:project.id
        };

        this.inventoryService.inventorySearch(searchCriteria).subscribe(
            response=>{
                this.componentService.closeAll();
                console.log("Apply Filter Successfully");
                console.log(response);
                this.material=response.transactions;

            },err=>{
                this.componentService.closeAll();
                console.log("Error in apply filter");
                console.log(err);
            }

        )

      }

        // this.searchCriteria={};
        // // this.searchCriteria = {
        // //     siteId:this.selectedSite.id,
        // //     projectId:this.selectedProject.id,
        // //     assetType:this.selectedAssetType,
        // //     assetGroup:this.selectedAssetGroup
        // // };
        // if(this.selectedProject){
        //     this.searchCriteria.projectId=this.selectedProject;
        // }
        // if(this.selectedSite){
        //     this.searchCriteria.siteId=this.selectedSite;
        // }
        // console.log(this.searchCriteria);

        // this.viewCtrl.dismiss(this.searchCriteria);


    }


}
