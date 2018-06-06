import {Component, ElementRef, ViewChild} from '@angular/core';
import {Item, ItemSliding, ModalController, NavController, NavParams} from "ionic-angular";
import {GetAssetReading} from "./get-asset-reading";
import {JobService} from "../service/jobService";
import {componentService} from "../service/componentService";
import {tick} from "@angular/core/testing";
import {ViewJobPage} from "../jobs/view-job";
import {CompleteJobPage} from "../jobs/completeJob";
import {ViewTicket} from "../ticket/view-ticket";
import {CreateTicket} from "../ticket/create-ticket";

import { DatePicker } from '@ionic-native/date-picker';
import {AssetService} from "../service/assetService";



/**
 * Generated class for the AssetView page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-asset-view',
  templateUrl: 'asset-view.html',
})
export class AssetView {
  assetDetails:any;
  categories:any;
  tickets:any;
  jobPage=0;
  count:any;

    totalPages:0;
    page:1;

    fromDate:any;
    toDate:any;
    viewButton:any;
    searchCriteria:any;

  constructor(private modalCtrl:ModalController,private datePicker: DatePicker,private componentService:componentService,public navCtrl: NavController, public navParams: NavParams, public jobService:JobService, public assetService:AssetService) {

    this.assetDetails = this.navParams.data.assetDetails;
    this.categories = 'details';
  }
    showCalendar()
    {
        // let dateModal=this.modalCtrl.create(DateModal)
        // dateModal.present()
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetView');
    console.log(this.assetDetails);
    this.componentService.showLoader("");

      this.searchCriteria={
          assetId:this.assetDetails.id
      }
      this.getJobs(this.searchCriteria);
      this.getTickets(this.searchCriteria);

      this.getAssetById();
      // this.getAssetPPMSchedule();
      // this.getAssetAMCSchedule();
  }

    getReadings(){
        this.navCtrl.push(GetAssetReading,{assetDetails:this.assetDetails});
    }

    doRefresh(refresher,segment)
    {
        this.componentService.showLoader("");
        if(segment=='jobs')
        {
            this.getJobs(this.searchCriteria);
            refresher.complete();
        }
        else if(segment=='tickets')
        {
            this.getTickets(this.searchCriteria);
            refresher.complete()
        }
    }
    getJobs(searchCriteria)
    {
        // var searchCriteria={
        //     assetId:this.assetDetails.id
        // }

        this.jobService.getJobs(searchCriteria).subscribe(
            response=>{
                this.componentService.closeLoader()
                console.log("Getting Jobs response");
                console.log(response);
                this.assetDetails.jobs=response.transactions;
                this.page = response.currPage;
                this.totalPages = response.totalPages;
            },
            error=>{
                this.componentService.closeLoader()
                console.log(error)
                console.log("Getting Jobs errors")
            })
    }

    jobScroll(infiniteScroll) {
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria = {
            currPage: this.page + 1,
            assetId:this.assetDetails.id
        };
        if (this.page > this.totalPages) {
            console.log("End of all pages");
            infiniteScroll.complete();
            this.componentService.showToastMessage('Todays jobs Loaded', 'bottom');

        } else {
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(() => {
                this.jobService.getJobs(searchCriteria).subscribe(
                    response => {
                        console.log('ionViewDidLoad jobs list:');
                        console.log(response);
                        console.log(response.transactions);
                        for (var i = 0; i < response.transactions.length; i++) {
                            this.assetDetails.jobs.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.componentService.closeLoader();
                    },
                    error => {
                        console.log('ionViewDidLoad Jobs Page:' + error);
                    }
                )
                infiniteScroll.complete();
            }, 1000);
        }
    }
    getTickets(searchCriteria)
    {

        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.componentService.closeLoader()
                console.log("Getting tickets response");
                console.log(response);
                this.assetDetails.tickets=response.transactions;
            },
            error=>{
                this.componentService.closeLoader();
                console.log(error)
                console.log("Getting Ticket errors")
            }
        )


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

    createTicket(){
        this.navCtrl.push(CreateTicket);
    }

    viewTicket(ticket){
        this.navCtrl.push(ViewTicket,{ticket:ticket});
    }



    // Date search

    selectFromDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                this.fromDate=date;
                console.log('Got date: ', date);
                if(this.fromDate && this.toDate)
                {
                    console.log('view button true');
                    this.viewButton=true;
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }
    selectToDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                this.toDate=date;
                console.log('Got date: ', date);
                if(this.fromDate && this.toDate)
                {
                    console.log('view button true');
                    this.viewButton=true;
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }
    dateSearch(fromDate,toDate,categories) {
        // this.componentService.showLoader("")
        console.log("From Date:" + fromDate.toISOString());
        console.log("To Date:" + toDate.toISOString());
        var searchCriteria={
            fromDate:fromDate.toISOString(),
            toDate:toDate.toISOString()
        }
        if(categories == 'jobs')
        {
            this.getJobs(searchCriteria)
        }
        else if(this.categories == 'tickets')
        {
            this.getTickets(searchCriteria);
        }

    }
    segmentChange()
    {
        this.fromDate="";
        this.toDate="";
    }

    getAssetConfig(assetDetails){
        this.assetService.getAssetConfig(assetDetails.type,assetDetails.id).subscribe(
            response=>{
                console.log("Asset config");
                console.log(response);
                this.assetDetails.config = response;
            },err=>{
                console.log("Error in getting asset config");
                console.log(err);
            })
    }

    getAssetById(){
        this.assetService.getAssetById(this.assetDetails.id).subscribe(
            response=>{
                console.log("Asset by id");
                console.log(response);
                this.assetDetails = response;
                this.getAssetConfig(this.assetDetails);
            },err=>{
                console.log("Error in getting asset by id");
                console.log(err);
            }
        )

    }

    getAssetPPMSchedule()
    {
        this.assetService.getAssetPPMSchedule(this.assetDetails.id).subscribe(
            response=>{
                console.log("Get asset AMC response");
                console.log(response);
                this.assetDetails.ppms = response;
            },
            error=>{
                console.log("Get asset AMC error");
                console.log(error);
            }
        )
    }

    getAssetAMCSchedule()
    {
        this.assetService.getAssetAMCSchedule(this.assetDetails.id).subscribe(
            response=>{
                console.log("Get asset AMC response");
                console.log(response);
                this.assetDetails.amcs = response;
            },
            error=>{
                console.log("Get asset AMC error");
                console.log(error);
            }
        )
    }
}
