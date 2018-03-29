import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackQuestionPage} from "../feedback/feedback-questions";
import {FeedbackPage} from "./feedback";

@Component({
  selector: 'page-select-feedback',
  templateUrl: 'select-feedback.html'
})
export class SelectFeedbackPage {


  feedback:any;
  happyFeedback:any;
  sadFeedback:any;


  constructor(public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

      this.feedback = this.navParams.data.feedback;
      this.happyFeedback=1;
      this.sadFeedback=0;


  }

  sad()
  {
      this.navCtrl.setRoot(FeedbackPage,{feedback:this.feedback,status:this.sadFeedback});
  }
  happy()
  {
      this.navCtrl.setRoot(FeedbackPage,{feedback:this.feedback,status:this.happyFeedback});
  }

}
