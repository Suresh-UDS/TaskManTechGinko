import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AlertController, NavParams, NavController } from 'ionic-angular';
import { Network } from "@ionic-native/network";

import { onboardingExistEmployee } from '../onboardingList/onboardingList';
import { newEmpPersonalDetail } from './personalDetails/newEmpPersonalDetails';
import { newEmpKycDetails } from './kycDetails/newEmpKycDetails';
import { newEmpFamilyAndAcademic } from './familyAcademic/newEmpFamilyAcademic';
import { newEmpEmployeementDetails } from './employeementDetails/newEmpEmployeementDetails';
import { newEmpContactDetails } from './contactDetails/newEmpContactDetails';
import { onBoardingDataService } from './onboarding.messageData.service';
import { Storage } from '@ionic/storage';
import { componentService } from '../../service/componentService';
import { OnboardingService } from '../../service/onboarding.service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Jsonp } from '../../../../node_modules/@angular/http';
import { onBoardingDataModel } from '../onboardingList/onboardingDataModel';

import * as _ from 'underscore';

const imageUploadModal = {
  aadharPhotoCopy: String,
  profilePicture: String,
  employeeSignature: String,
  prePrintedStatement: String,
  addressProof: String,
  thumbImpressenRight: String,
  thumbImpressenLeft: String,
  drivingLicense: String,
  pancardCopy: String,
  voterId: String
}

@Component({
  selector: 'page-onboarding-new',
  templateUrl: 'onboardingNewEmployee.html',
})
export class onboardingNewEmployee {

  onboardingNewEmpData: any = {};
  navPreviousData: any;
  currentIndex = 0;
  storedIndex;
  allFormValues = {};
  currentFormValues = {};
  formLoadingProgress: any = 'pie0';
  @ViewChild('container', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  constructor(private network: Network, private transfer: FileTransfer, private onBoardingService: OnboardingService,
    public componentService: componentService, private storage: Storage, private messageService: onBoardingDataService,
    private componentFactoryResolver: ComponentFactoryResolver, public alertCtrl: AlertController, private navParams: NavParams,
    private navCtrl: NavController) {

    console.log('projectId TYPESc');

    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      console.log('projectId TYPESc ' + data['projectId']);


      this.storage.get('OnBoardingData').then((localStoragedData) => {
        console.log('projectId TYPES123 ' + JSON.stringify(data));

        if (localStoragedData['actionRequired'][this.storedIndex]) {
          // if (!localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('projectId')) {
          console.log('no projectId');

          // }}
          this.formLoadingProgress = 'pie' + ((Object.keys(localStoragedData['actionRequired'][this.storedIndex]).length / 5) * 100);
        } else {
          Object.assign(localStoragedData['actionRequired'][this.storedIndex], data);
          this.storage.set('OnBoardingData', localStoragedData);
        }
      });
    })


