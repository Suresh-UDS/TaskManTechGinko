import { Component, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { NgForm, FormGroup, FormBuilder, Validators, ValidationErrors, FormArray, ValidatorFn } from '@angular/forms';
import { onBoardingDataService } from '../onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { normalizeURL, ActionSheet, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import { FilePath } from '@ionic-native/file-path';
import * as launcher from '../../../../assets/js/start-app';
import { AppConfig } from "../../../service/app-config";
import { ValidateUrl } from "./ValidateFn"

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'page-kycDetails-new',
  templateUrl: 'newEmpKycDetails.html',
})
export class newEmpKycDetails implements OnInit, AfterViewInit {

  IMG_BASE_URL = AppConfig.s3Bucket;
  imageURIto;
  onboardingKycSubscription;
  formStatusValues;
  onboardingKYCForm: FormGroup;
  userAllKYCData: any = {}
  storedIndex;
  // kycdata = [
  //   { name: 'Driving License' },
  //   { name: 'PAN Card' },
  //   { name: 'Passport' },
  //   { name: 'Provident Fund' }
  // ];
  constructor(private filePath: FilePath, private fb: FormBuilder, private transfer: FileTransfer,
    private storage: Storage, private camera: Camera,
    private actionSheetCtrl: ActionSheetController, private messageService: onBoardingDataService, private file: File) { }


