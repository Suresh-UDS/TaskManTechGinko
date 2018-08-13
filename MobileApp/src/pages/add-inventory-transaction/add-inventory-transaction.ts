import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{WheelSelector} from "@ionic-native/wheel-selector";

/**
 * Generated class for the AddInventoryTransaction page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-inventory-transaction',
  templateUrl: 'add-inventory-transaction.html',
})
export class AddInventoryTransaction {

    numbers:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private selector:WheelSelector) {

      this.numbers = [0,1,2,3,4,5,6,7,8,9,10];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInventoryTransaction');
  }

    dismiss()
    {
      this.navCtrl.pop();
    }

    selectNumber() {
        this.selector.show({
            title: "How Many?",
            items: [this.numbers],
        })
    }

}
