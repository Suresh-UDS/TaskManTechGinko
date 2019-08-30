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
  remainTotal = 100;
  nomineeTotalPercentage;
  private relationships: any;
  constructor(private fb: FormBuilder, private storage: Storage, private messageService: onBoardingDataService) { }

  ngOnInit() {

    this.getNomineeRelationships();

    this.onboardingFamilyAcademicForm = this.fb.group({
      educationQualification: this.fb.array([this.setEducation()]),
      nomineeDetail: this.fb.array([])
    });

    let getEpfCount;
    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      this.storage.get('OnBoardingData').then(localStoragedData => {
        console.log('empfamily data ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
        if (localStoragedData['actionRequired'][this.storedIndex]) {
          if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('nomineeDetail')
            && localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'] != null) {
            getEpfCount = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'].length;
            console.log('empfamily ' + getEpfCount);
            if (getEpfCount > 0) {
              for (let i = 0; i < getEpfCount; i++) {
                this.addNominees();
              }
              this.updateFormData();
            } else {
              getEpfCount = undefined;
            }
          } else {
            console.log('empfamily else');
            this.addNominees();
          }
        } else {
          console.log('empfamily store');
        }
      });
      // if (getEpfCount === undefined) {
      //   this.addNominees();
      //   console.log('empfamily else222 ' + getEpfCount);
      // }
    });

    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingFamilyAcademicForm.reset();
      }
    });

    this.onboardingFamilyAcademicSubscription = this.onboardingFamilyAcademicForm.statusChanges.subscribe(status => {
      console.log(status);
      console.log(this.onboardingFamilyAcademicForm.value)

      let totPercent = 0;
      console.log('nominee_length ' + this.nomineeForms.length);
      for (let i = 0; i < this.nomineeForms.length; i++) {
        console.log('nominee_length_per= ' + JSON.stringify(this.nomineeForms.controls[i]['controls']['nominePercentage'].value));
        if (this.nomineeForms.controls[i]['controls']['nominePercentage'].value !== null) {
          totPercent = totPercent + this.nomineeForms.controls[i]['controls']['nominePercentage'].value;;
          console.log('nominee_length_perrr ' + JSON.stringify(totPercent));
        }
        if (totPercent > 100) {
          console.log('nominee_length_per_100 ' + JSON.stringify(totPercent));
        } else {
          this.remainTotal = 100 - totPercent;
          //gopicg
        }
      }

      if (totPercent == 100 && status == 'VALID') {
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
      institute: ['']
    });
  }
  addNominees() {
    const nominee = this.fb.group({
      name: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      contactNumber: [''],
      nominePercentage: ['', [Validators.required, Validators.max(this.remainTotal)]]
    })
    this.nomineeForms.push(nominee);
  }

  updateFormData() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('educationQualification')) {
        console.log('fam_datta === ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
        this.onboardingFamilyAcademicForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
      }
    });
  }

  removeNominees(index) {
    console.log('empfam2- ' + index + ' - ' + this.nomineeForms.at(index));
    this.nomineeForms.removeAt(index);
  }


  ngOnDestroy() {
    this.onboardingFamilyAcademicSubscription.unsubscribe();
  }

  getNomineeRelationships(){
    this.storage.get('nomineeRelationships').then(relationships=>{
      console.log("Relationships");
      console.log(relationships);
      this.relationships = relationships;
    })
  }
}
