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

import { declaration} from '../../../pages/onboarding/onboardingNewEmployee/declaration/declaration';
import {NewEmpSiteDetails} from "./new-emp-site-details/new-emp-site-details";
//import{ declaration} from '../../declaration/declaration';

declare  var demo;


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
  voterId: String,
  aadharPhotoCopyBack:String
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
        console.log(data)

        if (localStoragedData['actionRequired'][this.storedIndex]) {
          // if (!localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('projectId')) {
          console.log('no projectId');

          // }}
          this.formLoadingProgress = 'pie' + ((Object.keys(localStoragedData['actionRequired'][this.storedIndex]).length / 7) * 100);
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

    this.getNomineeRelationships();
  }

  wizardObj = [
   
    // { title: 'OnBoarding Screen', description: 'OnBoarding Screen details', index: 1, component: newEmpOnboardingDetails },
   
    { title: 'Site Details', key: 'siteDetails', index: 1, component: NewEmpSiteDetails, formStatus: false },
    { title: 'Personal Details', key: 'personalDetails', index: 2, component: newEmpPersonalDetail, formStatus: false },
    { title: 'Contact Details', key: 'contactDetails', index:3, component: newEmpContactDetails, formStatus: false },
    { title: 'Nominee & Academic', key: 'familyAcademicDetails', index: 4, component: newEmpFamilyAndAcademic, formStatus: false },
    { title: 'Employment Details', key: 'employmentDetails', index: 5, component: newEmpEmployeementDetails, formStatus: false },
    { title: 'KYC Details', key: 'kycDetails', index: 6, component: newEmpKycDetails, formStatus: false },
    { title: 'Declaration', key: 'declaration', index: 7, component: declaration, formStatus: false }

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

    this.storage.get('OnBoardingData').then((localStoragedData) => {
      console.log(localStoragedData['actionRequired'][this.storedIndex]);
    })

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
      // if (data == 'success') {
      //   this.storage.get('OnBoardingData').then((localStoragedData) => {
      //
      //     localStoragedData['actionRequired'][this.storedIndex]["submitted"] = true;
      //
      //     let empCode = localStoragedData['actionRequired'][this.storedIndex]["employeeCode"];
      //
      //     tempIndex = _.findIndex(localStoragedData['completed'],{employeeCode:empCode});
      //
      //     if(tempIndex == -1){
      //
      //       tempIndex = localStoragedData['completed'].length;
      //
      //       console.log("Completed List ",localStoragedData['completed']);
      //
      //       console.log("loading ========" + empCode);
      //
      //       console.log("loading ========" + tempIndex);
      //
      //       console.log("loading ========" + JSON.stringify(localStoragedData['completed'][tempIndex]));
      //
      //     }
      //
      //     console.log(localStoragedData['actionRequired'][this.storedIndex]);
      //     console.log(localStoragedData['actionRequired'][this.storedIndex]['projectCode']);
      //     console.log(localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]);
      //     console.log(localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['accountNo']);
      //     var employeeDetails = {
      //       adharCardNumber:null,
      //       accountNumber:null,
      //       bloodGroup:null,
      //       boardInstitute:null,
      //       dob:null,
      //       doj:null,
      //       educationalQulification:null,
      //       emergencyContactNumber:null,
      //       empId:null,
      //       fatherName:null,
      //       fullName:null,
      //       gender:null,
      //       ifscCode:null,
      //       lastName:null,
      //       maritalStatus:null,
      //       mobile:null,
      //       motherName:null,
      //       name:null,
      //       nomineeContactNumber:null,
      //       nomineeName:null,
      //       nomineeRelationship:null,
      //       onBoardSource:null,
      //       onBoardedFrom:null,
      //       panCard:null,
      //       percentage:null,
      //       permanentAddress:null,
      //       permanentCity:null,
      //       permanentState:null,
      //       personalIdentificationMark1:null,
      //       personalIdentificationMark2:null,
      //       phone:null,
      //       presentAddress:null,
      //       presentCity:null,
      //       presentState:null,
      //       previousDesignation:null,
      //       projectCode:null,
      //       projectDescription:null,
      //       religion:null,
      //       wbsDescription:null,
      //       wbsId:null,
      //       position:null,
      //       submitted:false
      //
      //
      //     };
      //     employeeDetails.adharCardNumber = localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'];
      //     employeeDetails.mobile = localStoragedData['actionRequired'][this.storedIndex]['contactNumber'];
      //     employeeDetails.accountNumber = localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['accountNo'];
      //     employeeDetails.bloodGroup = localStoragedData['actionRequired'][this.storedIndex]['bloodGroup'];
      //     employeeDetails.boardInstitute = localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['institute'];
      //     employeeDetails.educationalQulification = localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['qualification'];
      //     employeeDetails.educationalQulification = localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['qualification'];
      //     employeeDetails.dob = localStoragedData['actionRequired'][this.storedIndex]['dateOfBirth'];
      //     employeeDetails.doj = localStoragedData['actionRequired'][this.storedIndex]['dateOfJoining'];
      //     employeeDetails.emergencyContactNumber = localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0];
      //     employeeDetails.fatherName = localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][0]["name"] ;
      //     employeeDetails.motherName = localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][1]["name"] ;
      //     employeeDetails.religion = localStoragedData['actionRequired'][this.storedIndex]['religion'];
      //     employeeDetails.gender = localStoragedData['actionRequired'][this.storedIndex]['gender'];
      //     employeeDetails.ifscCode = localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['ifsc'];
      //     employeeDetails.maritalStatus = localStoragedData['actionRequired'][this.storedIndex]['maritalStatus'];
      //     employeeDetails.nomineeContactNumber = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['contactNumber'];
      //     employeeDetails.nomineeName = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['name'];
      //     employeeDetails.nomineeRelationship = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['relationship'];
      //     employeeDetails.percentage = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['nominePercentage'];
      //     employeeDetails.onBoardSource = 'Mobile';
      //     employeeDetails.onBoardedFrom = 'Mobile';
      //     employeeDetails.panCard = localStoragedData['actionRequired'][this.storedIndex]['pancardCopy'];
      //     employeeDetails.permanentAddress = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['address'];
      //     employeeDetails.permanentCity = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['city'];
      //     employeeDetails.permanentState = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['state'];
      //     employeeDetails.personalIdentificationMark1 = localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][0];
      //     employeeDetails.personalIdentificationMark2 = localStoragedData['actionRequired'][this.storedIndex]['identificationMark'][1];
      //     employeeDetails.phone = localStoragedData['actionRequired'][this.storedIndex]['contactNumber'];
      //     if(localStoragedData['actionRequired'][this.storedIndex]['presentAddress']){
      //       employeeDetails.permanentAddress = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['address'];
      //       employeeDetails.permanentCity = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['city'];
      //       employeeDetails.permanentState = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['state'];
      //     }else{
      //       employeeDetails.presentAddress = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['address'];
      //       employeeDetails.presentCity = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['city'];
      //       employeeDetails.presentState = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['state'];
      //     }
      //     if(localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]['isEmploymentEarlier'])   {
      //       // employeeDetails.previousDesignation = localStoragedData['actionRequired'][this.storedIndex]['contactNumber'];
      //     }
      //     employeeDetails.projectCode = localStoragedData['actionRequired'][this.storedIndex]['projectCode'];
      //     employeeDetails.projectDescription = localStoragedData['actionRequired'][this.storedIndex]['projectDescription'];
      //     employeeDetails.religion = localStoragedData['actionRequired'][this.storedIndex]['religion'];
      //     employeeDetails.wbsDescription = localStoragedData['actionRequired'][this.storedIndex]['wbsDescription'];
      //     employeeDetails.position = localStoragedData['actionRequired'][this.storedIndex]['position'];
      //     employeeDetails.wbsId = localStoragedData['actionRequired'][this.storedIndex]['wbsId'];
      //     let name = localStoragedData['actionRequired'][this.storedIndex]['employeeName'];
      //     employeeDetails.name = name.split(" ")[0];
      //     employeeDetails.lastName = name.split(" ")[1];
      //     employeeDetails.fullName = name;
      //     let adharNumber = localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'];
      //     employeeDetails.empId = adharNumber.toString().substring(5);
      //     console.log("employee details");
      //     console.log(employeeDetails);
      //
      //     this.onBoardingService.saveOnboardingUser(employeeDetails).subscribe((res)=>{
      //       console.log("Sucessfully saved employees");
      //       console.log(res);
      //
      //       localStoragedData['completed'][tempIndex] = localStoragedData['actionRequired'][this.storedIndex];
      //       //localStoragedData['actionRequired'].splice(this.storedIndex, 1);
      //
      //       console.log("res =======" + JSON.stringify(res));
      //
      //       localStoragedData['actionRequired'][this.storedIndex]['id'] =res['id'];
      //       console.log("res id=======" + res['id']);
      //
      //
      //
      //       this.saveImages(localStoragedData['completed'][tempIndex], res['id']).then(res => {
      //
      //         console.log('res_image_api ' + JSON.stringify(res));
      //         //localStoragedData['completed'].splice(tempIndex, 1);
      //         localStoragedData['actionRequired'].splice(this.storedIndex, 1);
      //         this.storage.set('OnBoardingData', localStoragedData);
      //         // cg
      //         this.navCtrl.setRoot(onboardingExistEmployee);
      //         this.componentService.showToastMessage("Employee saved successfully ", "center");
      //       }, err => {
      //         this.componentService.showToastMessage("Error in saving Employee ", "center");
      //
      //       })
      //
      //
      //     },err=>{
      //       console.log("Error in saving employee");
      //       console.log(err);
      //       this.componentService.showToastMessage("Error in saving Employee "+err.messsage, "center");
      //
      //     })
      //   });
      // }
    });
  }


  
  saveImages(array, id) {
    console.log("Images arrya");
    console.log(id);
    console.log(array);
    let promise = new Promise((resolve, reject) => {
      let imageUpload = Object.keys(imageUploadModal);

      for (var i = 0; i < imageUpload.length; i++) {
        console.log("Image upload");
        console.log(imageUpload[i]);

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

  getNomineeRelationships(){
    this.onBoardingService.getNomineeRelationships().subscribe(relationships=>{
      console.log("Nominee relationships from server");
      console.log(relationships);
      this.storage.set('nomineeRelationships',relationships);
    })
  }
}
