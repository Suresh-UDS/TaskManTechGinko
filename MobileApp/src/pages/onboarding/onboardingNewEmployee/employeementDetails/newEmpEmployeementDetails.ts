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

  constructor(private fb: FormBuilder, public componentService: componentService, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }

  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
    });
    // this.storage.get('OnBoardingData').then(localStoragedData => {
    //   if (localStoragedData['actionRequired'].length && localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']) {
    //     this.getStoredEpfCount = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['totalEpf'];
    //   }
    // });
    this.onboardingEmployeeMentForm = this.fb.group({
      previousEmployee: this.fb.array([this.addPreviousEmp()])
    });

    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingEmployeeMentForm.reset();
      }
    });

    this.onboardingEmployeementSubscription = this.onboardingEmployeeMentForm.statusChanges.subscribe(status => {
      console.log(this.onboardingEmployeeMentForm.value)
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingEmployeeMentForm.value
        }
        this.messageService.formDataMessage(this.formStatusValues);
      } else {
        this.formStatusValues = {
          status: false,
          data: {}
        }
        this.messageService.formDataMessage(this.formStatusValues);
      }
      //this.sendValidationMessage();
    });
    // this.onboardingEmployeeMentForm.controls['fromEmployed'].valueChanges.subscribe(value => {
    //   this.setMinValidation(value);
    // });
  }

  setMinValidation() {

    let value = this.nomineeForms.controls[0]['controls']['fromEmployed'].value;
    let toEmployed = this.nomineeForms.controls[0]['controls']['toEmployed'].value;
    if (value) {

      var formattedMinDate = moment(value, "YYYY-MM-DD").add(60, 'days').format('YYYY-MM-DD');
      //var formattedMinDate = moment(value, "YYYY-MM-DD").add(30, 'days');
      // var mindate = new Date(value);
      // var formattedMinDate = mindate.setDate(mindate.getDate() + 30);
      // var formattedFinalDate = new Date(formattedMinDate);
      //this.filteredMinDate = this.pipe.transform(formattedFinalDate, 'yyyy-MM-dd');
      //var filteredDate = this.pipe.transform(formattedMinDate, 'yyyy-MM-dd');
      this.setMinDate = formattedMinDate;
    }

    if (toEmployed < formattedMinDate) {
      this.nomineeForms.controls[0]['controls']['toEmployed'].setValue('');
      //this.onboardingEmployeeMentForm.controls['toEmployed'].setValue('');
    }
  }
  get nomineeForms() {
    return this.onboardingEmployeeMentForm.get('previousEmployee') as FormArray
  }

  SetEarlierEmp() {
    // console.log(this.nomineeForms.controls['isEmploymentEarlier'].value);
    let value = this.nomineeForms.controls[0]['controls']['isEmploymentEarlier']['value'];
    // alert(value);
    //const value = this.addressData.controls[0]['controls']['address']['value'];
    //console.log(value);
    //this.addressData.controls[0]['controls']['city'].disable();

    let empName = this.nomineeForms.controls[0]['controls']['name'];
    let fromEmp = this.nomineeForms.controls[0]['controls']['fromEmployed'];
    let toEmp = this.nomineeForms.controls[0]['controls']['toEmployed'];

    let empDesignation = this.nomineeForms.controls[0]['controls']['designation'];
    let empAddress = this.nomineeForms.controls[0]['controls']['address'];
    let empAreaWork = this.nomineeForms.controls[0]['controls']['areaOfWork'];

    // let empDesignation = this.onboardingEmployeeMentForm.get('employeeDesignation');
    // let empAddress = this.onboardingEmployeeMentForm.get('employeeAddress');
    // let empAreaWork = this.onboardingEmployeeMentForm.get('employeeAreaOfWork');

    if (!value) {
      this.earlierEmployer = false;
      empName.clearValidators();
      empName.disable();
      fromEmp.clearValidators();
      fromEmp.disable();
      toEmp.clearValidators();
      toEmp.disable();

      empDesignation.clearValidators();
      empDesignation.disable();

      empAddress.clearValidators();
      empAddress.disable();

      empAreaWork.clearValidators();
      empAreaWork.disable();

    } else {
      this.earlierEmployer = true;
      empName.setValidators([Validators.required]);
      empName.enable();
      fromEmp.setValidators([Validators.required]);
      fromEmp.enable();
      toEmp.setValidators([Validators.required]);
      toEmp.enable()
      empDesignation.setValidators([Validators.required]);
      empDesignation.enable();
      empAddress.setValidators([Validators.required]);
      empAddress.enable();
      empAreaWork.setValidators([Validators.required]);
      empAreaWork.enable();
    }
  }

  addPreviousEmp(): FormGroup {
    return this.fb.group({
      isEmploymentEarlier: [false],
      name: [''],
      fromEmployed: [''],
      toEmployed: [''],
      designation: [''],
      address: [''],
      areaOfWork: ['']
    })
  }

  // sendValidationMessage() {
  //   if (this.formStatusValues['status']) {
  //     this.messageService.formDataMessage(this.formStatusValues);
  //   } else {
  //     this.messageService.formDataMessage({ status: false, data: {} });
  //   }
  // }

  // addMoreEpf() {
  //   let length = this.addMorePFData.length + 1
  //   let nextArray = {
  //     earlierEPF52: 'earlierEPF52_' + length,
  //     earlierEPF55: 'earlierEPF55_' + length,
  //     uanYearOfPrevExperience: 'uanYearOfPrevExperience_' + length,
  //     prevPFMemberId: 'prevPFMemberId_' + length,
  //     dateOfExist: 'dateOfExist_' + length,
  //     esiNo: 'esiNo_' + length
  //   }
  //   for (let list in nextArray) {
  //     if(list == 'earlierEPF52' || list == 'earlierEPF55') {
  //       this.onboardingEmployeeMentForm.addControl(nextArray[list], new FormControl(false, [Validators.required]));
  //     } else {
  //       this.onboardingEmployeeMentForm.addControl(nextArray[list], new FormControl('', [Validators.required]));
  //     }
  //   }
  //   this.addMorePFData.push(nextArray);
  //   if (this.getStoredEpfCount == this.addMorePFData.length) {
  //     this.componentService.showLoader("Loading ....");
  //     this.updateFormData();
  //   }
  //   // this.addDynamicForm(nextArray);
  // }


  // removeEpf(listData, index) {
  //   for (let list in listData) {
  //     console.log(list);
  //     this.onboardingEmployeeMentForm.removeControl(listData[list]);
  //   }
  //   this.addMorePFData.splice(index, 1);
  //   this.sendValidationMessage();
  // }

  ngAfterViewInit() {
    //let curretScope = this;
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex]) {
        if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('previousEmployee')) {
          this.onboardingEmployeeMentForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);

          var fromempDate = moment(localStoragedData['actionRequired'][this.storedIndex]['fromEmployed'], 'DD-MM-YYYY').format('YYYY-MM-DD');
          var toEmpDate = moment(localStoragedData['actionRequired'][this.storedIndex]['toEmployed'], 'DD-MM-YYYY').format('YYYY-MM-DD');

          this.nomineeForms.controls[0]['controls']['fromEmployed'].setValue(fromempDate);
          this.nomineeForms.controls[0]['controls']['toEmployed'].setValue(toEmpDate);

          // this.addressProof = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['addressProof'];
          // for (let list in localStoragedData['actionRequired'][curretScope.storedIndex]['employmentDetails']) {
          //   curretScope.onboardingEmployeeMentForm.controls[list].setValue(localStoragedData['actionRequired'][curretScope.storedIndex]['employmentDetails'][list]);
          // }
        }
      }
      this.SetEarlierEmp();
    });
  }
  ngOnDestroy() {
    this.onboardingEmployeementSubscription.unsubscribe();
  }
}