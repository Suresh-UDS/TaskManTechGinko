import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AppConfig} from "../../../service/app-config";

@Component({
  selector: 'page-onboardinguser-View',
  templateUrl: 'onboardingUserView.html',
})
export class onboardingUserView {
  userFilter;
  userData: any = {};
  AppConfig = AppConfig;
  //isenabled: boolean;

  

  constructor(private navParams: NavParams) {
    if (navParams.get('userListData')) {
      this.userData = navParams.get('userListData');
     // this.userData['profilePicture'] = AppConfig.s3Bucket+this.userData['profilePicture'];
    }
    // if(this.userData !== ''){
      
    //   this.isenabled =false; 
    //   }else{
      
    //   this.isenabled =true;
    //   }
    
  }

  
}