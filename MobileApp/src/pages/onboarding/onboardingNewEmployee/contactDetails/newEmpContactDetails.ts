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
  addressProofImage;
  totalStates = [
    { name: 'Assam', key: 'assam' },
    { name: 'Andhra Pradesh', key: 'andhrapradesh' },
    { name: 'Odisha', key: 'odisha' },
    { name: 'Punjab', key: 'punjab' },
    { name: 'Delhi', key: 'delhi' },
    { name: 'Gujarat', key: 'gujarat' },
    { name: 'Karnataka', key: 'karnataka' },
    { name: 'Haryana', key: 'haryana' },
    { name: 'Rajasthan', key: 'rajasthan' },
    { name: 'Himachal Pradesh', key: 'himachalpradesh' },
    { name: 'Jharkand', key: 'jharkand' },
    { name: 'Chhattisgarh', key: 'chhattisgarh' },
    { name: 'Kerala', key: 'kerala' },
    { name: 'Tamil Nadu', key: 'tamilnadu' },
    { name: 'Madhya Pradesh', key: 'madhyapradesh' },
    { name: 'Bihar', key: 'bihar' },
    { name: 'Maharashtra', key: 'maharashtra' },
    { name: 'Chandigarh', key: 'chandigarh' },
    { name: 'Telangana', key: 'telangana' },
    { name: 'Jammu and Kashmir', key: 'jammu and kashmir' },
    { name: 'Tripura', key: 'tripura' },
    { name: 'Meghalaya', key: 'meghalaya' },
    { name: 'Goa', key: 'goa' },
    { name: 'Arunachal Pradesh', key: 'arunachalpradesh' },
    { name: 'Manipur', key: 'manipur' },
    { name: 'Mizoram', key: 'mizoram' },
    { name: 'Sikkim', key: 'sikkim' },
    { name: 'Puduchery', key: 'puduchery' },
    { name: 'Nagaland', key: 'nagaland' },
    { name: 'Andaman and Nicobhar', key: 'andaman and nicobhar' },
    { name: 'Dadra and Nagar Haveli', key: 'dasra and nagarhaveli' },
    { name: 'Daman and Diu', key: 'daman and diu' },
    { name: 'Lakshadweep', key: 'lakshadweep' }
  ]
  constructor(private fb: FormBuilder, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }
  ngOnInit() {

    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
    });
    this.onboardingContactDetailsForm = this.fb.group({
      contactNumber: ['', [Validators.required]],
      emergencyConatctNo: ['', [Validators.required]],
      communicationAddress: this.fb.array([this.addCommunicationAddress()]),
      permanentAddress: this.fb.array([this.addPermanentAddress()])
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
      //console.log('contact form = ' + status);
      console.log(this.onboardingContactDetailsForm.value);
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

  addCommunicationAddress(): FormGroup {
    return this.fb.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
    });
  }
  addPermanentAddress(): FormGroup {
    return this.fb.group({
      address: [''],
      city: [''],
      state: [''],
    });
  }
  getProofmage() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")
      this.addressProof = imageData;
      this.addressProofImage = true;
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
    if (this.formStatusValues['status'] && this.addressProofImage) {
      this.formStatusValues['data']['addressProof'] = this.addressProof;
      let contactNo = JSON.stringify(this.formStatusValues['data']['emergencyConatctNo']);
      //this.formStatusValues['data']['emergencyConatctNo'] = [];
      this.formStatusValues['data']['emergencyConatctNo'] = [contactNo]
      //this.formStatusValues['data']['emergencyConatctNo'];
      this.messageService.formDataMessage(this.formStatusValues);
    } else {
      this.messageService.formDataMessage({ status: false, data: {} });
    }
  }
  imgErrorFunction() {
    this.addressProofImage = false;
  }
  imgSuccessLoaded() {
    this.addressProofImage = true;
  }
  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex]) {

        if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('contactNumber')) {

          console.log(localStoragedData['actionRequired'][this.storedIndex]);

          this.addressProof = localStoragedData['actionRequired'][this.storedIndex]['addressProof'];
          this.onboardingContactDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
          this.onboardingContactDetailsForm.controls['emergencyConatctNo'].setValue(localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0]);
          // for (let list in localStoragedData['actionRequired'][this.storedIndex]['contactDetails']) {
          //   this.onboardingContactDetailsForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex]['contactDetails'][list]);
          // }
        }
      }
    });
  }
  ngOnDestroy() {
    this.onboardingContactDetailsSubscription.unsubscribe();
  }
}