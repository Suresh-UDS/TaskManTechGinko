import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";

@Component({
  selector: 'page-feedback-questions',
  templateUrl: 'feedback-questions.html'
})
export class FeedbackQuestionPage {

  userId:any;
  employeeId: any;
  sites:any;


  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

  }




}
