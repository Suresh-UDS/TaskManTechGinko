import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {QuotationService} from "../service/quotationService";

declare var demo;

@Component({
  selector: 'page-create-rate-card',
  templateUrl: 'create-rate-card.html'
})
export class CreateRateCardPage {

    jobDetails:any;
    rateCardTypes:any;
    rateCardDetails:{
        type:any;
        title:any;
        cost:any;
        uom:any;
        number:any;
    };

    uom:any;
    eMsg:any;
    field:any;
    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController, private quotationService: QuotationService) {
        this.rateCardDetails={
            type:'',
            title:'',
            cost:'',
            uom:'',
            number:''
        }
    }

    ionViewDidLoad() {

    }

    ionViewWillEnter(){
        this.quotationService.getRateCardTypes().subscribe(response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
            }else{
                console.log("Rate Card types");
                console.log(response);
                this.rateCardTypes = response;
            }

        })
    }

    createRateCard(rateCard){

        if(this.rateCardDetails.title && this.rateCardDetails.cost)
        {

            rateCard.uom = this.uom;
            this.quotationService.createRateCard(rateCard).subscribe(response => {
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                }else{
                    console.log(response);
                    this.navCtrl.pop();
                }

            })
        }
        else
        {
            if(!this.rateCardDetails.title)
            {
                this.eMsg="title";
                this.field="title";
            }
            else if(!this.rateCardDetails.cost)
            {
                this.eMsg="title";
                this.field="cost";
            }
            else if(!this.rateCardDetails.title && !this.rateCardDetails.cost)
            {
                this.eMsg="all";
            }
        }
    }

    rateCardUOM(rateCardType){
        this.uom = rateCardType;
        console.log("Rate Card types");
        console.log(this.uom);
    }


}
