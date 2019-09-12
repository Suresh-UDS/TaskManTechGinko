import { Component, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { NgForm, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { componentService } from '../../../service/componentService';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'page-empEmployeementDetails-new',
  templateUrl: 'newEmpEmployeementDetails.html',
})
export class newEmpEmployeementDetails implements OnInit, AfterViewInit {

  // @ViewChild('onboardingEmployeeMentForm') onboardingEmployeeMentForm: NgForm;
  onboardingEmployeeMentForm: FormGroup;
  onboardingEmployeementSubscription
  formStatusValues;
  //employeeFormData = {}
  // addMorePFData = [];
  storedIndex;
  // getStoredEpfCount;
  earlierEmployer: any;
  setMinDate;
  // filteredMinDate;
  pipe = new DatePipe('en-US');
  formActionStatus;
  constructor(private fb: FormBuilder, public componentService: componentService, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }

  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      this.formActionStatus = data['action'];

    });

    this.onboardingEmployeeMentForm = this.fb.group({
      previousEmployee: this.fb.array([this.addPreviousEmp()])
    });

    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingEmployeeMentForm.reset();
      }
    });

    this.onboardingEmployeementSubscription = this.onboardingEmployeeMentForm.statusChanges.subscribe(status => {
      console.log('EMPfromTo ==' + JSON.stringify(this.onboardingEmployeeMentForm.value));
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingEmployeeMentForm.value
        }
        this.storage.get('OnBoardingData').then(localStoragedData => {
          if(localStoragedData && localStoragedData['actionRequired'] && localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']){
            localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]['isEmploymentEarlier'] = 
            this.formStatusValues['data']['previousEmployee'][0]['isEmploymentEarlier'];
            localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]['name'] = 
            this.formStatusValues['data']['previousEmployee'][0]['name'] ;
            localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]['designation'] = this.formStatusValues['data']['previousEmployee'][0]['designation'] ;
            this.storage.set('OnBoardingData',localStoragedData);
            
          }
        });

          this.messageService.formDataMessage(this.formStatusValues);
      } else {
        this.formStatusValues = {
          status: false,
          data: {}
        }
        this.messageService.formDataMessage(this.formStatusValues);
      }
    });
  }

  setMinValidation() {

    console.log('EMPfromTo Validation');

    let fromEmployed = this.nomineeForms.controls[0]['controls']['fromEmployed'].value;
    let toEmployed = this.nomineeForms.controls[0]['controls']['toEmployed'].value;

    if (fromEmployed) {
      var formattedMinDate = moment(fromEmployed, "YYYY-MM-DD").add(60, 'days').format('YYYY-MM-DD');
      this.setMinDate = formattedMinDate;
    }

    if (toEmployed < formattedMinDate) {
      this.nomineeForms.controls[0]['controls']['toEmployed'].setValue('');
    }
    console.log('EMPfromTo Date2-', fromEmployed + ' - ' + toEmployed);
  }


  get nomineeForms() {
    return this.onboardingEmployeeMentForm.get('previousEmployee') as FormArray
  }

  SetEarlierEmp() {

    console.log('EMPfromTo Date3-', 'setearlier');
    let value = this.nomineeForms.controls[0]['controls']['isEmploymentEarlier']['value'];

    let empName = this.nomineeForms.controls[0]['controls']['name'];
    // let fromEmp = this.nomineeForms.controls[0]['controls']['fromEmployed'];
    // let toEmp = this.nomineeForms.controls[0]['controls']['toEmployed'];

    let empDesignation = this.nomineeForms.controls[0]['controls']['designation'];
    // let empAddress = this.nomineeForms.controls[0]['controls']['address'];
    // let empAreaWork = this.nomineeForms.controls[0]['controls']['areaOfWork'];

    if (!value) {
      this.earlierEmployer = false;
      empName.clearValidators();
      empName.disable();

      empDesignation.clearValidators();
      empDesignation.disable();

    } else {
      this.earlierEmployer = true;
      empName.setValidators([Validators.required]);
      empName.enable();
     
      empDesignation.setValidators([Validators.required]);
      empDesignation.enable();
      
    }
  }

  addPreviousEmp(): FormGroup {
    return this.fb.group({
      isEmploymentEarlier: [true],
      name: [''],
      // fromEmployed: [''],
      // toEmployed: [''],
      designation: [''],
      // address: [''],
      // areaOfWork: ['']
    })
  }



  ngAfterViewInit() {
    //let curretScope = this;
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex]) {
        if (localStoragedData['actionRequired'][this.storedIndex]['employmentDetails'] && localStoragedData['actionRequired'][this.storedIndex]['employmentDetails'].hasOwnProperty('previousEmployee')) {
          if (localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']) {
            
            console.log('EMPfromTo_dt2--' + JSON.stringify(localStoragedData['actionRequired']
            [this.storedIndex]['previousEmployee']));

            this.onboardingEmployeeMentForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']  );

          }else{
            this.onboardingEmployeeMentForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]  );

            console.log('EMPfromTo_dt2--' + JSON.stringify(localStoragedData['actionRequired']
            [this.storedIndex]));

            // this.nomineeForms.controls[0]['controls']['fromEmployed'].setValue(fromempDate);
            // this.nomineeForms.controls[0]['controls']['toEmployed'].setValue(toEmpDate);

          }
        }
      }
      this.SetEarlierEmp();
    });
  }


  ngOnDestroy() {
    this.onboardingEmployeementSubscription.unsubscribe();
  }
}
