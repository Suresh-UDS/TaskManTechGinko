import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {CreateRateCardPage} from "./create-rate-card";
import {QuotationService} from "../service/quotationService";

@Component({
  selector: 'page-rate-card',
  templateUrl: 'rate-card.html'
})
export class RateCardPage {

    rateCards:any;

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
                console.log(response);
                this.rateCards = response;
            }
        )
    }



}
