import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackQuestionPage} from "../feedback/feedback-questions";

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  userId:any;
  employeeId: any;
  sites:any;
  userName:any;
  feedback:any;

  constructor(public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

      this.feedback = this.navParams.data.feedback;
      console.log(this.feedback);

  }

    start(userName)
    {
        console.log("User name");
        console.log(userName);
        this.navCtrl.push(FeedbackQuestionPage,{username:userName,feedback:this.feedback});
    }

    skip()
    {
        this.userName = "Anonymous"+new Date().getMilliseconds();
        console.log("anonymous user");
        console.log(this.userName);
        this.navCtrl.push(FeedbackQuestionPage, {userName:this.userName,feedback:this.feedback});
    }

}
