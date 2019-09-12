import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Alert } from 'ionic-angular';
import {OnboardingService} from "../../../service/onboarding.service";

@Component({
  selector: 'page-personalDetails-new',
  templateUrl: 'newEmpPersonalDetails.html',
})
export class newEmpPersonalDetail implements OnInit, AfterViewInit {

  onboardingPersonalDetailsForm: FormGroup;
  onboardingPersonalDetailsSubscription;
  storedIndex;
  today;
  minAge;
  maxAge;
  religionList:any[];
  // setMinDate: any;
  formActionStatus: any;
  pipe = new DatePipe('en-US');

  constructor(private fb: FormBuilder, private storage: Storage, private messageService: onBoardingDataService, private onBoardingService: OnboardingService) { }
  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(data => {
      console.log(data);
      console.log(data['index']);
      this.storedIndex = data['index'];
      this.formActionStatus = data['action'];
    })

    this.onBoardingService.getReligionList().subscribe(data=>{
      if(data){
        this.religionList = data;
      }
    })

    this.today = new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toJSON().split('T')[0];
    
    var today = new Date();
    var minAge = 18;
    var maxAge = 58;
   this.minAge = new Date(today.getFullYear() - minAge,  today.getMonth(), today.getDate());
   this.maxAge = new Date(today.getFullYear() - maxAge,  today.getMonth(), today.getDate());

  
    this.onboardingPersonalDetailsForm = this.fb.group({
      employeeCode: [''],
      employeeName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      dateOfJoining: ['', [Validators.required]],
      religion: [''],
      bloodGroup: [''],
      identificationMark1: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      identificationMark2: ['', [ Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      relationshipDetails: this.fb.array([
        this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
          relationship: 'Father', contactNumber: '',
        }),
        this.fb.group({
          name: [''],
          relationship: 'Mother', contactNumber: '',
        })
      ])
    });

