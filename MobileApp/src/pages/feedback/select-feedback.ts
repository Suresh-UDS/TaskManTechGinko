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
  fb:any;


  constructor(public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

      this.feedback = this.navParams.data.feedback;
      this.fb=this.navParams.data.fb;



  }

  sad()
  {
      this.navCtrl.push(FeedbackQuestionPage,{feedback:this.feedback,fb:this.fb});
  }
  happy()
  {
      this.navCtrl.setRoot(FeedbackPage,{feedback:this.feedback,fb:this.fb,question:[]});
  }

}
