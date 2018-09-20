import { Component } from '@angular/core';
import {NavController, NavParams, ModalController} from "ionic-angular";
import {TransactionPage} from "./transaction";
import {ExpenseDetails} from "../expense-details/expense-details";
import {AddExpense} from "../expense/add-expense/add-expense";
import {ExpenseService} from "../service/expenseService";
import {SiteService} from "../service/siteService";

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
  page :1;
  pageSort:15;
  spinner:any;
  siteList:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,
              private expenseService: ExpenseService, private siteService: SiteService) {

    // this.listitem = [
    //   {id:'1',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,20,000',actions:''},
    //   {id:'2',site:'UDS',trans_type:'Debit',debit:'50,000',credit:'-',balance:'70,000',actions:''},
    //   {id:'3',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,70,000',actions:''},
    // ]

      this.siteList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Expense');

    this.getSites();

    // var searchCriteria ={
    //   currPage:this.page,
    //   pageSort:this.pageSort
    // };
    // this.expenseList(searchCriteria);
  }

    viewExpenseDetails(site){
    console.log('ionViewDidLoad ExpenseDetails method:');
    console.log(site);
    this.navCtrl.push(ExpenseDetails,{site:site});
  }

  expenseList(searchCriteria){
      this.spinner = true;
      this.expenseService.searchExpenses(searchCriteria).subscribe(
        response=>{
          this.spinner=false;
          console.log("Getting Expense List");
          console.log(response);
          this.listitem = response;
        },err=>{
          this.spinner=false;
          console.log("Error in getting expense List");
          console.log(err);
        }
      )
  }

    addExpenseModal() {
        const modal = this.modalCtrl.create(AddExpense);
        modal.present();
    }

    getSites(){
        this.spinner = true;

        this.siteService.searchSite().subscribe(
          response=>{
              console.log(response);
              this.siteList = response.json();

              for(let site of this.siteList){
                  console.log(site.name);
                  this.expenseService.getOverallData(site.id).subscribe(
                      response=>{
                          console.log("Overall data response");
                          console.log(response);
                          site.name = response.siteName;
                          site.id = response.siteId;
                          site.totalBalanceAmount = response.totalBalanceAmount;
                          site.totalCreditAmount = response.totalCreditAmount;
                          site.totalDebitAmount = response.totalDebitAmount;
                          this.spinner=false;

                      }
                  )
              }
          },err=>{
              this.spinner=false;
            }
      )
    }

}