    this.onboardingPersonalDetailsForm.controls['dateOfBirth'].valueChanges.subscribe(value => {
      this.setMinValidation(value);  
    });
   
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingPersonalDetailsForm.reset();
      }
    })

    this.onboardingPersonalDetailsSubscription = this.onboardingPersonalDetailsForm.statusChanges.subscribe(status => {
      console.log(this.onboardingPersonalDetailsForm.value);
      if (status == 'VALID') {
        let fromStatusValues = {
          status: true,
          data: this.onboardingPersonalDetailsForm.value
        }
        if (this.formActionStatus == 'add') {
          let obj = {
            // branchName: '',
            // project: [{}]
            //gopi cg
          }
          // fromStatusValues['data'] = obj;
        }
        fromStatusValues['data']['identificationMark'] = [
          fromStatusValues['data']['identificationMark1'],
          fromStatusValues['data']['identificationMark2']
        ]
        // delete fromStatusValues['data']['identificationMark1'];
        // delete fromStatusValues['data']['identificationMark2'];

        this.storage.get('OnBoardingData').then(localStoragedData => {
          if(localStoragedData && localStoragedData['actionRequired'] && localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex]['personalDetails']){
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeCode'] = fromStatusValues['data']['employeeCode'] ? fromStatusValues['data']['employeeCode'] : '';
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeName'] = fromStatusValues['data']['employeeName'] ? fromStatusValues['data']['employeeName'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeName'] ;
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['gender'] =  fromStatusValues['data']['gender']  ?  fromStatusValues['data']['gender'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['gender'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['maritalStatus'] = fromStatusValues['data']['maritalStatus'] ? fromStatusValues['data']['maritalStatus'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['maritalStatus'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfJoining'] =  fromStatusValues['data']['dateOfJoining'] ?  fromStatusValues['data']['dateOfJoining'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfJoining'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['name'] = fromStatusValues['data']['relationshipDetails'][0]['name'] ? fromStatusValues['data']['relationshipDetails'][0]['name'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['name'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['relationship'] =  fromStatusValues['data']['relationshipDetails'][0]['relationship'] ?  fromStatusValues['data']['relationshipDetails'][0]['relationship'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['relationship'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['contactNumber'] = fromStatusValues['data']['relationshipDetails'][0]['contactNumber'] ? fromStatusValues['data']['relationshipDetails'][0]['contactNumber'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['contactNumber'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['contactNumber'] = fromStatusValues['data']['relationshipDetails'][1]['contactNumber'] ? fromStatusValues['data']['relationshipDetails'][1]['contactNumber'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['contactNumber'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['relationship'] = fromStatusValues['data']['relationshipDetails'][1]['relationship'] ? fromStatusValues['data']['relationshipDetails'][1]['relationship'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['relationship'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['name'] = fromStatusValues['data']['relationshipDetails'][1]['name']? fromStatusValues['data']['relationshipDetails'][1]['name'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['name'] ;
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth'] = fromStatusValues['data']['dateOfBirth'] ? fromStatusValues['data']['dateOfBirth'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['religion'] =fromStatusValues['data']['religion'] ? fromStatusValues['data']['religion'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['religion'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['bloodGroup'] = fromStatusValues['data']['bloodGroup'] ? fromStatusValues['data']['bloodGroup'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['bloodGroup'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark1'] = fromStatusValues['data']['identificationMark1'] ? fromStatusValues['data']['identificationMark1'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark1'];
          localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark2'] = fromStatusValues['data']['identificationMark2'] ?  fromStatusValues['data']['identificationMark2'] : localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark2'];
          localStoragedData['actionRequired'][this.storedIndex]['employeeCode'] = fromStatusValues['data']['employeeCode'] ? fromStatusValues['data']['employeeCode'] : '';
          localStoragedData['actionRequired'][this.storedIndex]['employeeName'] =fromStatusValues['data']['employeeName'] ? fromStatusValues['data']['employeeName'] : localStoragedData['actionRequired'][this.storedIndex]['employeeName'] ;
          this.storage.set('OnBoardingData',localStoragedData);
          }
        });

          this.messageService.formDataMessage(fromStatusValues);
      } else {
        let fromStatusValues = {
          status: false,
          data: {}
        }
        this.messageService.formDataMessage(fromStatusValues);
      }
    });
  }

  get pFrom() { return this.onboardingPersonalDetailsForm.controls; }



  setMinValidation(value) {
    if (value) {
      value = new Date(value);
      var formattedMinDate = moment(value, "YYYY-MM-DD").add(5110, 'days').format('YYYY-MM-DD');
      // var formattedMinDate = value.setDate(value.getDate() + 5110);
      // var formattedFinalDate = new Date(formattedMinDate);
      //var filteredDate = this.pipe.transform(formattedMinDate, 'yyyy-MM-dd');
      console.log('filter date = ' + formattedMinDate);
      // this.setMinDate = formattedMinDate;
    }
    let dateOfJoining = this.onboardingPersonalDetailsForm.get('dateOfJoining').value;
    if (dateOfJoining < formattedMinDate) {
      this.onboardingPersonalDetailsForm.controls['dateOfJoining'].setValue('');
    } else {
      this.onboardingPersonalDetailsForm.controls['dateOfJoining'].setValue(formattedMinDate);
    }
  }

  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {    
      if (localStoragedData['actionRequired'][this.storedIndex]) {
        if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('employeeName')) {
          console.log('PERSONAL - ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
          if(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']){
            this.onboardingPersonalDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']);
            this.onboardingPersonalDetailsForm.controls['identificationMark1']
                .setValue(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark'][0]);
            this.onboardingPersonalDetailsForm.controls['identificationMark2']
                .setValue(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark'][1]);
            this.setMinValidation(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth']);
          }else{
            this.onboardingPersonalDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
            this.onboardingPersonalDetailsForm.controls['identificationMark1']
                .setValue(localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][0]);
            this.onboardingPersonalDetailsForm.controls['identificationMark2']
                .setValue(localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][1]);
            this.setMinValidation(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth']);
          }

        }
      }
    });
  }
  // getFormData() {
  //   console.log(this.onboardingPersonalDetailsForm)
  // }
  // setValidation() {
  //   this.onboardingPersonalDetailsForm.controls['personalIndentificationMark2'].setValidators([Validators.required]);
  //   this.onboardingPersonalDetailsForm.get('personalIndentificationMark2').updateValueAndValidity();
  // }
  ngOnDestroy() {
    this.onboardingPersonalDetailsSubscription.unsubscribe();
  }


}
