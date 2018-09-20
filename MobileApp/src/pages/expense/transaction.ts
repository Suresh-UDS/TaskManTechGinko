import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ExpenseService} from "../service/expenseService";



@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
    category: any;

    trans_list : any;
    private details: any;
    searchCriteria:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public expenseService: ExpenseService) {

    this.trans_list = [
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
      {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Transaction');
      this.details = this.navParams.get('detail');
      this.category = this.navParams.get('category');
      this.searchCriteria = {
          siteId:this.details.siteId,
          expenseCategory:this.category.category
      }

      this.expenseService.getCategoryWiseTransactions(this.searchCriteria).subscribe(
          response=>{
              console.log(response);
              this.trans_list = response;
          },err=>{
              console.log("Error in getting details");

              console.log(err);
          }
      )
  }



}
