import { Component } from '@angular/core';
import {NavController, NavParams, ModalController} from "ionic-angular";
import {TransactionPage} from "./transaction";
import {ExpenseDetails} from "../expense-details/expense-details";
import {AddExpense} from "../expense/add-expense/add-expense";

/**
 * Generated class for the Expense page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html',
})
export class ExpensePage {

  listitem : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController) {

    this.listitem = [
      {id:'1',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,20,000',actions:''},
      {id:'2',site:'UDS',trans_type:'Debit',debit:'50,000',credit:'-',balance:'70,000',actions:''},
      {id:'3',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,70,000',actions:''},
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Expense');
  }

    viewExpenseDetails(){
    console.log('ionViewDidLoad ExpenseDetails method:');
    this.navCtrl.push(ExpenseDetails);
  }

    addExpenseModal() {
        const modal = this.modalCtrl.create(AddExpense);
        modal.present();
    }

}
