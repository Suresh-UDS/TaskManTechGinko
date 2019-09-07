import { Component, OnInit } from '@angular/core';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { FormGroup, NgForm, FormArray, Validators, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Storage } from '@ionic/storage';
import { normalizeURL, ActionSheet, ActionSheetController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-contactDetails-new',
  templateUrl: 'newEmpContactDetails.html',
})
export class newEmpContactDetails implements OnInit {

  addressProof = ''
  onboardingContactDetailsForm: FormGroup;
  onboardingContactDetailsSubscription;
  formStatusValues: any = {};
  storedIndex;
  IMG_BASE_URL = 'https://s3zappyweb.s3.ap-south-1.amazonaws.com/uat/expenseDocuments/';
  mobnumPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  PhoneNumberErrorMessage;
  addressProofImage = false;
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
    { name: 'Lakshadweep', key: 'lakshadweep' },
    { name: 'Uttarakhand', key: 'uttarakhand' },
    { name: 'Uttar Pradesh', key: 'uttar pradesh' },
    { name: 'West Bengal', key: 'west bengal' },
  ];
  constructor(private fb: FormBuilder, private actionSheetCtrl: ActionSheetController, private file: File,
    private storage: Storage, private filePath: FilePath, private camera: Camera, private messageService: onBoardingDataService) { }
  ngOnInit() {

    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
    });
    this.onboardingContactDetailsForm = this.fb.group({
      checkSameAsPresent: [false],
      contactNumber: ['', [Validators.required]],
      emergencyConatctNo: [''],
      communicationAddress: this.fb.array([this.addCommunicationAddress()]),
      permanentAddress: this.fb.array([this.addPermanentAddress()])
    });
    this.onboardingContactDetailsForm.setValidators([this.validateNumberMinLength(), this.validateAreNotEqual()]);

    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingContactDetailsForm.reset();
        this.addressProof = null;
      }
    });

    this.onboardingContactDetailsSubscription = this.onboardingContactDetailsForm.statusChanges.subscribe(status => {
      console.log('emp_contact2 '+ this.onboardingContactDetailsForm.value);
      console.log('emp_contact3 '+ this.onboardingContactDetailsForm.getRawValue());
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingContactDetailsForm.getRawValue()
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
        } else {
          control1.setErrors(null);
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
        } else {
          control2.setErrors(null);
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

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'choose image from',
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            console.log("Quotation sheet Controller");
            this.getProofmage('')
          }
        },
        {
          text: 'Pick from Gallery',
          handler: () => {
            this.getProofmage('album');
          }
        },
      ]
    });
    actionSheet.present();
  }

  getProofmage(imageType) {
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    if (imageType == 'album') {
      options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log('capture--- ' + imageData);

      let imageURI = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")

      this.filePath.resolveNativePath(imageURI)
        .then(imageURI => {
          console.log(' get file path -- ' + imageURI);

          this.addressProof = imageURI;
          this.addressProofImage = true;
          this.sendValidationMessage();

        });
    })
  }

  get permAddrForm() {
    return this.onboardingContactDetailsForm.get('permanentAddress') as FormArray
  }

  get commAddrForm() {
    return this.onboardingContactDetailsForm.get('communicationAddress') as FormArray
  }

  emptyArray() {
    while (this.permAddrForm.controls.length > 0) {
      this.permAddrForm.removeAt(0);
    }
  }

  setValuePermanent() {

    let values = this.onboardingContactDetailsForm.get('checkSameAsPresent').value;
    console.log('updatedEmpConvalues ' + JSON.stringify(this.commAddrForm.controls[0]['controls']['address'].value));

    this.emptyArray();

    if (values) {
      const addrDt = this.fb.group({
        address: this.commAddrForm.controls[0]['controls']['address'].value,
        city: this.commAddrForm.controls[0]['controls']['city'].value,
        state: this.commAddrForm.controls[0]['controls']['state'].value
      })
      this.permAddrForm.push(addrDt);

    } else {
      const addrDt = this.fb.group({
        address: '',
        city: '',
        state: ''
      })
      this.permAddrForm.push(addrDt);
    }

    console.log('Inside Permanent Code122', 'permanent');

    let address = this.permAddrForm.controls[0]['controls']['address'];
    let city = this.permAddrForm.controls[0]['controls']['city'];
    let state = this.permAddrForm.controls[0]['controls']['state'];
    if (values) {
      console.log('Inside Permanent Code123', 'permanent1');
      city.disable();
      address.disable();
      state.disable();
    } else {
      console.log('Inside Permanent Code1234', 'permanent2');
      address.enable();
      city.enable();
      state.enable();
    }
  }

  sendValidationMessage() {
    if (this.formStatusValues['status'] && this.addressProof !== null
      && this.addressProof != "") {
      this.formStatusValues['data']['addressProof'] = this.addressProof;
      let contactNo = [];

      if (!Array.isArray(this.formStatusValues['data']['emergencyConatctNo'])) {
        contactNo[0] = this.formStatusValues['data']['emergencyConatctNo'];
        console.log('EmpCont - ' + JSON.stringify(contactNo));
      }
      else {
        contactNo = this.formStatusValues['data']['emergencyConatctNo'];
        console.log('EmpCont2 - ' + JSON.stringify(contactNo));
      }

      this.formStatusValues['data']['emergencyConatctNo'] = contactNo;
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

        if (localStoragedData['actionRequired'][this.storedIndex]['contactDetails'].hasOwnProperty('contactNumber')) {

          console.log(JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']));

          this.addressProof = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['addressProof'];
          console.log(' - address - ' + this.addressProof);

          if (this.addressProof !== null && this.addressProof.includes('addressProof')) {
            this.addressProof = this.IMG_BASE_URL + this.addressProof;
          }

          console.log('EmpCont3 ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo']));

          this.onboardingContactDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']);
          if (localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo'] !== null) {
            this.onboardingContactDetailsForm.controls['emergencyConatctNo']
              .setValue(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo']);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.onboardingContactDetailsSubscription.unsubscribe();
  }
}
