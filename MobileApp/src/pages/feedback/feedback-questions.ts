import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Slides} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackService} from "../service/feedbackService";
import {FeedbackPage} from "./feedback";
import {InitFeedbackPage} from "./init-feedback";
declare  var demo ;
@Component({
  selector: 'page-feedback-questions',
  templateUrl: 'feedback-questions.html'
})
export class FeedbackQuestionPage {

    @ViewChild('slides') slides: Slides;

  userId:any;
  employeeId: any;
  sites:any;
   check=false;
   close=false;
   questions:any;
   feedback:any;
   yesMode:any;
   noMode:any;
   feedbackTransaction:any;
   username:any;
   answer:any;

  constructor(public navCtrl: NavController,public myService:authService,public feedbackService:FeedbackService,public component:componentService, private siteService: SiteService, private navParams:NavParams) {
    console.log("username from feedback");
    console.log(this.navParams.data);

this.username = this.navParams.data.userName;
    console.log(this.navParams.data.feedback);
    this.feedbackService.findFeedback(this.navParams.data.feedback.id).subscribe(
        response=>{
            console.log("Response of selected feedback");
            console.log(response);
        }
    )

      this.feedback = this.navParams.data.feedback;
      console.log("feedback");
      console.log(this.feedback);
      console.log(this.navParams.data.fb);
      this.questions = this.feedback.questions;
        console.log("questions");
        console.log(this.questions);
  }

  markAnswer(i,answer,mode){
      if(mode=='yes' && answer){
          this.questions[i].answer = answer;
          this.yesMode = true;
          this.noMode = false;
      }else if(mode== 'yes'){
          this.questions[i].answer = null;
      }else if(mode == 'no' && answer){
          this.questions[i].answer = answer;
      }else{
          this.questions[i]=null;
      }
      console.log(this.questions[i]);
  }

    submitFeedback(){
      this.component.showLoader("Saving Feedback");
      console.log("feedback details");
      console.log(this.navParams.data.fb);
      console.log(this.navParams.data.feedback);
      console.log(this.navParams.data.userName);
      console.log(this.questions);

      var results = [];
      for(let q of this.questions){
          let result ={
              id:q.id,
              question:q.question,
              answer:q.answer,
              answerType:q.answerType
          };
          results.push(result);
          console.log(typeof q.answer);
      }
      this.feedbackTransaction = {
          results:this.questions,
          reviewerName:this.navParams.data.userName,
          siteId:this.navParams.data.fb.siteId,
          siteName:this.navParams.data.fb.siteName,
          projectId:this.navParams.data.fb.projectId,
          projectName:this.navParams.data.fb.projectName,
          feedbackId:this.navParams.data.feedback.id,
          feedbackName:this.navParams.data.feedback.name,
          block:this.navParams.data.fb.block,
          floor:this.navParams.data.fb.floor,
          zone:this.navParams.data.fb.zone
      };

      console.log(this.feedbackTransaction);

      this.feedbackService.saveFeedback(this.feedbackTransaction).subscribe(
          response=>{
              console.log("Saving feeback");
              console.log(response);
              this.questions = null;
              this.component.closeLoader();
              demo.showSwal('feedback-success','Thank you!','For your Feedback');
              this.navCtrl.setRoot(InitFeedbackPage,{feedback:this.navParams.data.feedback});
          },err=>{
              console.log("error in saving feedback");
              this.component.closeLoader();
              demo.showSwal('warning-message-and-confirmation-ok','Failed to Save','Unable to save feedback');
              console.log(err)
          }
      )

    }

    next() {
        this.slides.slideNext();
    }

    prev() {
        this.slides.slidePrev();
    }


}
