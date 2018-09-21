import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from "ionic-angular";
import {ExpenseService} from "../service/expenseService";
import {QuotationImagePopoverPage} from "../quotation/quotation-image-popover";



@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html',
})
export class TransactionPage {
    category: any;

    trans_list : any;
    categoryType: any;
    private details: any;
    searchCriteria:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public expenseService: ExpenseService,
              public  popoverCtrl: PopoverController) {

    this.trans_list = [];
    //   {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
    //   {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''},
    //   {id:1,date:'09/08/2018',site:'Test Site',description:'Travel chennai to coimbatore',receipt_no:'14450',expense_type:'travel',billable:'yes',reimbursable:'yes',payment_type:'cash',actions:''}
    // ]


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Transaction');
      this.details = this.navParams.get('detail');
      this.category = this.navParams.get('category');
    this.categoryType = this.category.category;
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

  viewImage(index,img)
  {
    let popover = this.popoverCtrl.create(QuotationImagePopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:false});
    popover.present({

    });


    popover.onDidDismiss(data=>
    {
      // this.takenImages.pop(data);
    })
  }



}