  ngOnInit() {

    this.onboardingKYCForm = this.fb.group({
      aadharNumber: ['', [Validators.required]],
      bankDetails: this.fb.array([this.createBankDetails()]),
    });

    this.onboardingKYCForm.setValidators([this.validateNumberMaxLength()]);

    this.initialKycImage();

    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      console.log('kyc_index' + this.storedIndex);
    });
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingKYCForm.reset();
        this.initialKycImage();
      }
    })
    this.onboardingKycSubscription = this.onboardingKYCForm.statusChanges.subscribe(status => {
      console.log('KYCdataaa ' + status);
      console.log('KYCdataaa111 ' + this.onboardingKYCForm.controls.bankDetails.value[0]['ifsc'].ValidateUrl);

      console.log('KYCdataaa== ' + JSON.stringify(this.onboardingKYCForm.value));
      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingKYCForm.value
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


  initialKycImage() {
    this.userAllKYCData = {
      aadharPhotoCopy: null,
      employeeSignature: null,
      profilePicture: null,
      prePrintedStatement: null,
      thumbImpressenRight: null,
      thumbImpressenLeft: null,
      drivingLicense: null,
      pancardCopy: null,
      voterId: null
    }
  }

  presentActionSheet(imageSide) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'choose image from',
      buttons: [
        {
          text: 'Take a photo',
          handler: () => {
            console.log("Quotation sheet Controller");
            this.getImageData(imageSide, '')
          }
        },
        {
          text: 'Pick from Gallery',
          handler: () => {
            this.getImageData(imageSide, 'album');
          }
        },
      ]
    });
    actionSheet.present();
  }

  getImageData(imageSide, imageType) {
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    if (imageType == 'album') {
      // options.saveToPhotoAlbum = false
      options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log('capture--- ' + imageData);
      let imageURI = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")


      this.filePath.resolveNativePath(imageURI)
        .then(imageURI => {
          console.log(' get file path -- ' + imageURI)

          if (imageSide == 'front') {
            this.userAllKYCData['aadharPhotoCopy'] = imageURI;
          } else if (imageSide == 'passbook') {
            this.userAllKYCData['prePrintedStatement'] = imageURI;
          } else if (imageSide == 'sign') {
            this.userAllKYCData['employeeSignature'] = imageURI;
          } else if (imageSide == 'profile') {
            this.userAllKYCData['profilePicture'] = imageURI;
          } else if (imageSide == 'fpRight') {
            this.userAllKYCData['thumbImpressenRight'] = imageURI;
          } else if (imageSide == 'fpLeft') {
            this.userAllKYCData['thumbImpressenLeft'] = imageURI;
          } else if (imageSide == 'panCard') {
            this.userAllKYCData['pancardCopy'] = imageURI;
          } else if (imageSide == 'dLine') {
            this.userAllKYCData['drivingLicense'] = imageURI;
          } else if (imageSide == 'voter') {
            this.userAllKYCData['voterId'] = imageURI;
          }
          this.sendValidationMessage();
        })
        .catch(err => console.log(err));
    })
  }

  createBankDetails(): FormGroup {
    return this.fb.group({
      accountNo: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(20)]],
      ifsc: ['', [Validators.required, ValidateUrl, Validators.minLength(11), Validators.maxLength(11)]]
    });
  }


  private validateIFSCCode(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {

      console.log('kyc_group_' + JSON.stringify(group.controls.bankDetails.value));
      const control1 = group.controls.bankDetails.value;

      let ifscDt = control1[0].ifsc;

      if (ifscDt) {
        var var_name = new String(ifscDt);
        console.log('kyc_min_val2 ' + var_name.charAt(4));

        if (var_name.length !== 11 && var_name.charAt(4) !== '0') {
          control1.setErrors({ shouldMinLength: true });
        } else {
          control1.setErrors(null);
        }
      }
      return;
    };
  }

  private validateNumberMaxLength(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls['aadharNumber'];
      if (control1.value) {
        const srtingData = control1.value.toString();
        if (srtingData.length !== 12) {
          control1.setErrors({ shouldMinLength: true });
        } else {
          control1.setErrors(null);
        }
      }
      return;
    };
  }

  imgErrorFunction() {
    console.log('ERR_LOAD_image');
  }

  sendValidationMessage() {

    console.log('kycValidation ' + JSON.stringify(this.userAllKYCData));

    if ((this.formStatusValues['status']) &&
      //(this.userAllKYCData['aadharNumber'] !== null) &&
      (this.userAllKYCData['aadharPhotoCopy'] !== null) &&
      (this.userAllKYCData['aadharPhotoCopy'] != "") &&
      (this.userAllKYCData['employeeSignature'] !== null) &&
      (this.userAllKYCData['employeeSignature'] != "") &&
      (this.userAllKYCData['profilePicture'] !== null) &&
      (this.userAllKYCData['thumbImpressenRight'] !== null) &&
      (this.userAllKYCData['thumbImpressenRight'] != "") &&
      (this.userAllKYCData['profilePicture'] != "") &&
      (this.userAllKYCData['thumbImpressenLeft'] !== null) &&
      (this.userAllKYCData['thumbImpressenLeft'] != "") &&
      // (this.userAllKYCData['drivingLicense'] !== null) &&
      // (this.userAllKYCData['drivingLicense'] != "") &&
      // (this.userAllKYCData['voterId'] !== null) &&
      // (this.userAllKYCData['voterId'] != "") &&
      // (this.userAllKYCData['pancardCopy'] !== null) &&
      // (this.userAllKYCData['pancardCopy'] != "") &&
      (this.userAllKYCData['prePrintedStatement'] !== null) &&
      (this.userAllKYCData['prePrintedStatement'] != "")) {

      console.log(' kyc-data1 - ' + JSON.stringify(this.formStatusValues['data']));
      Object.assign(this.formStatusValues['data'], this.userAllKYCData);

      console.log(' kyc-data2 - ' + JSON.stringify(this.formStatusValues['data']));
      // this.formStatusValues['data']['aadharNumber'] = aadharNumber;  
      // this.formStatusValues['data'] = this.onboardingKYCForm.value;

      this.messageService.formDataMessage(this.formStatusValues);
      console.log(' status_kyc1 ' + this.userAllKYCData['aadharNumber'] + ' - ' +
        this.formStatusValues['data']['aadharPhotoCopy'] + ' - ' + this.formStatusValues['status']);
      console.log(' status_kyc2 ' + this.userAllKYCData['thumbImpressenLeft'] + ' - ' + this.formStatusValues['status']);
    } else {
      this.messageService.formDataMessage({ status: false, data: {} });
    }
  }

  launchApp() {
    launcher.packageLaunch("uds.com.fingerprint");
  }

  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      console.log('kyc_storedIndex ' + this.storedIndex);
      if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('aadharNumber')) {
        console.log('KYCdatta all === ' + JSON.stringify(localStoragedData['actionRequired']));
        console.log('KYCdatta viewinit === ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));

        this.userAllKYCData['aadharPhotoCopy'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
        if (this.userAllKYCData['aadharPhotoCopy'] != null &&
          this.userAllKYCData['aadharPhotoCopy'].includes('aadharPhotoCopy')) {
          this.userAllKYCData['aadharPhotoCopy'] = this.IMG_BASE_URL + this.userAllKYCData['aadharPhotoCopy'];
        }

        this.userAllKYCData['employeeSignature'] = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
        if (this.userAllKYCData['employeeSignature'] !== null &&
          this.userAllKYCData['employeeSignature'].includes('employeeSignature')) {
          this.userAllKYCData['employeeSignature'] = this.IMG_BASE_URL + this.userAllKYCData['employeeSignature'];
        }
        this.userAllKYCData['profilePicture'] = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
        if (this.userAllKYCData['profilePicture'] !== null && this.userAllKYCData['profilePicture'].includes('profilePicture')) {
          this.userAllKYCData['profilePicture'] = this.IMG_BASE_URL + this.userAllKYCData['profilePicture'];
        }

        this.userAllKYCData['prePrintedStatement'] = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];
        if (this.userAllKYCData['prePrintedStatement'] !== null && this.userAllKYCData['prePrintedStatement'].includes('prePrintedStatement')) {
          this.userAllKYCData['prePrintedStatement'] = this.IMG_BASE_URL + this.userAllKYCData['prePrintedStatement'];
        }
        this.userAllKYCData['thumbImpressenRight'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenRight'];
        if (this.userAllKYCData['thumbImpressenRight'] !== null &&
          this.userAllKYCData['thumbImpressenRight'].includes('thumbImpressenRight')) {
          this.userAllKYCData['thumbImpressenRight'] = this.IMG_BASE_URL + this.userAllKYCData['thumbImpressenRight'];
        }

        this.userAllKYCData['thumbImpressenLeft'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenLeft'];
        if (this.userAllKYCData['thumbImpressenLeft'] !== null &&
          this.userAllKYCData['thumbImpressenLeft'].includes('thumbImpressenLeft')) {
          this.userAllKYCData['thumbImpressenLeft'] = this.IMG_BASE_URL + this.userAllKYCData['thumbImpressenLeft'];
          console.log('kyc=aadhaar' + this.userAllKYCData['thumbImpressenLeft']);
        }


        this.userAllKYCData['voterId'] = localStoragedData['actionRequired'][this.storedIndex]['voterId'];
        if (this.userAllKYCData['voterId'] !== null &&
          this.userAllKYCData['voterId'].includes('voterId')) {
          this.userAllKYCData['voterId'] = this.IMG_BASE_URL + this.userAllKYCData['voterId'];
        }


        this.userAllKYCData['pancardCopy'] = localStoragedData['actionRequired'][this.storedIndex]['pancardCopy'];
        if (this.userAllKYCData['pancardCopy'] !== null &&
          this.userAllKYCData['pancardCopy'].includes('pancardCopy')) {
          this.userAllKYCData['pancardCopy'] = this.IMG_BASE_URL + this.userAllKYCData['pancardCopy'];
        }


        this.userAllKYCData['drivingLicense'] = localStoragedData['actionRequired'][this.storedIndex]['drivingLicense'];
        if (this.userAllKYCData['drivingLicense'] !== null &&
          this.userAllKYCData['drivingLicense'].includes('drivingLicense')) {
          this.userAllKYCData['drivingLicense'] = this.IMG_BASE_URL + this.userAllKYCData['drivingLicense'];
        }


        this.onboardingKYCForm.controls['aadharNumber'].setValue(localStoragedData['actionRequired'][this.storedIndex]['aadharNumber']);
        console.log('kyc=aadhaar2' + this.onboardingKYCForm.controls.aadharNumber.value + ' - ' + this.onboardingKYCForm.get('aadharNumber').value);
        //this.onboardingKYCForm.patchValue();
        this.onboardingKYCForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
        this.sendValidationMessage();
      }
    });
  }
  ngOnDestroy() {
    this.onboardingKycSubscription.unsubscribe();
  }
}