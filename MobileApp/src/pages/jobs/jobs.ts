import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {ViewJobPage} from "./view-job";
import {componentService} from "../service/componentService";
import {CreateJobPage} from "./add-job";
import { ActionSheetController } from 'ionic-angular'
import {CompleteJobPage} from "./completeJob";

@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html'
})
export class JobsPage {

    todaysJobs: any;
    allJobs:any;
    categories:any;
    loader:any;

    constructor(public navCtrl: NavController,public component:componentService, public authService: authService,
                    private loadingCtrl:LoadingController, private actionSheetCtrl: ActionSheetController) {
        this.categories = 'today';
    }

    ionViewWillEnter() {

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

    presentActionSheet(job){
        let actionSheet = this.actionSheetCtrl.create({
            title:'Job',
            buttons:[
                {
                    text:'View Job',

                    handler:()=>{
                        console.log("view job");
                        this.navCtrl.push(ViewJobPage,{job:job})
                    }
                },
                {
                    text:'Edit job',
                    handler:()=>{
                        console.log('edit job');
                    }
                },

                {
                    text:'Complete Job',
                    handler:()=>{
                        console.log('Complete job');
                        this.navCtrl.push(CompleteJobPage,{job:job})
                    }
                },

                {
                    text:'Cancel',
                    role:'cancel',
                    handler:()=>{
                        console.log("Cancel clicker");
                    }
                }
            ]
        });

        actionSheet.present();
    }
}
