import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

  }

    start()
    {
        this.navCtrl.push(FeedbackQuestionPage);
    }

}
