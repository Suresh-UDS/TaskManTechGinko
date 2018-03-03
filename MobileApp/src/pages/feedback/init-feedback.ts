import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";

@Component({
  selector: 'page-init-feedback',
  templateUrl: 'init-feedback.html'
})
export class InitFeedbackPage {

  userId:any;
  employeeId: any;
  sites:any;

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

  }

    start()
    {
        this.navCtrl.push(FeedbackPage);
    }

}
