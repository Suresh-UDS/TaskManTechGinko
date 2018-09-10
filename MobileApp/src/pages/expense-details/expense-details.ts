import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {TransactionPage} from "../expense/transaction";

/**
 * Generated class for the ExpenseDetails page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-expense-details',
  templateUrl: 'expense-details.html',
})
export class ExpenseDetails {

  constructor(public navCtrl: NavController, public navParams: NavParams) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetails');
  }

    viewTransaction(){
        console.log('ionViewDidLoad Transaction method:');
        this.navCtrl.push(TransactionPage);
    }

}
