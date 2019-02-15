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
import { onBoardingModel } from './onboarding';

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
  wbsId;

  constructor(private storage: Storage, private onboardingService: OnboardingService, private navCtrl: NavController, private popoverCtrl: PopoverController, public component: componentService) {
    this.storage.get('onboardingProjectSiteIds').then((Ids) => {
      this.wbsId = Ids['SiteId'];
    });
  }
  ngOnInit() { }
  ionViewWillEnter() {
    this.storage.get('OnBoardingData').then((localStoragedData) => {
      // for (let list of localStoragedData['actionRequired']) {
      //   list['personalDetails']['percentage'] = (Object.keys(list).length / 5) * 100;
      //   if (list.hasOwnProperty('kycDetails')) {
      //     list['personalDetails']['image'] = list['kycDetails']['allKYCData']['employeeProfile'];
      //   } else {
      //     list['personalDetails']['image'] = 'assets/imgs/placeholder.png'
      //   }
      // }
      this.onboardingService.getEmployeeListByWbs(this.wbsId).subscribe(res => {
        let objectsKeys;
        let objectsValues;
        for (var i = 0; i < res.length; i++) {
          if (!this.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {
            // for (let list in onBoardingModel) {
            //   for (let key in onBoardingModel[list]) {
            //     onBoardingModel[list][key] = res[i][key];
            //     if (list == 'employmentDetails') {
            //       if (res[i]['previousEmployee'].length) {
            //         onBoardingModel[list]['isEmploymentEarlier'] = res[i]['previousEmployee'][0]['name'] ? true : false;
            //         onBoardingModel[list]['employeeName'] = res[i]['previousEmployee'][0]['name'];
            //         onBoardingModel[list]['employeeDesignation'] = res[i]['previousEmployee'][0]['designation'];
            //       }
            //     }
            //     if (list == 'kycDetails') {
            //       //onBoardingModel['personalDetails']['image'] = res[i]['kycDetails'][0]['accountNo'];
            //       if (res[i]['bankDetails'].length) {
            //         onBoardingModel[list]['bAccountNumber'] = res[i]['bankDetails'][0]['accountNo'];
            //         onBoardingModel[list]['bIfscNumber'] = res[i]['bankDetails'][0]['IFSC'];
            //       }
            //     }
            //   }
            //   console.log(onBoardingModel);
            //   //objectsKeys = Object['values'](onBoardingModel[list]);
            //   //onBoardingModel[list]['personalDetails']['percentage'] = (Object.keys(list).length / 5) * 100;
            // }
            //objectsKeys = Object['entries'](onBoardingModel[list]);
            //console.log('entries ==== ');
            //console.log(objectsKeys);
            localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
            this.storage.set('OnBoardingData', localStoragedData);
          }
        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.onSegmentChange();
        this.getPercentage();
      });
    });
  }
  addNewEmpyoee() {
    this.storage.set('onboardingCurrentIndex', this.actionRequiredEmp.length);
    console.log("index === " + this.actionRequiredEmp.length);
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
  getPercentage() {
    for (var i = 0; i < this.actionRequiredEmp.length; i++) {
      let objectPercentage = 0;
      let keyPercentage = 0;
      let objectkeys = [];
      let objectValues = [];
      let objectFormattedValues = [];
      for (let list in onBoardingModel) {
        for (let key in onBoardingModel[list]) {
          onBoardingModel[list][key] = this.actionRequiredEmp[i][key];
        }


        objectkeys = Object.keys(onBoardingModel[list]);
        objectValues = Object['values'](onBoardingModel[list]);
        objectFormattedValues = objectValues.filter((data) => {
          if (data && JSON.stringify(data) !== '{}') {
            return data;
          }
        });
        keyPercentage = (objectFormattedValues.length / objectkeys.length) * 100
        objectPercentage += keyPercentage;

      }
      this.actionRequiredEmp[i]['percentage'] = Math.floor(objectPercentage / 5);

      console.log(Math.floor(objectPercentage / 5));
    }
  }
  findSavedDuplication(array, key) {
    let count = 0;
    for (let list of array) {
      if (list['employeeCode'] == key) {
        count = count + 1;
      }
    }
    if (count == 0) {
      return false;
    } else {
      return true;
    }
  }
  onSegmentChange() {
    if (this.onBoardingAction == 'actionRequired') {
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
  syncEmployeeDetails(object, index) {
    this.component.showLoader("Loading OnBoarding");
    this.onboardingService.saveOnboardingUser(object, index).subscribe((res) => {
      this.component.closeAll();
      this.storage.get('OnBoardingData').then((localStoragedData) => {
        localStoragedData['completed'].splice(index, 1);
        this.storage.set('OnBoardingData', localStoragedData);
      });
    }, (error) => {
      this.component.closeAll();
      this.component.showToastMessage('Server Unreachable', 'bottom');
    })
  }
}