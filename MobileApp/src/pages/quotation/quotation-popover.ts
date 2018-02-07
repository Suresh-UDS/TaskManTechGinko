import { Component } from '@angular/core';
import {NavController, PopoverController, ViewController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CreateQuotationPage2} from "./create-quotation-step-2";
import {QuotationService} from "../service/quotationService";

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
  eMsg:any;
  field:any;
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public authService:authService,public viewCtrl: ViewController,
              private quotationService:QuotationService
              ) {
    this.addrates={type:'',name:'',no:1,cost:0,uom:'',total:0}
  }
  ionViewWillEnter(){
    this.getRateCardTypes();
  }
  getRateCardTypes(){
    this.quotationService.getRateCardTypes().subscribe(response=>{
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

    if(this.name && this.cost)
    {
      this.addrates={type:this.type,name:this.name,no:1,cost:this.cost,uom:this.selectedUOM,total:this.cost};
      console.log(this.addrates);
      // this.navCtrl.push(CreateQuotationPage2,{rates:this.addrates})
      this.viewCtrl.dismiss(this.addrates);
    }
    else
    {
      if(!this.name)
      {
        this.eMsg="name";
        this.field="name";
      }
      else if(!this.cost)
      {
        this.eMsg="cost";
        this.field="cost";
      }

    }


  }

}
