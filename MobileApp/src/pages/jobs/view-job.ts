import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";

@Component({
  selector: 'page-view-job',
  templateUrl: 'view-job.html'
})
export class ViewJobPage {

    jobDetails:any;


    constructor(public navCtrl: NavController,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController) {
        this.jobDetails=this.navParams.get('job');
    }

    ionViewWillEnter() {

    }


}
