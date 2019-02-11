import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

import { onboardingNewEmployee } from '../onboardingNewEmployee/onboardingNewEmployee';
import { onboardingEmpStatus } from '../onboardingEmpStatus/onboardingEmpStatus';
import { onboardingUserView } from '../onboardingList/onboardingUserView/onboardingUserView';
import { onboardingListFilter } from '../onboardingList/onboardingListFilter/onboardingListFilter';
import { OnboardingService } from '../../service/onboarding.service';
import { componentService } from '../../service/componentService';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-onboarding-list',
  templateUrl: 'onboardingList.html',
})
export class onboardingExistEmployee implements OnInit {
  onBoardingAction = 'actionRequired';
  popOverEvent: any;
  actionRequiredfilterData = {};
  completedfilterData;
  actionRequiredEmp: any = [];
  completedEmp: any = [];
  errormsg;
  hideFilter = true;

  constructor(private storage: Storage, private onboardingService: OnboardingService, private navCtrl: NavController, private popoverCtrl: PopoverController, public component: componentService) {
  }

  ngOnInit() { }
  ionViewWillEnter() {
    this.storage.get('OnBoardingData').then((localStoragedData) => {
      for (let list of localStoragedData['actionRequired']) {
        list['personalDetails']['percentage'] = (Object.keys(list).length / 5) * 100;
        if (list.hasOwnProperty('kycDetails')) {
          list['personalDetails']['image'] = list['kycDetails']['allKYCData']['employeeProfile'];
        } else {
          list['personalDetails']['image'] = 'assets/imgs/placeholder.png'
        }
      }
      this.actionRequiredEmp = localStoragedData['actionRequired'];
      this.completedEmp = localStoragedData["completed"];
      console.log(this.actionRequiredEmp);
      console.log(typeof this.actionRequiredEmp);
      console.log(this.actionRequiredEmp.length);
      this.onSegmentChange();
    });
  }
  addNewEmpyoee() {
    this.storage.set('onboardingCurrentIndex', this.actionRequiredEmp.length)
    this.navCtrl.push(onboardingNewEmployee);
  }
  updateEmployeeDetails(index) {
    console.log('index = ' + index);
    this.storage.set('onboardingCurrentIndex', index)
    //window.localStorage.setItem('onboardingCurrentIndex', index);
    this.navCtrl.push(onboardingEmpStatus);
  }
  onboardingUserView(data) {
    this.navCtrl.push(onboardingUserView, { userListData: data });
  }
  userFilter() {
    this.actionRequiredfilterData = {};
    this.popOverEvent = this.popoverCtrl.create(onboardingListFilter, {}, { enableBackdropDismiss: false });
    this.popOverEvent.present();
    this.popOverEvent.onDidDismiss(data => {
      console.log(data);
      if (this.onBoardingAction == 'actionRequired') {
        this.actionRequiredfilterData = data;
      } else if (this.onBoardingAction == 'completed') {
        this.completedfilterData = data;
      }
    });
  }
  onSegmentChange() {
    if(this.onBoardingAction == 'actionRequired') {
       this.hideFilter = this.actionRequiredEmp['length'] ? true : false;
    } else {
      this.hideFilter = this.completedEmp['length'] ? true : false;
    }
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }
}