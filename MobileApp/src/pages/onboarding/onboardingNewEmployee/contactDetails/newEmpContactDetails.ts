import { Component, OnInit } from '@angular/core';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { FormGroup, FormControl, Validators, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-contactDetails-new',
  templateUrl: 'newEmpContactDetails.html',
})
export class newEmpContactDetails implements OnInit {

  addressProof = 'assets/imgs/placeholder.png'
  onboardingContactDetailsForm: FormGroup;
  onboardingContactDetailsSubscription;
  formStatusValues: any = {};
  storedIndex;
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  PhoneNumberErrorMessage;
  totalStates = [
    { name: 'Assam' },
    { name: 'Andhra Pradesh' },
    { name: 'Odisha' },
    { name: 'Punjab' },
    { name: 'Delhi' },
    { name: 'Gujarat' },
    { name: 'Karnataka' },
    { name: 'Haryana' },
    { name: 'Rajasthan' },
    { name: 'Himachal Pradesh' },
    { name: 'Jharkand' },
    { name: 'Chhattisgarh' },
    { name: 'Kerala' },
    { name: 'Tamil Nadu' },
    { name: 'Madhya Pradesh' },
    { name: 'Bihar' },
    { name: 'Maharashtra' },
    { name: 'Chandigarh' },
    { name: 'Telangana' },
    { name: 'Jammu and Kashmir' },
    { name: 'Tripura' },
    { name: 'Meghalaya' },
    { name: 'Goa' },
    { name: 'Arunachal Pradesh' },
    { name: 'Manipur' },
    { name: 'Mizoram' },
    { name: 'Sikkim' },
    { name: 'Puduchery' },
    { name: 'Nagaland' },
    { name: 'Andaman and Nicobhar' },
    { name: 'Dadra and Nagar Haveli' },
    { name: 'Daman and Diu' },
    { name: 'Lakshadweep' }
  ]
  constructor(private fb: FormBuilder, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }
  ngOnInit() {

    this.storage.get('onboardingCurrentIndex').then(index => {
      this.storedIndex = index;
    });
    this.onboardingContactDetailsForm = this.fb.group({
      contactNumber: ['', [Validators.required]],
      emergencyConatctNo: ['', [Validators.required]],
      communicationAddress: ['', [Validators.required]],
      communicationCity: ['', [Validators.required]],
      communicationState: ['', [Validators.required]],
      permanentAddress: [''],
      permanentCity: [''],
      permanentState: [''],
      checkSameAsPresent: ['']
    });
    this.onboardingContactDetailsForm.setValidators([this.validateNumberMinLength(), this.validateAreNotEqual()]);
    //this.onboardingContactDetailsForm.setValidators(this.validateAreNotEqual());

    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingContactDetailsForm.reset();
        this.addressProof = 'assets/imgs/placeholder.png';
      }
    })

    this.onboardingContactDetailsSubscription = this.onboardingContactDetailsForm.statusChanges.subscribe(status => {
      // console.log(data['contactNumber'].length);
      // //alert(this.onboardingContactDetailsForm.status)

      // if (data['contactNumber'].toString().length == 10) {
      //   this.PhoneNumberErrorMessage = 'Invalid Phone Number';
      //   return;

      // } else if (data['contactNumber'] !== data['emergencyConatctNo']) {
      //   this.PhoneNumberErrorMessage = 'Number length should be 10'
      //   return;
      // } else if ((this.onboardingContactDetailsForm.status == 'VALID') && (data['contactNumber'].length == 10) && (data['contactNumber'] !== data['emergencyConatctNo'])) {
      //   this.formStatusValues = {
      //     status: true,
      //     data: this.onboardingContactDetailsForm.value
      //   }
      //   this.sendValidationMessage();
      // } else {
      //   this.formStatusValues = {
      //     status: false,
      //     data: {}
      //   }
      //   this.sendValidationMessage();
      // }
      console.log('contact form = ' + status);
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingContactDetailsForm.value
        }
      } else {
        this.formStatusValues = {
          status: false,
          data: {}
        }
      }
      this.sendValidationMessage();
    });
  }

  private validateNumberMinLength(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls['contactNumber'];
      if (control1.value) {
        const srtingData = control1.value.toString();
        if (srtingData.length !== 10) {
          control1.setErrors({ shouldMinLength: true });
        }
      }
      return;
    };
  }
  private validateAreNotEqual(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls['contactNumber'];
      const control2 = group.controls['emergencyConatctNo'];
      if (control1.value && control2.value) {
        if (control1.value.toString() === control2.value.toString()) {
          control2.setErrors({ notToEquivalent: true });
        }
      }
      return;
    };
  }
  get pFrom() { return this.onboardingContactDetailsForm.controls; }
  getProofmage() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      //encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA
    };

    this.camera.getPicture(options).then((imageData) => {
      this.addressProof = imageData;
      this.sendValidationMessage();
    })
  }

  // setValuePermanent() {
  //   let value = this.onboardingContactDetailsForm.get('checkSameAsPresent').value;
  //   if (value) {
  //     this.onboardingContactDetailsForm.setValue({
  //       permanentAddress: this.onboardingContactDetailsForm.get('communicationAddress').value,
  //       permanentCity: this.onboardingContactDetailsForm.get('communicationCity').value,
  //       permanentState: this.onboardingContactDetailsForm.get('communicationState').value
  //     })
  //   } else {
  //     this.onboardingContactDetailsForm.setValue({
  //       permanentAddress: '',
  //       permanentCity: '',
  //       permanentState: ''
  //     })
  //   }
  // }

  sendValidationMessage() {
    if (this.formStatusValues['status'] && this.addressProof !== 'assets/imgs/placeholder.png') {
      this.formStatusValues['data']['addressProof'] = this.addressProof;
      this.messageService.formDataMessage(this.formStatusValues);
    } else {
      this.messageService.formDataMessage({ status: false, data: {} });
    }
  }
  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      console.log('contact details');
      if (localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('contactDetails')) {
        console.log('datta ===');
        console.log(localStoragedData);
        this.addressProof = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['addressProof'];
        for (let list in localStoragedData['actionRequired'][this.storedIndex]['contactDetails']) {
          this.onboardingContactDetailsForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex]['contactDetails'][list]);
        }
      }
    });
  }
  ngOnDestroy() {
    this.onboardingContactDetailsSubscription.unsubscribe();
  }
}