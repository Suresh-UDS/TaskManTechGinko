import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackQuestionPage} from "../feedback/feedback-questions";
import {FeedbackPage} from "./feedback";
import {FeedbackQuestionsForm} from "./feedback-questions-form";
import {FeedbackGridPage} from "./feedback-grid";
import {InitFeedbackZone} from "./init-feedback-zone";
import {FeedbackGridFinish} from "../feedback-grid-finish/feedback-grid-finish";
import {FeedbackService} from "../service/feedbackService";
import {DomSanitizer} from "@angular/platform-browser";
declare  var demo ;

@Component({
  selector: 'page-select-feedback',
  templateUrl: 'select-feedback.html'
})
export class SelectFeedbackPage {

  feedback:any;
  fb:any;
  questions:any;
  constructor(public platform: Platform,public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService, private sanitizer:DomSanitizer) {

      this.feedback = this.navParams.data.feedback;
      this.fb=this.navParams.data.fb;

      console.log(this.fb)

      platform.registerBackButtonAction(() => {
          let view = this.navCtrl.getActive();
          console.log("Back button event");
          console.log(view.name);
          console.log();
          if(view.name == 'SelectFeedbackPage') {
              this.navCtrl.setRoot(InitFeedbackZone,{feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
          }
          else if(this.navCtrl.canGoBack())
          {
              this.navCtrl.pop();
          }

      }, 0);


  }
  sad()
  {
      if(this.feedback.displayType=='form'){
          this.navCtrl.push(FeedbackQuestionsForm,{feedback:this.feedback,fb:this.fb,overallFeedback:false,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
      }
      else if(this.feedback.displayType=='grid'){
          this.navCtrl.push(FeedbackGridPage,{feedback:this.feedback,fb:this.fb,overallFeedback:false,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
      }

  }
  happy()
  {
    if(this.feedback.displayType=='form'){
      this.navCtrl.push(FeedbackPage,{feedback:this.feedback,fb:this.fb,question:[],overallFeedback:true,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
    }
    else if(this.feedback.displayType=='grid'){
      // this.navCtrl.push(FeedbackGridFinish,{feedback:this.feedback,fb:this.fb,question:[],overallFeedback:true,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
        this.gridFeebackQuestion();
    }
  }

  goBack()
  {
      this.navCtrl.setRoot(InitFeedbackZone,{feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
  }

  gridFeebackQuestion(){
      this.questions = this.feedback.questions;
      for(let i=0;i<this.questions.length;i++){
          // if(this.grids.length>i){
          //     console.log((this.grids.length-i)-1);
          //     this.questions[i].img = this.grids[(this.grids.length-i)-1].img;
          //     this.questions[i].answer = false;
          // }else{
          //     console.log(i-this.grids.length);
          //     this.questions[i].img = this.grids[i-this.grids.length].img;
          //     this.questions[i].answer = false;
          //
          // }

          delete this.questions[i].answer;


          var image = this.feedbackService.getImage(this.questions[i].image,this.feedback.id).subscribe(
              response=>{
                  var checkImg=response.split(',');
                  if(checkImg[1].length==0)
                  {
                      this.questions[i].img = "";
                  }
                  else
                  {
                      this.questions[i].img = this.sanitizer.bypassSecurityTrustUrl(response);
                  }
              }
          )


      }
      console.log(this.questions);
      this.submitFeedback();
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
            let result = {};
            if(q.answer){
                q.answer = true;
            }else{
                q.answer = false;
            }

            results.push(result);
            console.log(results)
        }

        // this.navCtrl.push(FeedbackGridFinish,{feedback:this.navParams.data.feedback,fb:this.navParams.data.fb,
        //     question:this.questions,remarks:this.remarks,overallFeedback:this.navParams.data.overallFeedback,project:this.navParams.data.project,
        //     site:this.navParams.data.site,location:this.navParams.data.location});

        var feedbackTransaction = {
            results:this.questions,
            reviewerName:"Anonymous",
            reviewerCode:"Anonymous",
            siteId:this.navParams.data.fb.siteId,
            siteName:this.navParams.data.fb.siteName,
            projectId:this.navParams.data.fb.projectId,
            projectName:this.navParams.data.fb.projectName,
            feedbackId:this.navParams.data.feedback.id,
            feedbackName:this.navParams.data.feedback.name,
            block:this.navParams.data.fb.block,
            floor:this.navParams.data.fb.floor,
            zone:this.navParams.data.fb.zone,
            remarks:null,
            overallFeedback:true
        };

        console.log(feedbackTransaction);

        this.feedbackService.saveFeedback(feedbackTransaction).subscribe(
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
}
