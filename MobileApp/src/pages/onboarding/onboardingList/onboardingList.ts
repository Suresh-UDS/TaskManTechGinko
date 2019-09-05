import { Component, OnInit } from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
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
import {JobFilter} from "../../jobs/job-filter/job-filter";
import {OnBoardingEmployeeFilter} from "./on-boarding-employee-filter/on-boarding-employee-filter";

const searchCriteria = {
  branchCode:null,
  projectCode: null,
  wbsCode:null,
  verified:false,
  list:true,
  employeeEmpId:String,
  name:String
};

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
  private selectedProjectCode: any;
  private selectedWbsCode: any;



  constructor(private storage: Storage, private network: Network, private onboardingService: OnboardingService, private navCtrl: NavController, private popoverCtrl: PopoverController, public modalCtrl: ModalController,
    public component: componentService) {
    this.setStorage();


    // this.storage.get('onboardingProjectSiteIds').then((Ids) => {
    //   this.wbsId = Ids['siteId'];
    // });
  }
  ionViewWillEnter() {
    //  this.component.showLoader("Updating....");
    this.getNomineeRelationships();

  }

  ngOnInit() {
    // this.component.showLoader("Please wait....");
    console.log('onboard home Empid ' + window.localStorage.getItem('employeeId'));
    console.log('onboard home UserId ' + window.localStorage.getItem('employeeUserId'));

  }

  getLocalData(){
    this.storage.get('OnBoardingData').then((data) => {
      if (data) {
        this.actionRequiredEmp = data['actionRequired'];
        this.completedEmp = data["completed"];
        this.getPercentage();
      }
      // this.component.closeLoader();
    })
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

    const modal = this.modalCtrl.create(OnBoardingEmployeeFilter);
    modal.present();
    modal.onDidDismiss(data=>{
      console.log(data);
      searchCriteria.wbsCode = data.wbsCode;
      searchCriteria.projectCode = data.projectCode;
      searchCriteria.employeeEmpId = data.employeeEmpId;
      searchCriteria.name = data.name;
      this.onSegmentChange()
    });
  }


  getPercentage() {
    for (var i = 0; i < this.actionRequiredEmp.length; i++) {
      let objectPercentage = 0;
      let keyPercentage = 0;
      let objectkeys = [];
      let objectValues = [];
      let objectFormattedValues = [];
      console.log("percentage calculation");
      console.log(this.actionRequiredEmp[i]);
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
      this.actionRequiredEmp[i]['percentage'] = Math.floor(objectPercentage / 7);

      console.log(Math.floor(objectPercentage / 7));
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
    console.log("Segment changed");
    console.log(searchCriteria);
    console.log(this.onBoardingAction);
    if (this.onBoardingAction == 'actionRequired') {
      if(searchCriteria.wbsCode !=null){
        this.getEmployeesByWBSId(searchCriteria.projectCode, searchCriteria.wbsCode);
      }else if(searchCriteria.projectCode !=null){
        this.getEmployeesByProjectId(searchCriteria.projectCode);
      }
    } else {
      this.searchEmployees(searchCriteria);
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

  searchEmployees(searchCriteria){
    this.component.showLoader("Loading Employees");
    window.localStorage.setItem('projectId', searchCriteria.projectCode);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];



      this.onboardingService.searchOnBoardingEmployees(searchCriteria).subscribe(response => {
        let objectsKeys;
        let objectsValues;

        console.log("Search response");
        console.log(response);

        let res = response.transactions;


        if(res && res !=null){
          console.log("Response is not null");
          for (var i = 0; i < res.length; i++) {

            if (!this.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

              if(res[i]["submitted"]){
                localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
              }
              else{
                localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
              }

              this.storage.set('OnBoardingData', localStoragedData);

            }

          }
        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        if(res !=null){
          this.completedEmp = res;
        }else{
          this.completedEmp = [];
        }
        console.log(this.completedEmp);
        this.component.closeLoader();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeLoader();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  getEmployeesByProjectId(projectId){
    this.component.showLoader("Loading Employees...")
    window.localStorage.setItem('projectId', projectId);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];

      this.onboardingService.getEmployeeListByProjectId(projectId).subscribe(res => {
        let objectsKeys;
        let objectsValues;


        for (var i = 0; i < res.length; i++) {

          if (!this.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

            if(res[i]["submitted"]){
              localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
            }
            else{
              localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
            }

            this.storage.set('OnBoardingData', localStoragedData);

          }

        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  getEmployeesByWBSId(projectId,wbsId){
    this.component.showLoader("Loading Employees...");
    this.actionRequiredEmp = [];
    this.completedEmp = [];
    window.localStorage.setItem('projectId', projectId);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];

      console.log("Local storage");
      console.log(localStoragedData);
      for(let i=0;i<localStoragedData.length;i++){

        console.log(localStoragedData[i]);
        if(localStoragedData[i].isSync){
          delete localStoragedData[i];
        }

        if(i+1 == localStoragedData.length){
          this.storage.set('OnBoardingData', localStoragedData);
        }
      }

      this.onboardingService.getEmployeeListByWbs(wbsId).subscribe(res => {
        let objectsKeys;
        let objectsValues;



        for (var i = 0; i < res.length; i++) {

          if (!this.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

            if(res[i]["submitted"]){
              localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
            }
            else{
              localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
            }

            this.storage.set('OnBoardingData', localStoragedData);

          }

        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  getNomineeRelationships(){
    this.onboardingService.getNomineeRelationships().subscribe(relationships=>{
      console.log("Nominee relationships from server");
      console.log(relationships);
      this.storage.set('nomineeRelationships',relationships);
    })
  }

}
