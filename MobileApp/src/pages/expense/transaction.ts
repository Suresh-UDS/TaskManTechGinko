import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";



@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {

  trans_list : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.trans_list = [
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Transaction');
  }

}
