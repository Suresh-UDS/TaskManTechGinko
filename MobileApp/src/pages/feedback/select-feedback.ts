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

@Component({
  selector: 'page-select-feedback',
  templateUrl: 'select-feedback.html'
})
export class SelectFeedbackPage {

  feedback:any;
  fb:any;
  constructor(public platform: Platform,public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

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
      this.navCtrl.push(FeedbackGridFinish,{feedback:this.feedback,fb:this.fb,question:[],overallFeedback:true,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
    }
  }

  goBack()
  {
      this.navCtrl.setRoot(InitFeedbackZone,{feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
  }
}
