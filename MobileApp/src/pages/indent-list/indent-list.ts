import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {IndentView} from "../indent-view/indent-view";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{InventoryMaster} from "../inventory-master/inventory-master";
import{Indent} from "../indent/indent";

/**
 * Generated class for the IndentList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-indent-list',
  templateUrl: 'indent-list.html',
})
export class IndentList {

  isLoading : boolean;
    page:any;
    pageSort:any;
    indentMaterial:any;
    spinner:any;
    fakeList : Array<any> = new Array(12);

  constructor(public navCtrl: NavController, public navParams: NavParams,private purchaseService:PurchaseRequisitionService) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndentList');
    this.page = 1;
    this.pageSort = 15;
   var searchCriteria={
       currPage:this.page,
       pageSort:this.pageSort,
       columnName:"indentRefNumber",
       sortByAsc:true
   };
      this.searchMaterial(searchCriteria);


  }

    viewDetails(details)
    {
        this.navCtrl.push(IndentView,{indentDetails:details});
    }

    searchMaterial(searchCriteria)
    {
        this.spinner=true;
        this.isLoading = true;
        console.log("Search criteria indent search");
        console.log(searchCriteria);
        this.purchaseService.searchMaterialIndents(searchCriteria).subscribe(
            response=>{
                this.spinner=false;
                this.isLoading = false;
                console.log("Getting Material Indent");
                console.log(response);
                this.indentMaterial=response.transactions;
            },err=>{
                this.spinner=false;
                console.log("Error in getting Material Indent")
                console.log(err);
            }
        )
    }

    addTransaction()
    {
        this.navCtrl.push(Indent);
    }


}
