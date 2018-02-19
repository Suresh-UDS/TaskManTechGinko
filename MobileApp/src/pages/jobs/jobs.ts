import { Component } from '@angular/core';
import {Events, Item, ItemSliding, LoadingController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {ViewJobPage} from "./view-job";
import {componentService} from "../service/componentService";
import {CreateJobPage} from "./add-job";
import { ActionSheetController } from 'ionic-angular'
import {CompleteJobPage} from "./completeJob";
import {JobService} from "../service/jobService";


@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html'
})
export class JobsPage {

    todaysJobs: any;
    allJobs:any;
    categories:any;
    loader:any;
    all="all";
    today="today";
    ref=false;
    count=0;
    userType:any;

    constructor(public navCtrl: NavController,public component:componentService, public authService: authService,
                    private loadingCtrl:LoadingController, private actionSheetCtrl: ActionSheetController, private jobService: JobService, public events:Events) {
        this.categories = 'today';
        this.loadTodaysJobs();

        this.events.subscribe('userType',(type)=>{
            console.log("User type event");
            console.log(type);
            this.userType = type;
        });
    }

    ionViewDidLoad() {
    }

    doRefresh(refresher,segment)
    {
        this.ref=true;
        if(segment=="today")
        {
            this.getTodaysJobs(this.ref);
            refresher.complete();
        }
        else if(segment=="all")
        {
            console.log("------------- segment attandance");
            this.getAllJobs(this.ref);
            refresher.complete();
        }

    }

    getTodaysJobs(ref)
    {
        if(this.todaysJobs)
        {
            if(ref)
            {
                this.loadTodaysJobs();
            }
            else
            {
                this.todaysJobs=this.todaysJobs;
            }
        }
        else
        {
            this.loadTodaysJobs();
        }
    }


    getAllJobs(ref)
    {
        if(this.allJobs)
        {
            if(ref)
            {
                this.loadAllJobs();
            }
            else
            {
                this.allJobs=this.allJobs;
            }
        }
        else
        {
            this.loadAllJobs();
        }
    }





    loadTodaysJobs(){
        this.component.showLoader('Getting Today\'s Jobs');
        this.jobService.getTodayJobs().subscribe(response=>{
            console.log("Todays jobs of current user");
            console.log(response);
            this.todaysJobs = response;
            this.component.closeLoader();
        },err=>{
            this.component.closeLoader();
            this.component.showToastMessage('Unable to fetch todays jobs','bottom');
        }
        )
    }

    loadAllJobs(){
        this.component.showLoader('Getting All Jobs');
        var search={};
        this.jobService.getJobs(search).subscribe(response=>{
            console.log("All jobs of current user");
            console.log(response);
            this.allJobs = response;
            this.component.closeLoader();
        },
            err=>{
            this.component.closeLoader();
            this.component.showToastMessage('Unable to fetch Jobs','bottom');
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

    compeleteJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    open(itemSlide: ItemSliding, item: Item,c)
    {
        this.count=c;
        if(c==1)
        {
            this.count=0;
            console.log('------------:'+this.count);
            this.close(itemSlide);
        }
        else
        {
            this.count=1;
            console.log('------------:'+this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
        }

    }
    close(item: ItemSliding) {
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
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
