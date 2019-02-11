import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { onboardingNewEmployee } from '../onboardingNewEmployee/onboardingNewEmployee';
import { Storage } from '@ionic/storage';

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
      console.log('index = ' + currentIndex);

      console.log(currentIndex);

      this.storage.get('OnBoardingData').then((localStoragedData) => {
        //obj[this.wizardObj[this.currentIndex]['key']] = data['data'];
        console.log(localStoragedData);
        console.log(localStoragedData['actionRequired']);
        this.employeeName = localStoragedData['actionRequired'][currentIndex]['personalDetails']['employeeName'];
        this.employeeCode = localStoragedData['actionRequired'][currentIndex]['personalDetails']['employeeCode'];
        for (let list in localStoragedData['actionRequired'][currentIndex]) {
          objDataKeys.push(list);
          // alert(list);
        }
        for (let i = 0; i < data.length; i++) {
          if (this.onboardingFormStatus[i]['key'] == objDataKeys[i]) {
            this.onboardingFormStatus[i]['icon'] = 'checkmark';
            this.onboardingFormStatus[i]['status'] = '100%';
            data[i].querySelector('.ionic-step-header-icon').classList.remove('error');
            data[i].querySelector('.ionic-step-header-icon').classList.add('success');
          } else {
            this.onboardingFormStatus[i]['icon'] = 'time';
            this.onboardingFormStatus[i]['status'] = '0%';
            data[i].querySelector('.ionic-step-header-icon').classList.remove('success');
            data[i].querySelector('.ionic-step-header-icon').classList.add('error');
          }
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