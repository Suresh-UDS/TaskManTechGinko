import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Alert } from 'ionic-angular';

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
  // setMinDate: any;
  formActionStatus: any;
  pipe = new DatePipe('en-US');

  constructor(private fb: FormBuilder, private storage: Storage, private messageService: onBoardingDataService) { }
  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(data => {
      console.log(data);
      console.log(data['index']);
      this.storedIndex = data['index'];
      this.formActionStatus = data['action'];
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
          this.onboardingPersonalDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
          // for (let list in localStoragedData['actionRequired'][this.storedIndex]) {
          // this.onboardingPersonalDetailsForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex][list]);
          // }'DD-MM-YYYY').format('YYYY-MM-DD');
       
          this.onboardingPersonalDetailsForm.controls['identificationMark1']
            .setValue(localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][0]);
          this.onboardingPersonalDetailsForm.controls['identificationMark2']
            .setValue(localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][1]);
          this.setMinValidation(localStoragedData['actionRequired'][this.storedIndex]['dateOfBirth']);
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
