import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { onboardingNewEmployee } from '../onboardingNewEmployee/onboardingNewEmployee';
import { Storage } from '@ionic/storage';
import { onBoardingModel } from '../onboardingList/onboarding';

@Component({
  selector: 'page-onboarding-status',
  templateUrl: 'onboardingEmpStatus.html',
})
export class onboardingEmpStatus implements OnInit, AfterViewChecked {

  @ViewChild('stepper') stepper;
  @ViewChild('stepperContainer') stepperContainer;
  onboardingFormStatus;
  employeeName;
  employeeCode;
  constructor(private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.onboardingFormStatus = [
      { name: 'Personal Details', key: 'personalDetails', status: '0', icon: 'checkmark' },
      { name: 'Contact Details', key: 'contactDetails', status: '0', icon: 'checkmark' },
      { name: 'Nominee & Academic', key: 'familyAcademicDetails', status: '0', icon: 'checkmark' },
      { name: 'Employment Details', key: 'employmentDetails', status: '0', icon: 'checkmark' },
      { name: 'KYC Details', key: 'kycDetails', status: '0', icon: 'checkmark' }
    ]
  }
  ngAfterViewChecked() { }

  ionViewWillEnter() {

    let objDataKeys = [];
    const currentScope = this;
    const data = document.getElementsByTagName('ion-step-header');

    this.storage.get('onboardingCurrentIndex').then(currentIndex => {

      currentIndex = currentIndex['index'];
      console.log('index = ' + currentIndex);

      console.log(currentIndex);

      let objectPercentage = 0;
      let keyPercentage = 0;
      let objectkeys = [];
      let objectValues = [];
      let objectFormattedValues = [];

      this.storage.get('OnBoardingData').then((localStoragedData) => {
        //obj[this.wizardObj[this.currentIndex]['key']] = data['data'];
        console.log(localStoragedData);
        console.log(localStoragedData['actionRequired']);
        this.employeeName = localStoragedData['actionRequired'][currentIndex]['employeeName'];
        this.employeeCode = localStoragedData['actionRequired'][currentIndex]['employeeCode'];
        // for (let list in localStoragedData['actionRequired'][currentIndex]) {
        //   objDataKeys.push(list);
        //   // alert(list);
        // }
        for (let i = 0; i < data.length; i++) {

          let keyData = this.onboardingFormStatus[i]['key'];
          for (let key in onBoardingModel[keyData]) {
            onBoardingModel[keyData][key] = localStoragedData['actionRequired'][currentIndex][key];
          }

          objectkeys = Object.keys(onBoardingModel[keyData]);
          objectValues = Object['values'](onBoardingModel[keyData]);
          objectFormattedValues = objectValues.filter((data) => {
            if (data && JSON.stringify(data) !== '{}') {
              return data;
            }
          });

    
          keyPercentage = (objectFormattedValues.length / objectkeys.length) * 100
    
          this.onboardingFormStatus[i]['status'] = Math.floor(keyPercentage) + '%';
          // let keyPercentage = 0
          // let objectFormattedValues = [];
          // const objectkeys = Object.keys(localStoragedData['actionRequired'][currentIndex][this.onboardingFormStatus[i]['key']]);
          // const objectValues = Object['values'](localStoragedData['actionRequired'][currentIndex][this.onboardingFormStatus[i]['key']]);
          // objectFormattedValues = objectValues.filter((data) => {
          //   if (data) {
          //     return data;
          //   }
          // });
          // keyPercentage = (objectFormattedValues.length / objectkeys.length) * 100;
          // this.onboardingFormStatus[i]['status'] = Math.floor(keyPercentage) + '%';
          if (keyPercentage == 100) {
            this.onboardingFormStatus[i]['icon'] = 'checkmark';
            data[i].querySelector('.ionic-step-header-icon').classList.remove('error');
            data[i].querySelector('.ionic-step-header-icon').classList.add('success');
          } else {
            this.onboardingFormStatus[i]['icon'] = 'time';
            data[i].querySelector('.ionic-step-header-icon').classList.remove('success');
            data[i].querySelector('.ionic-step-header-icon').classList.add('error');
          }
          // } else {
          //   this.onboardingFormStatus[i]['icon'] = 'time';
          //   this.onboardingFormStatus[i]['status'] = '0%';
          //   data[i].querySelector('.ionic-step-header-icon').classList.remove('success');
          //   data[i].querySelector('.ionic-step-header-icon').classList.add('error');
          // }
          // alert(JSON.stringify(currentScope.onboardingFormStatus));
          // if (i == 0) {
          //   data[i].querySelector('.ionic-step-header-icon').classList.add('success');
          // } else {
          //   data[i].querySelector('.ionic-step-header-icon').classList.add('error');
          // }
          data[i].addEventListener('click', function () {
            currentScope.getIndex(i);
          });
        }
        this.stepper.setStep(-1)
        this.stepper.selectedIndex = -1;
        this.stepper._changeDetectorRef.markForCheck();

      });
    });
  }
  getIndex(index) {
    //index = index - 1;
    this.stepper.selectedIndex = index;
    this.stepper._changeDetectorRef.markForCheck();
  }
  updateEmpDetails(name, index) {
    let obj = {
      'name': name,
      'index': index
    }
    this.navCtrl.push(onboardingNewEmployee, { pageData: obj });
  }
}