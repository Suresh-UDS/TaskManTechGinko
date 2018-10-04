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
  title:any;
  unitPrice:any;
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
    // this.addrates={type:'',name:'',qty:1,cost:0,uom:'',total:0}
    this.addrates={type:'',title:'',qty:1,unitPrice:0,uom:'',cost:0}
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

    if(this.name && this.unitPrice && this.type)
    {
      this.addrates={
          type:this.type,
          title:this.name,
          qty:1,
          unitPrice:this.unitPrice,
          uom:this.selectedUOM,
          cost:this.unitPrice
      };
      console.log(this.addrates);
      // this.navCtrl.push(CreateQuotationPage2,{rates:this.addrates})
      this.viewCtrl.dismiss(this.addrates);
    }
    else
    {
      if(!this.type)
      {
        this.eMsg="type";
        this.field="type";
      }
      else  if(!this.name)
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

  close()
  {
    this.viewCtrl.dismiss();
  }

}
