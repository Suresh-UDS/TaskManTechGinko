import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";
import {FeedbackService} from "../service/feedbackService";
import {FeedbackDashboardPage} from "./feedback-dashboard";
import {SelectFeedbackPage} from "./select-feedback";
@Component({
    selector: 'feedback-zone',
    templateUrl: 'feedbackZone.html'
})
export class FeedbackZone {
    scrollSite:any;
    activeSite:any;
    selectedBlock:any;
    selectedFloor:any;
    selectedSite:any;
    feedbacks:any;
    zones:any;


    constructor(public navParams:NavParams ,public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
        // this.loadFeedbackMappings();
        console.log("Nav params feedback zones");
        console.log(this.navParams.data);
            this.selectedBlock = this.navParams.data.selectedBlock;
            this.selectedFloor= this.navParams.data.selectedFloor;
            this.zones= this.navParams.data.zones;
            this.selectedSite = this.navParams.data.selectedSite;
        console.log(this.selectedSite);
        console.log(this.selectedBlock);
    }

    start(fb)
    {
        var feedback =fb.feedback;
        if(feedback){
            // this.navCtrl.setRoot(FeedbackPage,{feedback:feedback,fb:fb});
            this.navCtrl.setRoot(SelectFeedbackPage,{feedback:feedback,fb:fb});

        }else{
            this.component.showToastMessage('No Feedback form available','bottom');
        }
    }


    getZoneFeedbacks(index,zone){
        console.log(zone);
        this.scrollSite = true;
        this.activeSite = index;

        var currPageVal = 1;
        var searchCriteria = {
            currPage:currPageVal,
            findAll:false,
            block:this.selectedBlock,
            floor:this.selectedFloor,
            zone:zone,
            siteId:this.selectedSite.id

        }

        this.feedbackService.searchFeedbackMappings(searchCriteria).subscribe(
            response=>{
                console.log(response.transactions);
                this.feedbacks=response.transactions;
                this.start(response.transactions[0]);
            }
        )

    }

}