import { Component } from '@angular/core';
import {NavController, NavParams, ModalController} from "ionic-angular";
import {AddInventoryTransaction} from "../add-inventory-transaction/add-inventory-transaction";
import {InventoryService} from "../service/inventoryService";
import {componentService} from "../service/componentService";

/**
 * Generated class for the Inventorytransaction page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-inventorytransaction',
  templateUrl: 'inventorytransaction.html',
})
export class InventoryTransaction {
  msg: string;
  materialDetail: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              public inventoryService: InventoryService,public component: componentService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Inventorytransaction');
    this.materialDetail = this.navParams.get('m')
    console.log('ionViewDidLoad TransactionPage');
    console.log(this.materialDetail.name);
    this.loadTransaction();
  }

  loadTransaction(){
    var search = {siteId:this.materialDetail.siteId,
                  materialId:this.materialDetail.materialId
    };
    this.inventoryService.inventoryTransactionList(search).subscribe(response=>{
      console.log("selected transaction");
      console.log(response);

    },
      error=>{
            console.log(error);
        if(error.type==3)
        {
          this.msg='Server Unreachable'
        }
        this.component.showToastMessage(this.msg,'bottom');

      }
    )
  }

  openTransaction()
  {
    let modal = this.modalCtrl.create(AddInventoryTransaction, {});
    modal.present();

  }

}
