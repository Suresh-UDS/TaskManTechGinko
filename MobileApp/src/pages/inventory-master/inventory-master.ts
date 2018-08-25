import {Component, Inject} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams} from "ionic-angular";
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

  constructor(@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,private transfer: FileTransfer,
              public modalCtrl:ModalController,private diagnostic: Diagnostic,private sqlite: SQLite,
              public componentService:componentService, public navCtrl: NavController, public navParams: NavParams,
              public modalController:ModalController, public qrScanner:QRScanner, public assetService:AssetService,
              public dbService:DBService,private network:Network,private alertCtrl:AlertController,private inventoryService:InventoryService
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
            this.open = true;
            console.log(data);
            var searchCriteria = {
                siteId:data.siteId,
                projectId:data.projectId,
            };
            this.assetService.searchAssets(searchCriteria).subscribe(
                response=>{
                    this.componentService.closeLoader();
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


    openTransaction()
    {
        let modal = this.modalCtrl.create(AddInventoryTransaction, {});
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


}
