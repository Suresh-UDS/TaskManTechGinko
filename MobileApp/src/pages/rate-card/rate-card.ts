import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {CreateRateCardPage} from "./create-rate-card";
import {QuotationService} from "../service/quotationService";

declare var demo;

@Component({
  selector: 'page-rate-card',
  templateUrl: 'rate-card.html'
})
export class RateCardPage {

    rateCards:any;
    fakeRateCards: Array<any> = new Array(12);

    constructor(public navCtrl: NavController,public component:componentService, public authService: authService, private loadingCtrl:LoadingController, private quotationService: QuotationService) {

    }

    ionViewDidLoad() {

    }

    createRate()
    {
        this.navCtrl.push(CreateRateCardPage);
    }

    ionViewWillEnter(){
        this.quotationService.getRateCards().subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                }else{
                    console.log(response);
                    this.rateCards = response;
                }

            }
        )
    }



}
