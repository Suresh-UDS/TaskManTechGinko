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





import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'page-kycDetails-new',
  templateUrl: 'newEmpKycDetails.html',
})
export class newEmpKycDetails implements OnInit, AfterViewInit {

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
  constructor(private filePath: FilePath, private DomSanitizer: DomSanitizer, private fb: FormBuilder, private transfer: FileTransfer,
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
    });
    this.messageService.clearMessageSource.subscribe(data => {
      if (data == 'clear') {
        this.onboardingKYCForm.reset();
        this.initialKycImage();
      }
    })
    this.onboardingKycSubscription = this.onboardingKYCForm.statusChanges.subscribe(status => {
      console.log(status);
      console.log('KYCdataaa==' + JSON.stringify(this.onboardingKYCForm.value));
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
      prePrintedStatement: 'assets/imgs/placeholder.png',
      fingerPrintRight: 'assets/imgs/placeholder.png',
      fingerPrintLeft: 'assets/imgs/placeholder.png'
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

  private getFileUri = (url: any) => {
    var scope = this;
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        console.log(' reader ' + reader.result);
        scope.imageURIto = reader.result;
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  getImageData(imageSide, imageType) {

    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation:true
    };
    if (imageType == 'album') {
      // options.saveToPhotoAlbum = false
      options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log('capture--- ' + imageData);
      let imageURI = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")

      //  console.log('normalize url---'+ this.getFileUri(imageURI));
      //then use the method reasDataURL  btw. var_picture is ur image variable
      //var imageURI = path;
      // if (imageType == 'album') {
      // imageURI = 'file://' + imageData;
      // } else {
      //   imageURI = imageData;
      // }

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
            this.userAllKYCData['fingerPrintRight'] = imageURI;
          } else if (imageSide == 'fpLeft') {
            this.userAllKYCData['fingerPrintLeft'] = imageURI;
          }

          this.sendValidationMessage();
        })
        .catch(err => console.log(err));

      //  imageURI = this.DomSanitizer.bypassSecurityTrustUrl(imageData);


    })
  }
  createBankDetails(): FormGroup {
    return this.fb.group({
      accountNo: ['', [Validators.required, Validators.maxLength(15)]],
      ifsc: ['', [Validators.required]]
    });
  }

  private validateNumberMaxLength(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls['aadharNumber'];
      if (control1.value) {
        const srtingData = control1.value.toString();
        if (srtingData.length !== 12) {
          control1.setErrors({ shouldMinLength: true });
        }
      }
      return;
    };
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
      // (this.userAllKYCData['aadharNumber'] !== null) &&
      (this.userAllKYCData['aadharPhotoCopy'] !== null) &&
      (this.userAllKYCData['employeeSignature'] !== null) &&
      (this.userAllKYCData['profilePicture'] !== null) &&
      (this.userAllKYCData['fingerPrintRight'] !== null) &&
      (this.userAllKYCData['fingerPrintLeft'] !== null) &&
      (this.userAllKYCData['prePrintedStatement'] !== null)) {

     console.log(' kyc-data1 - '+ JSON.stringify(this.formStatusValues['data']));
     Object.assign( this.formStatusValues['data'], this.userAllKYCData,);
      
     console.log(' kyc-data2 - '+ JSON.stringify(this.formStatusValues['data']));
      // this.formStatusValues['data']['aadharNumber'] = aadharNumber;  
      // this.formStatusValues['data'] = this.onboardingKYCForm.value;

      this.messageService.formDataMessage(this.formStatusValues);

      console.log(' status_kyc1 ' + this.userAllKYCData['aadharNumber'] + ' - ' + 
      this.formStatusValues['data']['aadharPhotoCopy']  + ' - '+ this.formStatusValues['status']);
      console.log(' status_kyc2 ' + this.userAllKYCData['fingerPrintLeft'] + ' - ' + this.formStatusValues['status']);

    } else {
      this.messageService.formDataMessage({ status: false, data: {} });
    }
  }

  launchApp(){
     launcher.packageLaunch("uds.com.fingerprint");
  }
  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
      if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('aadharNumber')) {
        console.log('KYCdatta viewinit===' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
        this.userAllKYCData['aadharPhotoCopy'] = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
        // this.userAllKYCData['aadharNumber'] = localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'];
        this.userAllKYCData['employeeSignature'] = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
        this.userAllKYCData['profilePicture'] = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
        this.userAllKYCData['prePrintedStatement'] = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];
        this.userAllKYCData['fingerPrintRight'] = localStoragedData['actionRequired'][this.storedIndex]['fingerPrintRight'];
        this.userAllKYCData['fingerPrintLeft'] = localStoragedData['actionRequired'][this.storedIndex]['fingerPrintLeft'];

        this.onboardingKYCForm.controls['aadharNumber'].setValue(localStoragedData['actionRequired'][this.storedIndex]['aadharNumber']);
        console.log('kyc=aadhaar'+this.onboardingKYCForm.controls.aadharNumber.value + ' - ' + this.onboardingKYCForm.get('aadharNumber').value); 
        //this.onboardingKYCForm.patchValue();
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