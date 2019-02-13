import { Component, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-kycDetails-new',
  templateUrl: 'newEmpKycDetails.html',
})
export class newEmpKycDetails implements OnInit, AfterViewInit {

  onboardingKycSubscription;
  formStatusValues
  onboardingKYCForm: FormGroup;
  userAllKYCData: any = {}
  storedIndex;
  // kycdata = [
  //   { name: 'Driving License' },
  //   { name: 'PAN Card' },
  //   { name: 'Passport' },
  //   { name: 'Provident Fund' }
  // ];
  constructor(private fb: FormBuilder, private storage: Storage, private camera: Camera, private messageService: onBoardingDataService) { }

  ngOnInit() {

    this.onboardingKYCForm = this.fb.group({
      aadharNumber: ['', [Validators.required]],
      bankDetails: this.fb.array([this.createBankDetails()])
    });
    this.initialKycImage();
    this.storage.get('onboardingCurrentIndex').then(index => {
      this.storedIndex = index;
    });
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingKYCForm.reset();
        this.initialKycImage();
      }
    })
    this.onboardingKycSubscription = this.onboardingKYCForm.statusChanges.subscribe(status => {
      console.log(status);
      console.log(this.onboardingKYCForm.value)
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingKYCForm.value
        }
        //this.messageService.formDataMessage(fromStatusValues);
      } else {
        this.formStatusValues = {
          status: false,
          data: {}
        }
        //this.messageService.formDataMessage(fromStatusValues);
      }
      this.sendValidationMessage();
    });
  }


  initialKycImage() {
    this.userAllKYCData = {
      aadharPhotoCopy: 'assets/imgs/placeholder.png',
      employeeSignature: 'assets/imgs/placeholder.png',
      profilePicture: 'assets/imgs/placeholder.png',
      prePrintedStatement: 'assets/imgs/placeholder.png'
    }
  }

  // getSelectedKyc(type) {
  //   if (this.selectedKycData) {
  //     this.userSelectedKYC.push({ type: type, imageFront: 'assets/imgs/placeholder.png', imageBack: 'assets/imgs/placeholder.png' });
  //     this.selectedKycData = '';
  //     this.validationCountKYCImgages = -1
  //     this.sendValidationMessage();
  //   }
  // }
  // deleteKycDetails(index) {
  //   this.userSelectedKYC.splice(index, 1);
  //   if (this.userSelectedKYC.length == 0) {
  //     this.validationCountKYCImgages = -1
  //     this.sendValidationMessage();
  //   }
  // }
  // getImageData(imageContainer) {
  //   const options: CameraOptions = {
  //     quality: 80,
  //     destinationType: this.camera.DestinationType.NATIVE_URI,
  //     //encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.ALLMEDIA
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     if (imageContainer == 'sign') {
  //       this.employeeSignature = imageData;
  //     } else {
  //       this.employeeProfile = imageData;
  //     }
  //     this.sendValidationMessage();
  //   })
  // }
  getImageData(imageSide) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      //encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA
    };

    this.camera.getPicture(options).then((imageData) => {
      if (imageSide == 'front') {
        this.userAllKYCData['aadharPhotoCopy'] = imageData;
      } else if (imageSide == 'passbook') {
        this.userAllKYCData['prePrintedStatement'] = imageData;
      } else if (imageSide == 'sign') {
        this.userAllKYCData['employeeSignature'] = imageData;
      } else if (imageSide == 'profile') {
        this.userAllKYCData['profilePicture'] = imageData;
      }

      this.sendValidationMessage();
    })
  }
  createBankDetails(): FormGroup {
    return this.fb.group({
      accountNo: ['', [Validators.required]],
      IFSC: ['', [Validators.required]]
    });
  }
  // getPassBook(value) {
  //   if (value) {
  //     this.bankFieldValidation = true;
  //     if (this.bankPassbook !== 'assets/imgs/placeholder.png') {
  //       this.bankPassbookValidation = true;
  //       this.sendValidationMessage();
  //     } else {
  //       this.bankPassbookValidation = false;
  //       this.sendValidationMessage();
  //     }
  //   } else {
  //     this.bankFieldValidation = false;
  //   }
  // }
  // getKYCImage(index, imageSide) {
  //   this.validationCountKYCImgages = 0;
  //   const options: CameraOptions = {
  //     quality: 80,
  //     destinationType: this.camera.DestinationType.NATIVE_URI,
  //     //encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.ALLMEDIA
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     if (imageSide == 'front') {
  //       this.userSelectedKYC[index]['imageFront'] = imageData;
  //     } else {
  //       this.userSelectedKYC[index]['imageBack'] = imageData;
  //     }
  //     for (let list of this.userSelectedKYC) {
  //       if (list['imageFront'] !== 'assets/imgs/placeholder.png' && list['imageBack'] !== 'assets/imgs/placeholder.png') {

  //       } else {
  //         this.validationCountKYCImgages = this.validationCountKYCImgages + 1;
  //       }
  //     }
  //     if (this.validationCountKYCImgages == 0) {
  //       this.sendValidationMessage();
  //     } else {
  //       this.sendValidationMessage();
  //     }
  //   })
  // }
  sendValidationMessage() {
    if ((this.formStatusValues['status']) &&
      (this.userAllKYCData['aadharPhotoCopy'] !== 'assets/imgs/placeholder.png') &&
      (this.userAllKYCData['employeeSignature'] !== 'assets/imgs/placeholder.png') &&
      (this.userAllKYCData['profilePicture'] !== 'assets/imgs/placeholder.png') &&
      (this.userAllKYCData['prePrintedStatement'] !== 'assets/imgs/placeholder.png')) {

      this.formStatusValues['data'] = this.userAllKYCData
      this.messageService.formDataMessage(this.formStatusValues);

    } else {
      this.messageService.formDataMessage({ status: false, data: {} });
    }
  }
  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('aadharNumber')) {
        console.log('datta ===');
        console.log(localStoragedData);
        this.userAllKYCData['aadharPhotoCopy'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
        this.userAllKYCData['employeeSignature'] = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
        this.userAllKYCData['profilePicture'] = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
        this.userAllKYCData['prePrintedStatement'] = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];

        this.onboardingKYCForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
        // for (let list in localStoragedData['actionRequired'][this.storedIndex]) {
        //   this.onboardingKYCForm.controls[list].setValue(localStoragedData['actionRequired'][this.storedIndex][list]);
        // }
        this.sendValidationMessage();
      }
    });
  }
  ngOnDestroy() {
    this.onboardingKycSubscription.unsubscribe();
  }
}