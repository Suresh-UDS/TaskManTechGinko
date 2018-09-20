import { Component } from '@angular/core';
import {NavController, NavParams, ModalController, ViewController} from "ionic-angular";
import {TransactionPage} from "../expense/transaction";
import {AddExpense} from "../expense/add-expense/add-expense";
import {ExpenseService} from "../service/expenseService";
import {componentService} from "../service/componentService";

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
  spinner: any;
  category: any;
  amount: any;
  site: any;
  page:1;
  pageSort:15;
  details:any


  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public viewCtrl:ViewController,
              private expenseService: ExpenseService,private component:componentService)
  {

    this.site = this.navParams.get('site');

    this.details = {};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseDetails');
    console.log(this.site);

    console.log('site Id');
    console.log(this.site.id);

    var searchCriteria = {
      fromDate:new Date(),
      toDate: new Date(),
      siteId:this.site.id
    };

    this.component.showLoader("Please Wait..");
    this.expenseService.getCategoriesBySite(searchCriteria).subscribe(response=>{
      this.component.closeLoader();
      console.log("expense by categories");
      console.log(response);
      this.details = response;
    },err=>{
      this.spinner = false;
      console.log("Error in getting expense category by site");
      console.log(err);
    })

  }

    viewTransaction(category,detail){
        console.log('ionViewDidLoad Transaction method:');
        this.navCtrl.push(TransactionPage,{category:category,detail:detail});
    }

    addExpenseModal() {
        let modal = this.modalCtrl.create(AddExpense,{});
        modal.present();
    }

}
