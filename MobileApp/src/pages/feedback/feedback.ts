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
  userCode:any;
  employeeId: any;
  sites:any;
  userName:any;
  feedback:any;
    eMsg:any;
    field:any;

  constructor(public navCtrl: NavController,public navParams: NavParams,public myService:authService,public component:componentService, private siteService: SiteService) {

      this.feedback = this.navParams.data.feedback;
      this.userCode="";
      console.log(this.feedback);

  }

    start(userName,userCode)
    {
        console.log("User name");
        if(this.userName)
        {
            console.log(userName + " - " + userCode);
            this.navCtrl.push(FeedbackQuestionPage, {
                userName: userName,
                userCode: userCode,
                feedback: this.feedback,
                fb: this.navParams.data.fb
            });
        }
        else
        {
            this.eMsg="username";
        }
    }

    skip()
    {
        this.userName = "Anonymous"+new Date().getMilliseconds();
        console.log("anonymous user");
        console.log(this.userName);
        console.log(this.userCode);
        this.navCtrl.push(FeedbackQuestionPage, {userName:this.userName,userCode:this.userCode,feedback:this.feedback, fb:this.navParams.data.fb});
    }

}
