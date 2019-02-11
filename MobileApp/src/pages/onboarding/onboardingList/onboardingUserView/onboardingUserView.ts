import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-onboardinguser-View',
  templateUrl: 'onboardingUserView.html',
})
export class onboardingUserView {
  userFilter;
  userData: any = {};

  constructor(private navParams: NavParams) {
    if (navParams.get('userListData')) {
      this.userData = navParams.get('userListData');
    }
  }
}