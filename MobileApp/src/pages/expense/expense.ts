import { Component } from '@angular/core';
import {NavController, NavParams, ModalController} from "ionic-angular";
import {TransactionPage} from "./transaction";
import {ExpenseDetails} from "../expense-details/expense-details";
import {AddExpense} from "../expense/add-expense/add-expense";
import {ExpenseService} from "../service/expenseService";
import {SiteService} from "../service/siteService";
import {SelectSearchableComponent} from "ionic-select-searchable";
import {componentService} from "../service/componentService";

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
  clientList: any;
  msg: string;

  listitem : any;
  page :1;
  pageSort:15;
  spinner:any;
  siteList:any;
  selectedProject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,
              private expenseService: ExpenseService, private siteService: SiteService,private component:componentService) {

    // this.listitem = [
    //   {id:'1',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,20,000',actions:''},
    //   {id:'2',site:'UDS',trans_type:'Debit',debit:'50,000',credit:'-',balance:'70,000',actions:''},
    //   {id:'3',site:'UDS',trans_type:'Credit',debit:'-',credit:'1,00,000',balance:'1,70,000',actions:''},
    // ]

      this.siteList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Expense');
    this.component.showLoader('Getting Project');
    this.siteService.getAllProjects().subscribe(
      response => {
        this.component.closeLoader();
        console.log("project");
        console.log(response);
        this.clientList = response;
        // this.selectedProject = this.clientList[0];
        // this.selectSite(this.selectedProject);
        console.log('select default value:');
      },
      error => {
        this.component.closeLoader();
        if (error.type == 3) {
          this.msg = 'Server Unreachable'
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )

    // this.getSites();

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
  
  siteChange(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    this.spinner = true;
    this.selectedProject = event.value;
    this.siteService.findSitesByProject(event.value.id).subscribe(
      response=>{
        this.spinner=false;
        console.log("sitelist");
        console.log(response);
        this.siteList = response;

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

            }
          )
        }
      },err=>{
        this.spinner=false;
        console.log("error in getting overall data response");
        console.log(err);
      }
    )
  }

  addExpenseModal() {
    let modal = this.modalCtrl.create(AddExpense,{});
    modal.present();
  }

   /* getSites(){
        this.spinner = true;
        console.log(this.siteList.length);
        this.siteService.searchSite().subscribe(
          response=>{
            this.spinner=false;
            console.log("sitelist");
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

                      }
                  )
              }
          },err=>{
              this.spinner=false;
              console.log("error in getting overall data response");
            console.log(err);
          }
      )
    }*/

}
