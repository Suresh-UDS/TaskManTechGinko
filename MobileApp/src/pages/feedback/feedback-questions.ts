import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackService} from "../service/feedbackService";

@Component({
  selector: 'page-feedback-questions',
  templateUrl: 'feedback-questions.html'
})
export class FeedbackQuestionPage {

  userId:any;
  employeeId: any;
  sites:any;
   check=false;
   close=false;

  constructor(public navCtrl: NavController,public myService:authService,public feedbackService:FeedbackService,public component:componentService, private siteService: SiteService, private navParams:NavParams) {
    console.log("username from feedback");
    console.log(this.navParams.data.userName);
    var search ={};
    this.feedbackService.getAllFeedbackQuestions(search).subscribe(
        response=>{

            console.log(response);

        },
        error=>
        {
            console.log(error);
        }
    )

  }




}
