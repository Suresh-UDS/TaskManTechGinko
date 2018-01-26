import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";

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
    };


    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController) {
        this.rateCardDetails={
            type:'',
            title:'',
            cost:'',
            uom:''
        }
    }

    ionViewDidLoad() {

    }

    ionViewWillEnter(){
        this.authService.getRateCardTypes().subscribe(response=>{
            console.log("Rate Card types");
            console.log(response);
            this.rateCardTypes = response;
        })
    }

    createRateCard(rateCard){
        this.authService.createRateCard(rateCard).subscribe(response=>{
            console.log(response);
        })
    }

    rateCardUOM(rateCardType){
        this.rateCardDetails.uom = rateCardType.uom;
    }


}
