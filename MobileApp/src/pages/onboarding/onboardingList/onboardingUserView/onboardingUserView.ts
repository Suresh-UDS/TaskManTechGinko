import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AppConfig} from "../../../service/app-config";
import {OnboardingService} from "../../../service/onboarding.service";

declare  var demo;

@Component({
  selector: 'page-onboardinguser-View',
  templateUrl: 'onboardingUserView.html',
})
export class onboardingUserView {
  userFilter;
  userData: any = {};
  AppConfig = AppConfig;
  //isenabled: boolean;

  bank_pass_book;
  adhar_card_front;
  adhar_card_back;
  address_proof;
  fingerprint_left;
  fingerprint_right;
  driving_license;
  voter_id;
  pancard;
  profilePicture;

  constructor(private navParams: NavParams, private onBoardingService: OnboardingService) {
    console.log(navParams.get('userListData'));
    if (navParams.get('userListData')) {
      this.userData = navParams.get('userListData');
      onBoardingService.getEmployeeDocuments(this.userData.id).subscribe(response=>{
        console.log("Employee Documents");
        console.log(response);
        if(response && response.length>0) {
          for (var i = 0; i < response.length; i++) {
            console.log(response[i].docType);
            if (response[i].docType === "addressProof") {
              this.address_proof = response[i].docUrl;
            }
            if (response[i].docType === "prePrintedStatement") {
              this.bank_pass_book= response[i].docUrl;
            }
            if (response[i].docType === "aadharPhotoCopy") {
              this.adhar_card_front = response[i].docUrl;
            }
            if (response[i].docType === "aadharPhotoCopyBack") {
              this.adhar_card_back = response[i].docUrl;
            }
            if (response[i].docType === "thumbImpressenLeft") {
              this.fingerprint_left = response[i].docUrl;
            }
            if (response[i].docType === "thumbImpressenRight") {
              this.fingerprint_right = response[i].docUrl;
            }
            if (response[i].docType === "drivingLicense") {
              this.driving_license = response[i].docUrl;
            }
            if (response[i].docType === "voterId") {
              this.voter_id = response[i].docUrl;
            }
            if (response[i].docType === "pancardCopy") {
              this.pancard = response[i].docUrl;
            }
            if (response[i].docType === "profilePicture") {
              this.profilePicture = response[i].docUrl;
            }
          }
        }
      })
    }

  }

  
}
