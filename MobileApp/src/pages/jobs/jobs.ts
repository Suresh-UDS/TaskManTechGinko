import { Component } from '@angular/core';
import {Events, Item, ItemSliding, LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {ViewJobPage} from "./view-job";
import {componentService} from "../service/componentService";
import {CreateJobPage} from "./add-job";
import { ActionSheetController } from 'ionic-angular'
import {CompleteJobPage} from "./completeJob";
import {JobService} from "../service/jobService";
import{ModalController} from "ionic-angular";
import{JobFilter} from "./job-filter/job-filter";
import {ScanQR} from "./scanQR";

@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html'
})
export class JobsPage {
    scannedSiteId: any;
    scannedZone: any;
    scannedFloor: any;
    scannedBlock: any;

    todaysJobs: any;
    allJobs:any;
    categories:any;
    loader:any;
    all="all";
    today="today";
    ref=false;
    count=0;
    userType:any;
    spinner:boolean;

    page:1;
    totalPages:0;
    todaysPage:1;
    todaysTotalPages:0;
    pageSort:15;

    searchCriteria:any;
    private scannedLocationId: any;

    constructor(public navCtrl: NavController, public navParams:NavParams,public component:componentService, public authService: authService,
                    private loadingCtrl:LoadingController, private actionSheetCtrl: ActionSheetController, private jobService: JobService, public events:Events,public modalCtrl:ModalController) {
        this.allJobs = [];
        this.todaysJobs =[];
        this.categories = 'today';

        this.events.subscribe('userType',(type)=>{
            console.log("User type event");
            console.log(type);
            this.userType = type;
        });

        console.log("Location Id from scanned",this.navParams.get('locationId'));
        this.scannedLocationId = this.navParams.get('locationId');
        console.log("Location Id from scanned",this.navParams.get('siteId'));
        console.log(this.scannedLocationId);
        console.log(this.scannedSiteId);
        this.scannedSiteId = this.navParams.get('siteId');

        this.scannedBlock = this.navParams.get('block');
        this.scannedFloor = this.navParams.get('floor');
        this.scannedZone = this.navParams.get('zone');


        this.loadTodaysJobs();


    }

    ionViewDidLoad() {
      this.loadTodaysJobs();
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

        var searchCriteria = {};
        var msg='';
        if(this.scannedBlock && this.scannedFloor && this.scannedZone){

            console.log("No location id present");
            console.log(this.scannedBlock);
            searchCriteria={
                checkInDateTimeFrom:new Date(),
                siteId:this.scannedSiteId,
                block:this.scannedBlock,
                floor:this.scannedFloor,
                zone:this.scannedZone,
                schedule:"ONCE",
                currPage:1,
                columnName:"plannedStartTime",
                sortByAsc:true,
                report:false,
                sort:10

            };
            msg = 'Unable to fetch jobs for the location '+this.scannedBlock+' - '+this.scannedFloor+' - '+this.scannedZone;
        }else{
            console.log("Scanned location Id or block floor zone not available");
            searchCriteria = {
                checkInDateTimeFrom:new Date(),
                locationId:this.scannedLocationId,
                siteId:this.scannedSiteId,
                schedule:"ONCE"
            };
            msg='Unable to fetch today\'s jobs ';
        }
        // this.component.showLoader('Getting Today\'s Jobs');
        this.spinner=true;
        this.jobService.getJobs(searchCriteria).subscribe(response=>{
            this.spinner=false;
            console.log("Todays jobs of current user");
            console.log(response);
                this.todaysJobs = response.transactions;
                this.todaysPage= response.currPage;
                this.todaysTotalPages = response.totalPages;
            // this.component.closeLoader();
        },err=>{
            this.spinner=false;
            // this.component.closeLoader();
            this.component.showToastMessage('Unable to fetch todays jobs','bottom');
        }
        )
    }

