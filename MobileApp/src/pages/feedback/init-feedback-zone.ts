import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";
import {FeedbackService} from "../service/feedbackService";
import {FeedbackDashboardPage} from "./feedback-dashboard";
import {FeedbackZone} from "./feedbackZone";
import {SelectFeedbackPage} from "./select-feedback";
import {WizardFeedbackEntry} from "./wizard-feedback-entry";
import {FeedbackGridPage} from "./feedback-grid";

declare  var demo ;

@Component({
    selector: 'page-init-feedback-zone',
    templateUrl: 'init-feedback-zone.html'
})
export class InitFeedbackZone {
    bgClr:any;
    locations:any;
    feedbacks:any;
    selectedFloor:any;
    msg;
    zones:any;
    constructor(public navCtrl: NavController,private navParams:NavParams,public myService:authService,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
        // this.loadFeedbackMappings();

        this.bgClr=["#552D56","#673553","#AF5E6C","#DE8275","#FFAB88","#FF6C54","#FF8A54","#FFA754","#FFC153","#552D56"]
        console.log("Init feedback zone page");
        console.log(this.navParams.data);
        this.locations = this.navParams.data.location;


    }

    ionViewDidLoad(){
        this.selectZone()
    }

    start(fb,site,project,location)
    {
        console.log("feedback details before entering");
        console.log(fb);
        console.log(site);
        console.log(project);
        console.log(location);

        var feedback =fb.feedback;
        if(feedback){
            //remove
            // feedback.displayType='grid';
            if(feedback.displayType == 'form'){
                this.navCtrl.push(SelectFeedbackPage,{feedback:feedback,fb:fb,project:project,site:site,location:location});
            }
            else if(feedback.displayType == 'grid'){
                this.navCtrl.push(SelectFeedbackPage,{feedback:feedback,fb:fb,project:project,site:site,location:location});
            }
            else{
                this.navCtrl.push(WizardFeedbackEntry,{feedback:feedback,fb:fb,project:project,site:site,location:location});
            }

        }else{
            this.component.showToastMessage('No Feedback form available','bottom');
        }
    }

    selectZone()
    {
        this.feedbackService.loadZones(this.navParams.data.project.id,this.navParams.data.site.id,this.navParams.data.location.block, this.navParams.data.location.floor).subscribe(
            response=>{
                console.log("====Zone By BlockId======");
                console.log(response);
                this.zones=response;
                console.log(this.zones);
            },
            error=>{
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }
                this.msg="Error in getting zones";
                this.component.showToastMessage(this.msg,'bottom');
            }
        )
    }

    loadFeedbackMappings(zone){
        console.log("Selected location");
        console.log(location);
        var currPageVal = 1;
        var searchCriteria = {
            currPage:currPageVal,
            findAll:false,
            block:this.navParams.data.location.block,
            floor:this.navParams.data.location.floor,
            zone:zone,
            siteId:this.navParams.data.site.id

        }


        this.feedbackService.searchFeedbackMappings(searchCriteria).subscribe(
            response=>{
                console.log(response.transactions);
                if(response.transactions && response.transactions.length >0){
                    this.feedbacks=response.transactions;
                    this.start(response.transactions[0],this.navParams.data.site,this.navParams.data.project,this.navParams.data.location);
                }else{
                    demo.showSwal('warning-message-and-confirmation-ok','Failed to List','No feedback mappings found');
                }

            }
        )

    }

}