import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventoryMaster');
  }

}
