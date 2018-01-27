import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {ViewJobPage} from "./view-job";
import {componentService} from "../service/componentService";
import {CreateJobPage} from "./add-job";

@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html'
})
export class JobsPage {

    todaysJobs: any;
    allJobs:any;
    categories:any;
    loader:any;

    constructor(public navCtrl: NavController,public component:componentService, public authService: authService, private loadingCtrl:LoadingController) {
        this.categories = 'today';
    }

    ionViewDidLoad() {
        this.getTodaysJobs();
        this.getAllJobs();
    }

    doRefresh(refresher)
    {
        this.getTodaysJobs();
        this.getAllJobs();
        refresher.complete();
    }

    getTodaysJobs(){
        this.component.showLoader('Getting Today\'s Jobs');
        this.authService.getTodayJobs().subscribe(response=>{
            console.log("Todays jobs of current user");
            console.log(response);
            this.todaysJobs = response;
            this.component.closeLoader();
        })
    }

    getAllJobs(){
        this.component.showLoader('Getting All Jobs');
        var search={};
        this.authService.getJobs(search).subscribe(response=>{
            console.log("All jobs of current user");
            console.log(response);
            this.allJobs = response;
            this.component.closeLoader();
        })
    }

    addJob()
    {
        this.navCtrl.push(CreateJobPage);
    }

    viewJob(job)
    {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(ViewJobPage,{job:job})
    }
}
