import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";

@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html'
})
export class JobsPage {

    todaysJobs: any;
    allJobs:any;
    categories:any;
    loader:any;

    constructor(public navCtrl: NavController, public authService: authService, private loadingCtrl:LoadingController) {
        this.categories = 'today';
    }

    ionViewWillEnter() {

    }

    showLoader(msg){
        this.loader = this.loadingCtrl.create({
            content:msg
        });
        this.loader.present();
    }

    closeLoader(){
        this.loader.dismiss();
    }

    getTodaysJobs(){
        this.showLoader('Getting Today\'s Jobs');
        this.authService.getTodayJobs().subscribe(response=>{
            console.log("Todays jobs of current user");
            console.log(response);
            this.todaysJobs = response;
            this.closeLoader();
        })
    }

    getAllJobs(){
        this.showLoader('Getting All Jobs');
        this.authService.getJobs().subscribe(response=>{
            console.log("All jobs of current user");
            console.log(response);
            this.allJobs = response;
            this.closeLoader();
        })
    }
}
