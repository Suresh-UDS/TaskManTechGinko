import { Component } from '@angular/core';
import {NavController, NavParams, ModalController, ViewController} from "ionic-angular";
import {TransactionPage} from "../expense/transaction";
import {AddExpense} from "../expense/add-expense/add-expense";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public viewCtrl:ViewController) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetails');
  }

    viewTransaction(){
        console.log('ionViewDidLoad Transaction method:');
        this.navCtrl.push(TransactionPage);
    }

    addExpenseModal() {
        let modal = this.modalCtrl.create(AddExpense,{});
        modal.present();
    }

}
