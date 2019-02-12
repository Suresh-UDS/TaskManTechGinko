import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-personalDetails-new',
  templateUrl: 'newEmpPersonalDetails.html',
})
export class newEmpPersonalDetail implements OnInit, AfterViewInit {

  onboardingPersonalDetailsForm: FormGroup;
  onboardingPersonalDetailsSubscription;
  storedIndex;
  setMinDate: any;
  pipe = new DatePipe('en-US');
  constructor(private fb: FormBuilder, private storage: Storage, private messageService: onBoardingDataService) { }
  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(index => {
      this.storedIndex = index;
    })
    this.onboardingPersonalDetailsForm = this.fb.group({
      employeeCode: [''],
      employeeName: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      dateOfJoining: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      // caste: new FormControl('', [Validators.required]),
      bloodGroup: [''],
      // SpeciallyAbled: new FormControl('', [Validators.required]),
      identificationMark1: ['', [Validators.required]],
      identificationMark2: ['']
    });

    this.onboardingPersonalDetailsForm.controls['dateOfBirth'].valueChanges.subscribe(value => {

      this.setMinValidation(value);
      // const dateOfJoining = this.onboardingPersonalDetailsForm.get('dateOfJoining');
      // const minDate = new Date(value);
      // console.log(minDate)
      // dateOfJoining.setValidators([Validators.required, Validators.min(minDate)]);
    });

    // ngAfterViewInit() {
    //   let currentIndex = window.localStorage.getItem('onboardingCurrentIndex');
    //   this.storage.get('OnBoardingData').then((localStoragedData) => {
    // }
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingPersonalDetailsForm.reset();
      }
    })

    this.onboardingPersonalDetailsSubscription = this.onboardingPersonalDetailsForm.statusChanges.subscribe(status => {
      // let dateOfBirth = this.onboardingPersonalDetailsForm.get('dateOfBirth').value;
      // let dateOfJoining = this.onboardingPersonalDetailsForm.get('dateOfJoining').value;
      // if (dateOfBirth) {
      //   var mindate = new Date(dateOfBirth);
      //   var formattedMinDate = mindate.setDate(mindate.getDate() + 89);
      //   var formattedFinalDate = new Date(formattedMinDate);
      //   var filteredDate = this.pipe.transform(formattedFinalDate, 'yyyy-MM-dd');
      //   this.setMinDate = filteredDate;
      // }
      // if (!dateOfJoining) {
      //   this.onboardingPersonalDetailsForm.controls['dateOfJoining'].setValue('');
      // }

      console.log('status = ' + status);
      if (status == 'VALID') {
        let fromStatusValues = {
          status: true,
          data: this.onboardingPersonalDetailsForm.value
        }
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
      var mindate = new Date(value);
      var formattedMinDate = mindate.setDate(mindate.getDate() + 5110);
      var formattedFinalDate = new Date(formattedMinDate);
      var filteredDate = this.pipe.transform(formattedFinalDate, 'yyyy-MM-dd');
      console.log('filter date = ' + filteredDate);
      this.setMinDate = filteredDate;
    }
    let dateOfJoining = this.onboardingPersonalDetailsForm.get('dateOfJoining').value;
    if (!dateOfJoining || dateOfJoining < filteredDate) {
      this.onboardingPersonalDetailsForm.controls['dateOfJoining'].setValue('');
    }
  }
  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex]) {
        console.log(localStoragedData);
        for (let list in localStoragedData['actionRequired'][this.storedIndex]['personalDetails']) {
          this.onboardingPersonalDetailsForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex]['personalDetails'][list]);
        }
        this.setMinValidation(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth']);
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