import { Component } from '@angular/core';
import {NavController, PopoverController, ViewController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CreateQuotationPage2} from "./create-quotation-step-2";

@Component({
  selector: 'page-quotation-popover',
  templateUrl: 'quotation-popover.html'
})
export class QuotationPopoverPage {
  rateCardTypes:any;
  name:any;
  type:any;
  cost:any;
  selectedType:any;
  selectedUOM:any;
  addrates:any;
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public authService:authService,public viewCtrl: ViewController) {
    this.addrates={type:'',name:'',cost:'',uom:''}
  }
  ionViewWillEnter(){
    this.getRateCardTypes();
  }
  getRateCardTypes(){
    this.authService.getRateCardTypes().subscribe(response=>{
      console.log("Rate Card types");
      this.rateCardTypes = response;
      console.log(this.rateCardTypes);
    })
  }
  selectUOMType(type){
        this.selectedType=type.name;
        this.selectedUOM = type.uom;
  }
  addRates()
  {
    this.addrates={type:this.type,name:this.name,cost:this.cost,uom:this.selectedUOM}
    console.log(this.addrates);
    // this.navCtrl.push(CreateQuotationPage2,{rates:this.addrates})
      this.viewCtrl.dismiss(this.addrates);
  }

}
