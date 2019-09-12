import { Component, ViewChild, OnInit, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
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
  userAllKYCData: any = {};
  storedIndex;
  isenabled:boolean=false;
  formActionStatus:any;
  // kycdata = [
  //   { name: 'Driving License' },
  //   { name: 'PAN Card' },
  //   { name: 'Passport' },
  //   { name: 'Provident Fund' }
  // ];
  constructor(private filePath: FilePath, private fb: FormBuilder, private transfer: FileTransfer,
    private storage: Storage, private camera: Camera,
    private actionSheetCtrl: ActionSheetController, private messageService: onBoardingDataService, private file: File, private ele:ElementRef) { 

     

    }

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
      this.formActionStatus = data['action'];
    });
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingKYCForm.reset();
        this.initialKycImage();
      }
    });
    this.onboardingKycSubscription = this.onboardingKYCForm.statusChanges.subscribe(status => {
      console.log('KYCdataaa ' + status);
      console.log('KYCdataaa111 ' + this.onboardingKYCForm.controls.bankDetails.value[0]['ifsc'].ValidateUrl);

      console.log('KYCdataaa== ' + JSON.stringify(this.onboardingKYCForm.value));

// if(JSON.stringify(this.onboardingKYCForm.controls.bankDetails.value[0]['ifsc'])){
//       //if(this.onboardingKYCForm.controls.bankDetails.value[0]['accountNo'] !== ''){
//         alert(this.onboardingKYCForm.controls.bankDetails.value[0]['ifsc']);
//
//        this.ele.nativeElement.getElementsById('ifsc').disabled = true;
//         this.isenabled =true;
//
//       }else{
//
//         this.isenabled =false;
//          }


      if (status == 'VALID') {
        this.formStatusValues = {
          status: true,
          data: this.onboardingKYCForm.value
        }

        this.storage.get('OnBoardingData').then(localStoragedData => {
          if(localStoragedData && localStoragedData['actionRequired'] && localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex]['kycDetails']){
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber'] = this.formStatusValues['data']['aadharNumber'];
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharPhotoCopy'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharPhotoCopyBack'] = this.userAllKYCData['aadharPhotoCopy'];
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['employeeSignature'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['profilePicture'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['prePrintedStatement'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['thumbImpressenRight'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['thumbImpressenLeft'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['voterId'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['pancardCopy'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['drivingLicense'] = this.userAllKYCData['aadharPhotoCopy'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['accountNo'] = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['accountNo'] ;
            localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['ifsc'] = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['ifsc'] ;
            localStoragedData['actionRequired'][this.storedIndex]['declaration']['agreeTermsAndConditions'] = false;
            this.storage.set('OnBoardingData',localStoragedData);
          
        }
      });

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
      aadharPhotoCopyBack: null,
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
          console.log(' get file path -- ' + imageURI);

          if (imageSide == 'front') {
            this.userAllKYCData['aadharPhotoCopy'] = imageURI;
          } 
          else if (imageSide == 'back') {
            this.userAllKYCData['aadharPhotoCopyBack'] = imageURI;
          }
          else if (imageSide == 'passbook') {
            this.userAllKYCData['prePrintedStatement'] = imageURI;
          } 
          else if (imageSide == 'sign') {     
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
      accountNo: ['',  [Validators.required, Validators.minLength(5),Validators.maxLength(20)]],
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
      (this.userAllKYCData['aadharPhotoCopyBack'] !== null) &&
      (this.userAllKYCData['aadharPhotoCopyBack'] != "") &&
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
      if (localStoragedData['actionRequired'][this.storedIndex]['kycDetails'] && localStoragedData['actionRequired'][this.storedIndex]['kycDetails'].hasOwnProperty('aadharNumber')) {
          console.log('KYCdatta all === ' + JSON.stringify(localStoragedData['actionRequired']));
          console.log('KYCdatta viewinit === ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]['kycDetails']));

          this.userAllKYCData['aadharPhotoCopy'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
          this.userAllKYCData['aadharPhotoCopyBack'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopyBack'];
          this.userAllKYCData['employeeSignature'] = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
          this.userAllKYCData['profilePicture'] = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
          this.userAllKYCData['prePrintedStatement'] = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];
          this.userAllKYCData['thumbImpressenRight'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenRight'];
          this.userAllKYCData['thumbImpressenLeft'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenLeft'];
          this.userAllKYCData['voterId'] = localStoragedData['actionRequired'][this.storedIndex]['voterId'];
          this.userAllKYCData['pancardCopy'] = localStoragedData['actionRequired'][this.storedIndex]['pancardCopy'];
          this.userAllKYCData['drivingLicense'] = localStoragedData['actionRequired'][this.storedIndex]['drivingLicense'];
          this.onboardingKYCForm.controls['aadharNumber'].setValue(localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber']);
          console.log('kyc=aadhaar2' + this.onboardingKYCForm.controls.aadharNumber.value + ' - ' + this.onboardingKYCForm.get('aadharNumber').value);
          //this.onboardingKYCForm.patchValue();
          this.onboardingKYCForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]['kycDetails']);
          this.sendValidationMessage();
      }else{
        console.log('KYCdatta all === ' + JSON.stringify(localStoragedData['actionRequired']));
        console.log('KYCdatta viewinit === ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]  ));

        this.userAllKYCData['aadharPhotoCopy'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
        this.userAllKYCData['aadharPhotoCopyBack'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopyBack'];
        this.userAllKYCData['employeeSignature'] = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
        this.userAllKYCData['profilePicture'] = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
        this.userAllKYCData['prePrintedStatement'] = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];
        this.userAllKYCData['thumbImpressenRight'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenRight'];
        this.userAllKYCData['thumbImpressenLeft'] = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenLeft'];
        this.userAllKYCData['voterId'] = localStoragedData['actionRequired'][this.storedIndex]['voterId'];
        this.userAllKYCData['pancardCopy'] = localStoragedData['actionRequired'][this.storedIndex]['pancardCopy'];
        this.userAllKYCData['drivingLicense'] = localStoragedData['actionRequired'][this.storedIndex]['drivingLicense'];
        this.onboardingKYCForm.controls['aadharNumber'].setValue(localStoragedData['actionRequired'][this.storedIndex]  ['aadharNumber']);
        console.log('kyc=aadhaar2' + this.onboardingKYCForm.controls.aadharNumber.value + ' - ' + this.onboardingKYCForm.get('aadharNumber').value);
        //this.onboardingKYCForm.patchValue();
        this.onboardingKYCForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]  );
        this.sendValidationMessage();
      }
    });
  }
  ngOnDestroy() {
    this.onboardingKycSubscription.unsubscribe();
  }
}
