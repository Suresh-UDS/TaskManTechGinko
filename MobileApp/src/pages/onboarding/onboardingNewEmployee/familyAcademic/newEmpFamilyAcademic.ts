import { Component, OnInit, AfterViewInit } from '@angular/core';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { FormArray, FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-familyAndAcademic-new',
  templateUrl: 'newEmpFamilyAcademic.html',
})
export class newEmpFamilyAndAcademic implements OnInit {

  onboardingFamilyAcademicForm: FormGroup;
  onboardingFamilyAcademicSubscription
  nomineeList: any = [];
  onboardingFamilyAcademicData;
  storedIndex;
  constructor(private fb: FormBuilder, private storage: Storage, private messageService: onBoardingDataService) { }

  ngOnInit() {

    this.onboardingFamilyAcademicForm = this.fb.group({
      educationQualification: this.fb.array([this.setEducation()]),
      nomineeDetail: this.fb.array([])
    });
    this.storage.get('onboardingCurrentIndex').then(index => {
      this.storedIndex = index;
      this.storage.get('OnBoardingData').then(localStoragedData => {
        if (localStoragedData['actionRequired'][this.storedIndex]) {
          if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('nomineeDetail')) {
            let getEpfCount = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'].length;
            if (getEpfCount > 0) {
              for (let i = 0; i < getEpfCount; i++) {
                this.addNominees();
              }
              this.updateFormData();

            } else {
              this.addNominees();
            }
          } else {
            this.addNominees();
          }
        }

      });
    })
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingFamilyAcademicForm.reset();
      }
    })

    this.onboardingFamilyAcademicSubscription = this.onboardingFamilyAcademicForm.statusChanges.subscribe(status => {
      console.log(status);
      console.log(this.onboardingFamilyAcademicForm.value)
      if (status == 'VALID') {
        let formStatusValues = {
          status: true,
          data: this.onboardingFamilyAcademicForm.value
        }
        //formStatusValues['data']['totalNomiee'] = this.nomineeList.length;
        this.messageService.formDataMessage(formStatusValues);
      } else {
        let formStatusValues = {
          status: false,
          data: {}
        }
        this.messageService.formDataMessage(formStatusValues);
      }
    });
  }
  get nomineeForms() {
    return this.onboardingFamilyAcademicForm.get('nomineeDetail') as FormArray
  }
  setEducation(): FormGroup {
    return this.fb.group({
      qualification: ['', [Validators.required]],
      institute: ['', [Validators.required]]
    });
  }
  addNominees() {
    //alert('====');
    //alert(this.onboardingFamilyAcademicForm.value);
    const nominee = this.fb.group({
      name: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      contactNumber: [''],
      nominePercentage: ['', [Validators.required, Validators.max(100)]]
    })
    this.nomineeForms.push(nominee);
    // let length = this.nomineeList.length + 1;
    // if (length <= 3) {
    //   let obj = {
    //     name: 'nomineeName' + length,
    //     relationShip: 'nomineeRelationShip' + length,
    //     percentage: 'nomineePercentage' + length,
    //     contactNumber: 'nomineeContactNumber' + length
    //   }
    //   //this.addDynamicForm(obj);
    //   // alert(obj.name);
    //   this.onboardingFamilyAcademicForm.addControl(obj.name, new FormControl('', [Validators.required]));
    //   this.onboardingFamilyAcademicForm.addControl(obj.relationShip, new FormControl('', [Validators.required]));
    //   this.onboardingFamilyAcademicForm.addControl(obj.percentage, new FormControl('', [Validators.required, Validators.max(100)]));
    //   this.onboardingFamilyAcademicForm.addControl(obj.contactNumber, new FormControl(''));

    //   this.nomineeList.push(obj);
    // this.nomineeList.push(obj);
    //this.setValidation(obj);

    //}
  }
  updateFormData() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('educationQualification')) {
        console.log('datta ===');
        console.log(localStoragedData);
        this.onboardingFamilyAcademicForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
        // for (let list in localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']) {
        //   this.onboardingFamilyAcademicForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails'][list]);
        // }
      }
    });
  }
  //addDynamicForm(objectValues) {
  // let currentScope = this;
  // for (let list in objectValues) {
  //   //alert(objectValues[list]);
  //   //alert('=======');
  //   //alert(currentScope.onboardingFamilyAcademicForm.value);
  //   //currentScope.onboardingFamilyAcademicForm.addControl(objectValues[list], new FormControl('', [Validators.required]));
  // }
  // this.nomineeList.push(objectValues);
  //this.index = this.index + 1;
  //}
  removeNominees(index) {
    this.nomineeForms.removeAt(index);
  }
  // ngAfterViewInit() {

  // }
  // setValidation(obj) {
  //   let formControls = {};
  //   formControls[obj['name']] = new FormControl('', [Validators.required]);
  //   formControls[obj['relationShip']] = new FormControl('', [Validators.required]);
  //   formControls[obj['percentage']] = new FormControl('', [Validators.required]);
  //   const arrayControl = <FormArray>this.onboardingFamilyAcademicForm.controls['formArray'];
  //   let newGroup = this.formBuilder.group(formControls);
  //   arrayControl.push(newGroup);

  //this.onboardingFamilyAcademicForm.addControl(obj['name'], new FormControl('', [Validators.required]));
  //this.onboardingFamilyAcademicForm.controls[obj['name']].setValidators([Validators.required]);
  //this.onboardingFamilyAcademicForm.get(obj['name']).updateValueAndValidity();

  //this.onboardingFamilyAcademicForm.addControl(obj['relationShip'], new FormControl('', [Validators.required]));
  // this.onboardingFamilyAcademicForm.controls[obj['relationShip']].setValidators([Validators.required]);
  //this.onboardingFamilyAcademicForm.get(obj['relationShip']).updateValueAndValidity();

  //this.onboardingFamilyAcademicForm.addControl(obj['percentage'], new FormControl('', [Validators.required]));
  // this.onboardingFamilyAcademicForm.controls[obj['percentage']].setValidators([Validators.required]);
  //this.onboardingFamilyAcademicForm.get(obj['percentage']).updateValueAndValidity();
  //}

  ngOnDestroy() {
    this.onboardingFamilyAcademicSubscription.unsubscribe();
  }
}