import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Network } from "@ionic-native/network";
import { onboardingNewEmployee } from '../onboardingNewEmployee/onboardingNewEmployee';
import { onboardingEmpStatus } from '../onboardingEmpStatus/onboardingEmpStatus';
import { onboardingUserView } from '../onboardingList/onboardingUserView/onboardingUserView';
import { onboardingListFilter } from '../onboardingList/onboardingListFilter/onboardingListFilter';
import { OnboardingService } from '../../service/onboarding.service';
import { componentService } from '../../service/componentService';


import { Storage } from '@ionic/storage';
import { onBoardingModel } from './onboarding';
import { onBoardingDataModel } from './onboardingDataModel';
import {AppConfig} from '../../service/app-config';

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
  AppConfig = AppConfig;

  constructor(private storage: Storage, private network: Network, private onboardingService: OnboardingService, private navCtrl: NavController, private popoverCtrl: PopoverController,
    public component: componentService) {
    this.setStorage();
    // this.storage.get('onboardingProjectSiteIds').then((Ids) => {
    //   this.wbsId = Ids['siteId'];
    // });
  }
  ionViewWillEnter() {
    //  this.component.showLoader("Updating....");
    this.storage.get('OnBoardingData').then((data) => {
      if (data) {
        this.actionRequiredEmp = data['actionRequired'];
        this.completedEmp = data["completed"];
        this.onSegmentChange();
        this.getPercentage();
      }
      // this.component.closeLoader();
    })
  }

  ngOnInit() {
    this.component.showLoader("Please wait....");

    console.log('onboard home Empid ' + window.localStorage.getItem('employeeId'));
    console.log('onboard home UserId ' + window.localStorage.getItem('employeeUserId'));
    //  console.log('onboard home EmpName ' + window.localStorage.getItem('employeeDetails'));


    if (this.network.type != 'none') {
      this.onboardingService.initGetEmployeeListByWbs().subscribe(projectId => {
        console.log('res init in page ' + projectId);
        this.wbsId = projectId;

        window.localStorage.setItem('projectId', projectId);

        this.storage.get('OnBoardingData').then((localStoragedData) => {

          localStoragedData["completed"] = [];

          this.onboardingService.getEmployeeListByProjectId(projectId).subscribe(res => {
            let objectsKeys;
            let objectsValues;


            for (var i = 0; i < res.length; i++) {

              //if (!this.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

                if(res[i]["submitted"]){
                  localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
                }
                else{
                  localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
                }

                this.storage.set('OnBoardingData', localStoragedData);

              //}

            }
            //console.log(onBoardingModel);
            this.actionRequiredEmp = localStoragedData['actionRequired'];
            this.completedEmp = localStoragedData["completed"];
            this.getPercentage();
            this.component.closeLoader();
          }, err => {
            console.log('onbList3');
            this.actionRequiredEmp = localStoragedData['actionRequired'];
            this.completedEmp = localStoragedData["completed"];
            this.onSegmentChange();
            this.getPercentage();
            this.component.closeLoader();
            this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
          });
        });
      },
        err => {
          console.log('onbList2');
          // this.actionRequiredEmp = localStoragedData['actionRequired'];
          //  this.completedEmp = localStoragedData["completed"];
          this.onSegmentChange();
          this.getPercentage();
          this.component.closeLoader();
          this.component.showToastMessage('Server Unreachable', 'bottom');
          console.log(err);
        })
    } else {
      console.log(' No network ');
      this.component.showToastMessage(' No network ', 'bottom');
      this.storage.get('OnBoardingData').then((data) => {
        if (!data) {
          this.actionRequiredEmp = data['actionRequired'];
          this.completedEmp = data["completed"];
          this.onSegmentChange();
          this.getPercentage();
          this.component.closeLoader();
          this.component.showToastMessage('Server Unreachable', 'bottom');
        }
      })
    }
  }


  addNewEmpyoee() {
    let obj = {
      projectId: this.wbsId,
      index: this.actionRequiredEmp.length,
      action: 'add'
    }
    this.storage.set('onboardingCurrentIndex', obj);

    
    
    console.log("index === " + this.actionRequiredEmp.length);
    this.navCtrl.push(onboardingNewEmployee);
  }
  updateEmployeeDetails(index) {
    console.log('index = ' + index);
    let obj = {

      index: index,
      action: 'update'
    }
    this.storage.set('onboardingCurrentIndex', obj)
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
  findSavedDuplication(empdt, key) {
    let count = 0;
    for (let list of empdt) {
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
    this.onboardingService.saveOnboardingUser(object).subscribe((res) => {
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

  setStorage() {
    this.storage.get('OnBoardingData').then((data) => {
      if (!data) {
        this.storage.set('OnBoardingData', { actionRequired: [], completed: [] });
      }
    })
  }

}