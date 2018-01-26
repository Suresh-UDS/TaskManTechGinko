import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {CreateRateCardPage} from "./create-rate-card";

@Component({
  selector: 'page-rate-card',
  templateUrl: 'rate-card.html'
})
export class RateCardPage {

    constructor(public navCtrl: NavController,public component:componentService, public authService: authService, private loadingCtrl:LoadingController) {

    }

    ionViewDidLoad() {

    }

    createRate()
    {
        this.navCtrl.push(CreateRateCardPage);
    }

}
