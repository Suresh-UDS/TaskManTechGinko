import { Component, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { componentService } from '../../../service/componentService';
import { DatePipe } from '@angular/common';

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
  filteredMinDate;
  pipe = new DatePipe('en-US');

  constructor(public componentService: componentService, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }

  ngOnInit() {
    this.storage.get('onboardingCurrentIndex').then(index => {
      this.storedIndex = index;
    });
    // this.storage.get('OnBoardingData').then(localStoragedData => {
    //   if (localStoragedData['actionRequired'].length && localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']) {
    //     this.getStoredEpfCount = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['totalEpf'];
    //   }
    // });
    this.onboardingEmployeeMentForm = new FormGroup({
      isEmploymentEarlier: new FormControl(false, [Validators.required]),
      employeeName: new FormControl('', [Validators.required]),
      fromEmployed: new FormControl('', [Validators.required]),
      toEmployed: new FormControl('', [Validators.required]),
      employeeDesignation: new FormControl('', [Validators.required]),
      employeeAddress: new FormControl('', [Validators.required]),
      employeeAreaOfWork: new FormControl('', [Validators.required])
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
    this.onboardingEmployeeMentForm.controls['fromEmployed'].valueChanges.subscribe(value => {
      console.log("date = " + value);
      let toEmployed = this.onboardingEmployeeMentForm.get('toEmployed').value;
      if (value) {
        var mindate = new Date(value);
        var formattedMinDate = mindate.setDate(mindate.getDate() + 30);
        var formattedFinalDate = new Date(formattedMinDate);
        this.filteredMinDate = this.pipe.transform(formattedFinalDate, 'yyyy-MM-dd');
        this.setMinDate = this.filteredMinDate;
      }
      if (!toEmployed) {
        if (toEmployed < this.filteredMinDate) {
          this.onboardingEmployeeMentForm.controls['toEmployed'].setValue('');
        }
      } else {
        this.onboardingEmployeeMentForm.controls['toEmployed'].setValue('');
      }
    });
  }

  SetEarlierEmp() {
    let value = this.onboardingEmployeeMentForm.get('isEmploymentEarlier').value;

    // alert(value);

    let empName = this.onboardingEmployeeMentForm.get('employeeName');
    let fromEmp = this.onboardingEmployeeMentForm.get('fromEmployed');
    let toEmp = this.onboardingEmployeeMentForm.get('toEmployed');

    let empDesignation = this.onboardingEmployeeMentForm.get('employeeDesignation');
    let empAddress = this.onboardingEmployeeMentForm.get('employeeAddress');
    let empAreaWork = this.onboardingEmployeeMentForm.get('employeeAreaOfWork');

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
    let curretScope = this;
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'].length && localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('employmentDetails')) {
        // this.addressProof = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['addressProof'];
        for (let list in localStoragedData['actionRequired'][curretScope.storedIndex]['employmentDetails']) {
          curretScope.onboardingEmployeeMentForm.controls[list].setValue(localStoragedData['actionRequired'][curretScope.storedIndex]['employmentDetails'][list]);
        }
      }
    });
    this.SetEarlierEmp();
  }
  ngOnDestroy() {
    this.onboardingEmployeementSubscription.unsubscribe();
  }
}