import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {TransactionPage} from "./transaction";
import {ExpenseDetails} from "../expense-details/expense-details";

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {

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

}
