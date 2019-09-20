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
import { onBoardingModel } from '../onboardingList/onboarding';
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
};

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
  formActionStatus:any;
  @ViewChild('container', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
  constructor(private network: Network, private transfer: FileTransfer, private onBoardingService: OnboardingService,
    public componentService: componentService, private storage: Storage, private messageService: onBoardingDataService,
    private componentFactoryResolver: ComponentFactoryResolver, public alertCtrl: AlertController, private navParams: NavParams,
    private navCtrl: NavController) {

    console.log('projectId TYPESc');

    this.storage.get('onboardingCurrentIndex').then(data => {
      this.storedIndex = data['index'];
      this.formActionStatus = data['action'];
      console.log('projectId TYPESc ' + data['projectId']);


      this.storage.get('OnBoardingData').then((localStoragedData) => {
        console.log('projectId TYPES123 ' + JSON.stringify(data));
        console.log(data)
        data.filtered = true;
        data.siteDetails = {
            projectCode:'',
            wbsId:'',
            projectDescription:'',
            wbsDescription:'',
            position:''
        }
        data.personalDetails = {
          employeeCode:  '',
            employeeName: '',
            relationshipDetails: [{name:'',relationship:'',contactNumber:''},{name:'',relationship:'',contactNumber:''}],
            gender: '',
            maritalStatus: '',
            dateOfBirth: '',
            dateOfJoining: '',
            religion: '',
            bloodGroup: '',
            identificationMark: ''
        }
        data.contactDetails = {
          contactNumber: '',
            emergencyConatctNo: '',
            communicationAddress: [{address:'',city:'',state:''}],
            permanentAddress: [{address:'',city:'',state:''}],
            addressProof: ''
        }
        data.familyAcademicDetails = {
          educationQualification: [{qualification:'',institute:''}],
          nomineeDetail: [{name:'', relationship:'',contactNumber:'',nominePercentage:0}]
        }
        data.employmentDetails = {
          previousEmployee : [{isEmploymentEarlier:'',name:'',designation:''}],
        }
        data.kycDetails = {
          aadharNumber: '',
            bankDetails: [{accountNo:'',ifsc:''}],
            aadharPhotoCopy: '',
            employeeSignature: '',
            profilePicture: '',
            thumbImpressenRight:'',
            thumbImpressenLeft:'',
            prePrintedStatement: ''
        }
        data.declaration = {
            agreeTermsAndConditions:false,
            onboardedPlace:''
        }
        data.newEmployee = true;
        let onboardingData =  onBoardingModel;
        if (localStoragedData['actionRequired'][this.storedIndex]) {
          // if (!localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('projectId')) {
          console.log('no projectId');

          // }}
          this.formLoadingProgress = 'pie' + ((Object.keys(localStoragedData['actionRequired'][this.storedIndex]).length / 7) * 100);
        } else {
          console.log(data)
          // Object.assign(localStoragedData['actionRequired'][this.storedIndex], data);
          if(localStoragedData['actionRequired'][data.index] && localStoragedData['actionRequired'][data.index].hasOwnProperty['siteDetails']){
            console.log("Site details available so skip creating new details")
          }else{
            localStoragedData['actionRequired'].push(data);
            this.storage.set('OnBoardingData', localStoragedData);
          }
          
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

            localStoragedData["actionRequired"][this.storedIndex] = onBoardingModel;
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

          // tempIndex = _.findIndex(localStoragedData['completed'],{employeeCode:empCode});
          //
          // if(tempIndex == -1){
          //
          //   tempIndex = localStoragedData['completed'].length;
          //
          //   console.log("Completed List ",localStoragedData['completed']);
          //
          //   console.log("loading ========" + empCode);
          //
          //   console.log("loading ========" + tempIndex);
          //
          //   console.log("loading ========" + JSON.stringify(localStoragedData['completed'][tempIndex]));
          //
          // }

          // console.log(localStoragedData['actionRequired'][this.storedIndex]);
          // console.log(localStoragedData['actionRequired'][this.storedIndex]['projectCode']);
          // console.log(localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]);
          // console.log(localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['accountNo']);
          var employeeDetails = {
            adharCardNumber:null,
            accountNumber:null,
            bloodGroup:null,
            boardInstitute:null,
            dob:null,
            doj:null,
            educationalQulification:null,
            emergencyContactNumber:null,
            empId:null,
            fatherName:null,
            fullName:null,
            gender:null,
            ifscCode:null,
            lastName:null,
            maritalStatus:null,
            mobile:null,
            motherName:null,
            name:null,
            nomineeContactNumber:null,
            nomineeName:null,
            nomineeRelationship:null,
            onBoardSource:null,
            onBoardedFrom:null,
            panCard:null,
            percentage:null,
            permanentAddress:null,
            permanentCity:null,
            permanentState:null,
            personalIdentificationMark1:null,
            personalIdentificationMark2:null,
            phone:null,
            presentAddress:null,
            presentCity:null,
            presentState:null,
            previousDesignation:null,
            projectCode:null,
            projectDescription:null,
            religion:null,
            wbsDescription:null,
            wbsId:null,
            position:null,
            submitted:true,
            onboardedPlace:null,
            gross:null,
            employer:null,
            designation:null,
            newEmployee:false,
            active:'Y',
              id:0
          };

          var employeeDocuments = {
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
          };
          
          employeeDetails.id = localStoragedData['actionRequired'][this.storedIndex]['id'] ? localStoragedData['actionRequired'][this.storedIndex]['id'] : 0;
          employeeDetails.projectCode = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode'] : localStoragedData['actionRequired'][this.storedIndex]['projectCode'];
          employeeDetails.wbsId = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId'] : localStoragedData['actionRequired'][this.storedIndex]['wbsId'];
          employeeDetails.projectDescription = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectDescription'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectDescription'] : localStoragedData['actionRequired'][this.storedIndex]['projectDescription'];
          employeeDetails.wbsDescription = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsDescription'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsDescription'] : localStoragedData['actionRequired'][this.storedIndex]['wbsDescription'];
          employeeDetails.position = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position'] : localStoragedData['actionRequired'][this.storedIndex]['position'];
          employeeDetails.gross = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'] ? localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'] : localStoragedData['actionRequired'][this.storedIndex]['gross'];
          employeeDetails.name = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeName'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeName']: localStoragedData['actionRequired'][this.storedIndex]['employeeName'];
          employeeDetails.lastName = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['lastName'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['lastName']: localStoragedData['actionRequired'][this.storedIndex]['lastName'];
          employeeDetails.gender = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['gender'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['gender']: localStoragedData['actionRequired'][this.storedIndex]['gender'];
          employeeDetails.maritalStatus = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['maritalStatus'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['maritalStatus']: localStoragedData['actionRequired'][this.storedIndex]['maritalStatus'];
          employeeDetails.dob = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfBirth'] : localStoragedData['actionRequired'][this.storedIndex]['dateOfBirth'];
          employeeDetails.doj = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfJoining'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['dateOfJoining'] : localStoragedData['actionRequired'][this.storedIndex]['dateOfJoining'];
          if(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]){
            employeeDetails.fatherName = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][0]['name'] : localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][0]['name'];
          employeeDetails.motherName = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['relationshipDetails'][1]['name'] : localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][1]['name'];
          }else{
            employeeDetails.fatherName = localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][0]['name'] ? localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][0]['name'] :'';
            employeeDetails.motherName = localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][1]['name'] ? localStoragedData['actionRequired'][this.storedIndex]['relationshipDetails'][1]['name'] : '';
          }
          
          employeeDetails.religion = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['religion'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['religion']: localStoragedData['actionRequired'][this.storedIndex]['religion'];
          employeeDetails.bloodGroup = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['bloodGroup'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['bloodGroup'] : localStoragedData['actionRequired'][this.storedIndex]['bloodGroup'];
          employeeDetails.personalIdentificationMark1 = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark1'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark1'] : localStoragedData['actionRequired'][this.storedIndex]['identificationMark1'];
          employeeDetails.personalIdentificationMark2 = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark2'] ? localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['identificationMark2'] : localStoragedData['actionRequired'][this.storedIndex]['identificationMark2'];
          employeeDetails.mobile = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['contactNumber'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['contactNumber'] : localStoragedData['actionRequired'][this.storedIndex]['contactNumber'];
          if(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo'] && localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo'][0] ){
            employeeDetails.emergencyContactNumber = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['emergencyConatctNo'][0];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'] && localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0]){
            employeeDetails.emergencyContactNumber = localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0] ? localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0] : localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'] ){
            employeeDetails.emergencyContactNumber = localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0] ? localStoragedData['actionRequired'][this.storedIndex]['emergencyConatctNo'][0]: 0
          }
          if(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]){
            employeeDetails.presentAddress = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['address'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['address'] : localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['address'];
            employeeDetails.presentCity = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['city'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['city'] : localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['city'];
            employeeDetails.presentState = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['state'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['communicationAddress'][0]['state'] : localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['state'];
          }else if( localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]){
            employeeDetails.presentAddress =  localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['address'];
            employeeDetails.presentCity =  localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['city'];
            employeeDetails.presentState =  localStoragedData['actionRequired'][this.storedIndex]['communicationAddress'][0]['state'];
          }

          if(localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]){
            employeeDetails.permanentAddress = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['address'] : localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['address'];
            employeeDetails.permanentCity = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['city'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['city'] : localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['city'];
            employeeDetails.permanentState = localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['state'] ? localStoragedData['actionRequired'][this.storedIndex]['contactDetails']['permanentAddress'][0]['state'] : localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['state'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]){
            employeeDetails.permanentAddress =  localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['address'];
            employeeDetails.permanentCity = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['city'];
            employeeDetails.permanentState = localStoragedData['actionRequired'][this.storedIndex]['permanentAddress'][0]['state'];
          }

          if(localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['educationQualification'][0]){
            employeeDetails.educationalQulification = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['educationQualification'][0]['qualification'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['educationQualification'][0]['qualification'] : localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['qualification'];
            employeeDetails.boardInstitute = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['educationQualification'][0]['institute'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['educationQualification'][0]['institute'] : localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['institute'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]){
            employeeDetails.educationalQulification = localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['qualification'];
            employeeDetails.boardInstitute = localStoragedData['actionRequired'][this.storedIndex]['educationQualification'][0]['institute'];
          }

          if(localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]){
            employeeDetails.nomineeName = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['name'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['name'] : localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['name'];
            employeeDetails.nomineeRelationship = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['relationship'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['relationship'] : localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['relationship'];
            employeeDetails.nomineeContactNumber = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['contactNumber'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['contactNumber'] : localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['contactNumber'];
            employeeDetails.percentage = localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['nominePercentage'] ? localStoragedData['actionRequired'][this.storedIndex]['familyAcademicDetails']['nomineeDetail'][0]['nominePercentage'] : localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['nominePercentage'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]){
            employeeDetails.nomineeName =  localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['name'];
            employeeDetails.nomineeRelationship =  localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['relationship'];
            employeeDetails.nomineeContactNumber = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['contactNumber'];
            employeeDetails.percentage = localStoragedData['actionRequired'][this.storedIndex]['nomineeDetail'][0]['nominePercentage'];
          }

          if(localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]){
            employeeDetails.employer = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0] ? localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]['name'] : localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]['name'];
            employeeDetails.previousDesignation = localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0] ? localStoragedData['actionRequired'][this.storedIndex]['employmentDetails']['previousEmployee'][0]['designation'] : localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]['designation'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]){
            employeeDetails.employer = localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]['name'];
            employeeDetails.previousDesignation =  localStoragedData['actionRequired'][this.storedIndex]['previousEmployee'][0]['designation'];
          }
          
          employeeDetails.adharCardNumber = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber'] ? localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber'] : localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'];
          employeeDocuments.aadharPhotoCopy = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopy'];
          employeeDocuments.aadharPhotoCopyBack = localStoragedData['actionRequired'][this.storedIndex]['aadharPhotoCopyBack'];
          employeeDocuments.employeeSignature = localStoragedData['actionRequired'][this.storedIndex]['employeeSignature'];
          employeeDocuments.profilePicture = localStoragedData['actionRequired'][this.storedIndex]['profilePicture'];
          employeeDocuments.prePrintedStatement = localStoragedData['actionRequired'][this.storedIndex]['prePrintedStatement'];
          employeeDocuments.thumbImpressenRight = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenRight'];
          employeeDocuments.thumbImpressenLeft = localStoragedData['actionRequired'][this.storedIndex]['thumbImpressenLeft'];
          employeeDocuments.voterId = localStoragedData['actionRequired'][this.storedIndex]['voterId'];
          employeeDocuments.pancardCopy = localStoragedData['actionRequired'][this.storedIndex]['pancardCopy'];
          employeeDocuments.drivingLicense = localStoragedData['actionRequired'][this.storedIndex]['drivingLicense'];
          employeeDocuments.addressProof = localStoragedData['actionRequired'][this.storedIndex]['addressProof'];
          if(localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]){
            employeeDetails.accountNumber = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['accountNo'] ? localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['accountNo'] : localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['accountNo'];
            employeeDetails.ifscCode = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['ifsc'] ? localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['bankDetails'][0]['ifsc'] : localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['ifsc'];
          }else if(localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]){
            employeeDetails.accountNumber = localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['accountNo'];
            employeeDetails.ifscCode = localStoragedData['actionRequired'][this.storedIndex]['bankDetails'][0]['ifsc'];
          }
          
          employeeDetails.onboardedPlace = localStoragedData['actionRequired'][this.storedIndex]['declaration']['onboardedPlace'] ? localStoragedData['actionRequired'][this.storedIndex]['declaration']['onboardedPlace']: localStoragedData['actionRequired'][this.storedIndex]['onboardedPlace'];
          employeeDetails.onBoardSource = 'Mobile';
          employeeDetails.onBoardedFrom = 'Mobile';
          employeeDetails.active = 'Y';

          let name = localStoragedData['actionRequired'][this.storedIndex]['employeeName'];
          employeeDetails.name = name
          
          employeeDetails.fullName = name + employeeDetails.lastName;
          
          if(localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeCode'] || localStoragedData['actionRequired'][this.storedIndex]['employeeCode']){
            employeeDetails.empId = localStoragedData['actionRequired'][this.storedIndex]['personalDetails']['employeeCode'];
          }
          
          if(employeeDetails.emergencyContactNumber ===0){ delete employeeDetails.emergencyContactNumber;}
            
          employeeDetails.newEmployee = localStoragedData['actionRequired'][this.storedIndex]['newEmployee'];
          console.log("employee details");
          console.log(employeeDetails);

          if(this.formActionStatus && this.formActionStatus === 'update'&& employeeDetails.id){
            console.log("Update");

            
            this.onBoardingService.editOnBoardingUser(employeeDetails).subscribe((res)=>{
              console.log("Sucessfully saved employees");
              console.log(res);

              localStoragedData['completed'][tempIndex] = localStoragedData['actionRequired'][this.storedIndex];
              //localStoragedData['actionRequired'].splice(this.storedIndex, 1);

              console.log("res =======" + JSON.stringify(res));

              localStoragedData['actionRequired'][this.storedIndex]['id'] =res['id'];
              console.log("res id=======" + res['id']);



              this.saveImages(employeeDocuments, res['id']).then(res => {

                console.log('res_image_api ' + JSON.stringify(res));
                //localStoragedData['completed'].splice(tempIndex, 1);
                localStoragedData['actionRequired'].splice(this.storedIndex, 1);
                this.storage.set('OnBoardingData', localStoragedData);
                // cg
                this.navCtrl.setRoot(onboardingExistEmployee);
                this.componentService.showToastMessage("Employee saved successfully ", "center");
              }, err => {
                this.componentService.showToastMessage("Error in saving Employee ", "center");

              })


            },err=>{
              console.log("Error in saving employee");
              console.log(err);
              this.componentService.showToastMessage("Error in saving Employee "+err.messsage, "center");

            })


          }else{

            let adharNumber = localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber']? localStoragedData['actionRequired'][this.storedIndex]['kycDetails']['aadharNumber'] : localStoragedData['actionRequired'][this.storedIndex]['aadharNumber'] ;
            employeeDetails.empId = employeeDetails.empId ? employeeDetails.empId : adharNumber.toString().substring(5);
            employeeDetails.newEmployee = true;

            this.onBoardingService.saveOnboardingUser(employeeDetails).subscribe((res)=>{
              console.log("Sucessfully saved employees");
              console.log(res);

              localStoragedData['completed'][tempIndex] = localStoragedData['actionRequired'][this.storedIndex];
              //localStoragedData['actionRequired'].splice(this.storedIndex, 1);

              console.log("res =======" + JSON.stringify(res));

              localStoragedData['actionRequired'][this.storedIndex]['id'] =res['id'];
              console.log("res id=======" + res['id']);



              this.saveImages(employeeDocuments, res['id']).then(res => {

                console.log('res_image_api ' + JSON.stringify(res));
                //localStoragedData['completed'].splice(tempIndex, 1);
                localStoragedData['actionRequired'].splice(this.storedIndex, 1);
                this.storage.set('OnBoardingData', localStoragedData);
                // cg
                this.navCtrl.setRoot(onboardingExistEmployee);
                this.componentService.showToastMessage("Employee saved successfully ", "center");
              }, err => {
                this.componentService.showToastMessage("Error in saving Employee ", "center");

              })


            },err=>{
              console.log("Error in saving employee");
              console.log(err);
              this.componentService.showToastMessage("Error in saving Employee "+ err.description, "center");

            })
          }


        });
      }
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
        console.log(array[imageUpload[i]]);
        if(array[imageUpload[i]] && array[imageUpload[i]] != 'assets/imgs/placeholder.png'){
          console.log("Uploading images");
          this.onBoardingService.imageUpLoad(array[imageUpload[i]], imageUpload[i], id)
              .then(function (res) {
                console.log('image upload ' + res);
              }, function (err) {
                console.log(err);
              })
        }

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
