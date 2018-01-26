import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";

@Component({
  selector: 'page-create-rate-card',
  templateUrl: 'create-rate-card.html'
})
export class CreateRateCardPage {

    jobDetails:any;


    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController) {

    }

    ionViewDidLoad() {

    }


}
