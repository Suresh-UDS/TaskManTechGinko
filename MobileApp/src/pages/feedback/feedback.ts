import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackQuestionPage} from "../feedback/feedback-questions";
import {InitFeedbackPage} from "./init-feedback";
import {FeedbackService} from "../service/feedbackService";
import {FeedbackZone} from "./feedbackZone";
import {InitFeedbackZone} from "./init-feedback-zone";
import {SelectFeedbackPage} from "./select-feedback";
declare  var demo ;
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  userId:any;
  userCode:any;
  employeeId: any;
  sites:any;
  userName:any;
  feedback:any;
    eMsg:any;
    field:any;
    status:any;
    feedbackTransaction:any;
    questions:any;
    remarks:any;
    overallFeedback:any;

  constructor(public platform: Platform,public navCtrl: NavController,public feedbackService:FeedbackService,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

      this.feedback = this.navParams.data.feedback;
      this.questions= this.navParams.data.question;
      this.remarks= this.navParams.data.remarks;
      this.userCode="";
      this.overallFeedback = this.navParams.data.overallFeedback;
      console.log("Feedback page");
      console.log(this.navParams.data);



  }

    start(userName,userCode)
    {

        this.component.showLoader("Saving Feedback");
        console.log("feedback details");

        this.questions=this.questions;
        this.feedbackTransaction = {
            results:this.questions,
            reviewerName:this.userName,
            reviewerCode:this.userCode,
            siteId:this.navParams.data.fb.siteId,
            siteName:this.navParams.data.fb.siteName,
            projectId:this.navParams.data.fb.projectId,
            projectName:this.navParams.data.fb.projectName,
            feedbackId:this.navParams.data.feedback.id,
            feedbackName:this.navParams.data.feedback.name,
            block:this.navParams.data.fb.block,
            floor:this.navParams.data.fb.floor,
            zone:this.navParams.data.fb.zone,
            remarks:this.remarks,
            overallFeedback:this.overallFeedback
        };

        console.log(this.feedbackTransaction);

        this.feedbackService.saveFeedback(this.feedbackTransaction).subscribe(
            response=>{
                console.log("Saving feeback");
                console.log(response);
                this.questions = null;
                this.component.closeLoader();
                demo.showSwal('feedback-success','Thank you!','For your Feedback');
                // this.navCtrl.setRoot(InitFeedbackZone,{feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
                this.navCtrl.setRoot(SelectFeedbackPage,{fb:this.navParams.data.fb,feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
            },err=>{
                console.log("error in saving feedback");
                this.component.closeLoader();
                demo.showSwal('warning-message-and-confirmation-ok','Failed to Save','Unable to save feedback');
                console.log(err)
            }
        )

    }



    // skip()
    // {
    //     this.userName = "Anonymous"+new Date().getMilliseconds();
    //     console.log("anonymous user");
    //     console.log(this.userName);
    //     console.log(this.userCode);
    //     this.navCtrl.push(FeedbackQuestionPage, {userName:this.userName,userCode:this.userCode,feedback:this.feedback, fb:this.navParams.data.fb, status:this.status});
    // }

}
