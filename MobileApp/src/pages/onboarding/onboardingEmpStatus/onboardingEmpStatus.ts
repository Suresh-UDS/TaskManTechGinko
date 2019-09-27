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
  employeeRemarks;
  rejectionStatus;
  constructor(private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.onboardingFormStatus = [
      { name: 'Site Details', key: 'siteDetails', status: '0', icon: 'checkmark' },
      { name: 'Personal Details', key: 'personalDetails', status: '0', icon: 'checkmark' },
      { name: 'Contact Details', key: 'contactDetails', status: '0', icon: 'checkmark' },
      { name: 'Nominee & Academic', key: 'familyAcademicDetails', status: '0', icon: 'checkmark' },
      { name: 'Employment Details', key: 'employmentDetails', status: '0', icon: 'checkmark' },
      { name: 'KYC Details', key: 'kycDetails', status: '0', icon: 'checkmark' },
      { name: 'Declaration', key: 'declaration', status: '0', icon: 'checkmark' }
    ]
  }
  ngAfterViewChecked() { }

  ionViewWillEnter() {

    let objDataKeys = [];
    const currentScope = this;
    const data = document.getElementsByTagName('ion-step-header');

    this.storage.get('onboardingCurrentIndex').then(currentIndex => {

      currentIndex = currentIndex['index'];
      //console.log('index = ' + currentIndex);

      //console.log(currentIndex);

      let objectPercentage = 0;
      let keyPercentage = 0;
      let objectkeys = [];
      let objectValues = [];
      let objectFormattedValues = [];

      this.storage.get('OnBoardingData').then((localStoragedData) => {
        //obj[this.wizardObj[this.currentIndex]['key']] = data['data'];
        //console.log(localStoragedData);
        //console.log(localStoragedData['actionRequired']);
        this.employeeName = localStoragedData['actionRequired'][currentIndex]['employeeName'];
        this.employeeCode = localStoragedData['actionRequired'][currentIndex]['employeeCode'];
        this.employeeRemarks = localStoragedData['actionRequired'][currentIndex]['remarks'] ? localStoragedData['actionRequired'][currentIndex]['remarks'] : '';
        this.rejectionStatus = localStoragedData['actionRequired'][currentIndex]['rejected'] ? localStoragedData['actionRequired'][currentIndex]['rejected'] : false;
        // for (let list in localStoragedData['actionRequired'][currentIndex]) {
        //   objDataKeys.push(list);
        //   // alert(list);
        // }
        for (let i = 0; i < data.length; i++) {

          let keyData = this.onboardingFormStatus[i]['key'];
          //console.log("key data");
          //console.log(this.onboardingFormStatus[i]['key']);
          for (let key in onBoardingModel[keyData]) {
            // console.log("Key - "+key);
            // console.log("KeyData - "+keyData);
            // console.log(localStoragedData['actionRequired'][currentIndex][keyData][key]);
            // console.log('key EmpStatus ' + key + ' - ' + localStoragedData['actionRequired'][currentIndex][keyData][key]);
            

            onBoardingModel[keyData][key] = localStoragedData['actionRequired'][currentIndex][key] ? localStoragedData['actionRequired'][currentIndex][key] : localStoragedData['actionRequired'][currentIndex][keyData][key];

            console.log("Data assigned");
            console.log(onBoardingModel[keyData][key]);
          }

          objectkeys = Object.keys(onBoardingModel[keyData]);
          objectValues = Object['values'](onBoardingModel[keyData]);
          console.log('value_1 ' +  ' / ' + objectkeys + ' / '+ objectValues);

          let objectFormattedValuesLength = 0;
          let objectFormattedKeysLength = 0;

          for(let obv in objectValues){
            // if (data && JSON.stringify(data) !== '{}') {
            //   return data;
            // }
           let dataValue = objectValues[obv];
            if(dataValue){

              if(Array.isArray(dataValue)){

                  let subDataLength = dataValue.length;
                  let subDataValueLength = 0;

                  for(let j in dataValue){
                      
                    if(dataValue[j]){

                      let subSeccondLevelKeysLength = Array.isArray(dataValue[j]) ? dataValue[j].length :  Object.keys(dataValue[j]).length;
                      let subSeccondLevelValues = 0;

                      for(let h in dataValue[j]){

                        if(dataValue[j][h]){

                          subSeccondLevelValues ++;

                        }

                      }

                      let total = (subSeccondLevelValues/subSeccondLevelKeysLength);

                      total = (isNaN(total) || !isFinite(total)) ? 0 :total;

                      subDataValueLength += total;
                    }
                  }

                  let total = (subDataValueLength / subDataLength);

                  total = (isNaN(total) || !isFinite(total)) ? 0 :total;

                  objectFormattedValuesLength += total; 

              }
              else{
                objectFormattedValuesLength ++;
              }
            }

          };


          keyPercentage = (objectFormattedValuesLength / objectkeys.length) * 100
          this.onboardingFormStatus[i]['status'] = Math.floor(keyPercentage) + '%';


          //console.log('key_1', this.onboardingFormStatus[i]['status']);
          this.storage.set('PageStatus',this.onboardingFormStatus);
          
          
          // localStoragedData['actionRequired'][currentIndex]['pageStatus'][i] = Math.floor(keyPercentage);
          // //console.log('key2 EmpStatus ' +   localStoragedData['actionRequired'][currentIndex]['pageStatus'][i]);        
          // this.storage.set('OnBoardingData', localStoragedData);
          // let keyPercentage = 0
          // let objectFormattedValues = [];
          // let objectkeys1 = Object['values'](localStoragedData['actionRequired'][currentIndex][this.onboardingFormStatus[i]['key']]);
          // let objectValues1 = Object['values'](localStoragedData['actionRequired'][currentIndex][this.onboardingFormStatus[i]['key']]);
          // //console.log('value 1 ' +  ' / ' + objectkeys1);
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