    if (navParams.get('pageData')) {
      this.navPreviousData = navParams.get('pageData');
    } else {
      this.navPreviousData = '';
    }
  }

  wizardObj = [
    // { title: 'OnBoarding Screen', description: 'OnBoarding Screen details', index: 1, component: newEmpOnboardingDetails },
    { title: 'Personal Details', key: 'personalDetails', index: 1, component: newEmpPersonalDetail, formStatus: false },
    { title: 'Contact Details', key: 'contactDetails', index: 2, component: newEmpContactDetails, formStatus: false },
    { title: 'Nominee & Academic', key: 'familyAcademicDetails', index: 3, component: newEmpFamilyAndAcademic, formStatus: false },
    { title: 'Employment Details', key: 'employmentDetails', index: 4, component: newEmpEmployeementDetails, formStatus: false },
    { title: 'KYC Details', key: 'kycDetails', index: 5, component: newEmpKycDetails, formStatus: false }
  ];
  ionViewDidLoad() {
    // this.viewContainer.clear();
    this.messageService.currentMessage.subscribe(data => {
      this.getFormStatusDetails(data);
    })
    this.storage.get('OnBoardingData').then((localStoragedData) => {
      console.log('projectId TYPES12345 ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
    });

    this.storage.get('PageStatus').then(data => {
      let dataAll;
      console.log('key_userdt1 ' + data);
      for (var i = 0; i < data.length; i++) {
        dataAll = data[i]['status'];
        console.log('key_userdt2 ' + dataAll);
      }
    });
    console.log('key_userdt3');
    let index;
    if (this.navPreviousData) {
      //alert(this.navPreviousData);
      // alert(typeof this.navPreviousData);
      //alert(JSON.stringify(this.navPreviousData));
      //index = this.navPreviousData['index'];
      this.currentIndex = this.navPreviousData['index'];
      index = this.navPreviousData['index'];
    } else {
      index = 0;
      this.currentIndex = 0;
    }
    this.loadComponent(this.wizardObj[index]['component']);

  }
  nextWizard(index) {
    console.log('next');

    this.storage.get('onboardingCurrentIndex').then(data => {
      
      this.storedIndex = data['index'];
      
      if(data['action'] == "add"){

        this.storage.get('OnBoardingData').then((localStoragedData) => {

          if(!localStoragedData["actionRequired"][this.storedIndex]){

            localStoragedData["actionRequired"][this.storedIndex] = onBoardingDataModel;
            delete onBoardingDataModel['id'];
            this.storage.set('OnBoardingData', localStoragedData); 
            
          }

          this.storeFormData(this.currentFormValues).then(data => {
            console.log('promise return');
            console.log(data)
            if (this.wizardObj.length > index) {
              this.currentIndex = this.currentIndex + 1;
              this.loadComponent(this.wizardObj[this.currentIndex]['component']);
            }
          });

        });

      }
      else{

        this.storeFormData(this.currentFormValues).then(data => {
          console.log('promise return');
          console.log(data)
          if (this.wizardObj.length > index) {
            this.currentIndex = this.currentIndex + 1;
            this.loadComponent(this.wizardObj[this.currentIndex]['component']);
          }
        });

      }

    });
 
    
  }
  PreviousWizard(index) {
    if (index > 0) {
      this.currentIndex = this.currentIndex - 1;
      this.loadComponent(this.wizardObj[this.currentIndex]['component']);
    }
  }
  loadComponent(cmp) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(cmp);
    const viewContainerRef = this.viewContainer;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
    //ComponentRef.instance._ref = ComponentRef;
    //ComponentRef.instance.parentcount = this.onboardingNewEmpData;
  }
  formFinalSubmit() {

    //object assign 
    // this.storeFormData(this.allFormValues).then(data => {
    //   console.log('newEMP_resolve ' + data);
    // })

    const thisScope = this;
    const confirmAlert = this.alertCtrl.create({
      title: 'OnBoarding Submit',
      message: 'Are you sure you want to submit the form?.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: () => {
            thisScope.formFinalOperation();
          }
        }
      ]
    });
    confirmAlert.present();
  }
  getFormStatusDetails(data) {

    // this.storage.get('onboardingCurrentIndex').then(currentIndex => {

    //   currentIndex = currentIndex['index'];
    //   console.log('index2 = ' + currentIndex);
    //   this.storage.get('OnBoardingData').then((localStoragedData) => {      
    //     console.log('key4 -stored data-' +  JSON.stringify(localStoragedData['actionRequired'][this.currentIndex]));
    //     console.log('key5 -stored data-' + localStoragedData['actionRequired'][this.currentIndex]['pageStatus'][0]);
    //   });
    // });

    if (data['status']) {
      // if (this.wizardObj[this.currentIndex].index == 5) {
      // this.storage.get('OnBoardingData').then((localStoragedData) => {
      // console.log('key3 -stored data-' + localStoragedData['actionRequired'][this.currentIndex]['pageStatus']);
      //localStoragedData['actionRequired'][this.storedIndex]['pageStatus']
      // });
      //}
      this.wizardObj[this.currentIndex]['formStatus'] = data['status'];
      this.currentFormValues = data['data'];

    } else {
      this.wizardObj[this.currentIndex]['formStatus'] = false;
    }
  }
  // formFinalOperation() {
  //   let obj: any = {};
  //   var tempIndex;

  //       this.storage.get('OnBoardingData').then((localStoragedData) => {
  //         tempIndex = localStoragedData['completed'].length;
  //         //if (this.network.type != 'none') {
  //         this.componentService.showLoader("Loading OnBoarding");
  //         console.log("loading ========" + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
  //         //   alert(JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
  //         //gopicg
  //         //localStoragedData['actionRequired'][this.storedIndex]['projectId']
  //         this.onBoardingService.saveOnboardingUser(localStoragedData['actionRequired'][this.storedIndex])
  //           .subscribe((res) => {
  //             localStoragedData['completed'][tempIndex] = localStoragedData['actionRequired'][this.storedIndex];
  //             localStoragedData['actionRequired'].splice(this.storedIndex, 1);
  //             //    alert(JSON.stringify(res));

  //             console.log("res =======" + JSON.stringify(res));
  //             console.log("res id=======" + res['id']);

  //             this.saveImages(localStoragedData['completed'][tempIndex], res['id']).then(res => {
  //               this.componentService.closeAll();
  //               console.log('res image -api ' + JSON.stringify(res));
  //               localStoragedData['completed'].splice(tempIndex, 1);
  //               this.storage.set('OnBoardingData', localStoragedData);
  //               // cg
  //               this.navCtrl.setRoot(onboardingExistEmployee);
  //             }, err => {

  //             })
  //           }, (error) => {
  //             alert(JSON.stringify(error));
  //             this.componentService.closeAll();
  //             this.componentService.showToastMessage('Server Unreachable', 'bottom');
  //           })
  //         // } else {
  //         //   localStoragedData['completed'][tempIndex]['isSync'] = false;
  //         //   this.storage.set('OnBoardingData', localStoragedData);
  //         //   this.navCtrl.setRoot(onboardingExistEmployee);
  //         // }
  //       });

  // }

  formFinalOperation() {
    let obj: any = {};
    var tempIndex;
    this.storeFormData(this.currentFormValues).then(data => {
      console.log(' store resolve ' + data);
      if (data == 'success') {
        this.storage.get('OnBoardingData').then((localStoragedData) => {

          localStoragedData['actionRequired'][this.storedIndex]["submitted"] = true;

          let empCode = localStoragedData['actionRequired'][this.storedIndex]["employeeCode"];

          tempIndex = _.findIndex(localStoragedData['completed'],{employeeCode:empCode});

          if(tempIndex == -1){

            tempIndex = localStoragedData['completed'].length;

            console.log("Completed List ",localStoragedData['completed']);

            console.log("loading ========" + empCode);

            console.log("loading ========" + tempIndex);

            console.log("loading ========" + JSON.stringify(localStoragedData['completed'][tempIndex]));

          }
          

          //if (this.network.type != 'none') {
          this.componentService.showLoader("Loading OnBoarding");
          console.log("loading ========" + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
          //   alert(JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
          //gopicg
          //localStoragedData['actionRequired'][this.storedIndex]['projectId']
          this.onBoardingService.saveOnboardingUser(localStoragedData['actionRequired'][this.storedIndex])
            .subscribe((res) => {
              localStoragedData['completed'][tempIndex] = localStoragedData['actionRequired'][this.storedIndex];
              //localStoragedData['actionRequired'].splice(this.storedIndex, 1);
              
              console.log("res =======" + JSON.stringify(res));

              localStoragedData['actionRequired'][this.storedIndex]['id'] =res['id'];  
              console.log("res id=======" + res['id']);

              this.saveImages(localStoragedData['completed'][tempIndex], res['id']).then(res => {
                this.componentService.closeAll();
                console.log('res_image_api ' + JSON.stringify(res));
                //localStoragedData['completed'].splice(tempIndex, 1);
                localStoragedData['actionRequired'].splice(this.storedIndex, 1);
                this.storage.set('OnBoardingData', localStoragedData);
                // cg
                this.navCtrl.setRoot(onboardingExistEmployee);
              }, err => {

              })
            }, (error) => {
              alert(JSON.stringify(error));
              this.componentService.closeAll();
              this.componentService.showToastMessage('Server Unreachable', 'bottom');
            })
          // } else {
          //   localStoragedData['completed'][tempIndex]['isSync'] = false;
          //   this.storage.set('OnBoardingData', localStoragedData);
          //   this.navCtrl.setRoot(onboardingExistEmployee);
          // }
        });
      }
    });
  }

  saveImages(array, id) {
    let promise = new Promise((resolve, reject) => {
      let imageUpload = Object.keys(imageUploadModal);

      for (var i = 0; i < imageUpload.length; i++) {
        this.onBoardingService.imageUpLoad(array[imageUpload[i]], imageUpload[i], id)
          .then(function (res) {
            console.log('image upload ' + res);
          }, function (err) {
            console.log(err);
          })
      }
      if (i == imageUpload.length) {
        resolve('success')
      }
    });
    return promise;
  }

  storeFormData(data) {
    //let storeKeyName = this.wizardObj[this.currentIndex]['key'];
    // alert(storeKeyName);
    //console.log(data);
    //let obj: any = {};
    //console.log('store fn start');
    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      console.log('projectId TYPES_SUBMIT ' + data['projectId']);
    });

    let promise = new Promise((resolve, reject) => {
      this.storage.get('OnBoardingData').then((localStoragedData) => {
        console.log('get_stored_data' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
        localStoragedData['actionRequired'][this.storedIndex] = localStoragedData['actionRequired'][this.storedIndex] || {};
        //obj[storeKeyName] = data
        // for(let key in data) {
        //   localStoragedData['actionRequired'][this.storedIndex][key] = data[key];
        // }
        // if (localStoragedData['actionRequired'][this.storedIndex]['employeeCode'] == ''
        // && localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'] !== null) {          
        // }

        data['isSync'] = false;
        data['customer'] = [{
          project: [{
            'projectId': window.localStorage.getItem('projectId'),
            wbs: [
              {
                'wbsId': window.localStorage.getItem('wbsId')
              }
            ]
          }]
        }];
        // }
        console.log('projectId SUBMIT ' + JSON.stringify(data));
        // data.projectId2 = window.localStorage.getItem('projectId');

        //  console.log('projectId SUBMIT2 ' + data.customer.project.projectId2);
        Object.assign(localStoragedData['actionRequired'][this.storedIndex], data);
        console.log('projectId SUBMIT ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
        this.storage.set('OnBoardingData', localStoragedData);
        resolve('success');
      });
    });
    return promise;
  }
  clearForm() {
    this.messageService.formClearMessage('clear');
  }
}