    loadAllJobs(){
        this.component.showLoader('Getting All Jobs');
        var search={schedule:"ONCE",report:false};
        this.jobService.getJobs(search).subscribe(response=>{
            console.log("All jobs of current user");
            console.log(response);
            this.allJobs = response.transactions;
                this.page = response.currPage;
                this.totalPages = response.totalPages;
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
        this.count=0;
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

    doInfiniteAllJobs(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page)

        var searchCriteria = {};
        var msg="Loading Jobs...";

        if(this.scannedLocationId){
            console.log("Location Id in job search ");
            console.log(this.scannedLocationId)
            searchCriteria = {
                locationId:this.scannedLocationId,
                siteId:this.scannedSiteId,
                schedule:"ONCE",
                currPage:this.page+1,
                columnName:"plannedStartTime",
                sortByAsc:true,
                sort:10
            };
            msg='Unable to fetch jobs of the location '+this.scannedLocationId+' in site '+this.scannedSiteId;
        }else if(this.scannedBlock && this.scannedFloor && this.scannedZone){

            console.log("No location id present");
            console.log(this.scannedBlock);
            searchCriteria={
                siteId:this.scannedSiteId,
                block:this.scannedBlock,
                floor:this.scannedFloor,
                zone:this.scannedZone,
                schedule:"ONCE",

                currPage:this.page+1,
                columnName:"plannedStartTime",
                sortByAsc:true,
                sort:10

            };
            msg = 'Unable to fetch jobs for the location '+this.scannedBlock+' - '+this.scannedFloor+' - '+this.scannedZone;
        }else{
            console.log("Scanned location Id or block floor zone not available");
            searchCriteria = {
                locationId:this.scannedLocationId,
                siteId:this.scannedSiteId,
                currPage:this.page+1,
                schedule:"ONCE",

                columnName:"plannedStartTime",
                sortByAsc:true,
                sort:10

            };
            msg='Unable to fetch today\'s jobs ';
        }


        if(this.page>this.totalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('Todays jobs Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(()=>{
                this.jobService.getJobs(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad jobs list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.allJobs.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.component.closeLoader();
                    },
                    error=>{
                        console.log('ionViewDidLoad Jobs Page:'+error);
                    }
                )
                infiniteScroll.complete();
            },1000);
        }

    }

    doInfiniteTodaysJobs(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.todaysTotalPages);
        console.log(this.todaysPage);
        console.log(this.page);
        var searchCriteria = {};
        var msg="Loading Jobs...";

         if(this.scannedBlock && this.scannedFloor && this.scannedZone){

            console.log("No location id present");
            console.log(this.scannedBlock);
            searchCriteria={
                checkInDateTimeFrom:new Date(),
                schedule:"ONCE",

                siteId:this.scannedSiteId,
                block:this.scannedBlock,
                floor:this.scannedFloor,
                zone:this.scannedZone,
                currPage:this.todaysPage+1,
                columnName:"plannedStartTime",
                sortByAsc:true,
                sort:10

            };
            msg = 'Unable to fetch jobs for the location '+this.scannedBlock+' - '+this.scannedFloor+' - '+this.scannedZone;
        }else{
            console.log("Scanned location Id or block floor zone not available");
            searchCriteria = {
                checkInDateTimeFrom:new Date(),
                schedule:"ONCE",

                // locationId:this.scannedLocationId,
                siteId:this.scannedSiteId,
                currPage:this.todaysPage+1,
                columnName:"plannedStartTime",
                sortByAsc:true,
                sort:10

            };
            msg='Unable to fetch today\'s jobs ';
        }
        if(this.todaysPage>this.todaysTotalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('All Jobs Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.todaysTotalPages);
            console.log(this.todaysPage);
            setTimeout(()=>{
                this.jobService.getJobs(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad jobs list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.todaysJobs.push(response.transactions[i]);
                        }
                        this.todaysPage = response.currPage;
                        this.todaysTotalPages = response.totalPages;
                        this.component.closeLoader();
                    },
                    error=>{
                        console.log('ionViewDidLoad Jobs Page:'+error);
                    }
                );
                infiniteScroll.complete();
            },1000);
        }


    }

    presentModal() {
        const modal = this.modalCtrl.create(JobFilter);
        modal.present();
        modal.onDidDismiss(searchCriteria=>{
            if(searchCriteria){
                this.jobService.getJobs(searchCriteria).subscribe(response=>{
                        console.log("All jobs of current user");
                        console.log(response);
                        this.allJobs = response.transactions;
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.component.closeLoader();
                    },
                    err=>{
                        this.component.closeLoader();
                        this.component.showToastMessage('Unable to fetch Jobs','bottom');
                })
            }
        })
    }

    scanQR(){

      this.navCtrl.push(ScanQR);
    }

}
