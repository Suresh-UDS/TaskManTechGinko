import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, PopoverController} from 'ionic-angular';
import {Network} from "@ionic-native/network";
import {onboardingNewEmployee} from '../onboardingNewEmployee/onboardingNewEmployee';
import {onboardingEmpStatus} from '../onboardingEmpStatus/onboardingEmpStatus';
import {onboardingUserView} from '../onboardingList/onboardingUserView/onboardingUserView';
import {OnboardingService} from '../../service/onboarding.service';
import {componentService} from '../../service/componentService';

import {Storage} from '@ionic/storage';
import {onBoardingModel} from './onboarding';
import {AppConfig} from '../../service/app-config';
import {OnBoardingEmployeeFilter} from "./on-boarding-employee-filter/on-boarding-employee-filter";

const searchCriteria = {
  branchCode:null,
  projectCode: null,
  wbsCode:null,
  verified:false,
  submitted:false,
  list:true,
  employeeEmpId:String,
  name:String
};

const onBoardingNewModel =  {

  adharCardNumber:'',
  accountNumber:'',
  bloodGroup:'',
  boardInstitute:'',
  dob:'',
  doj:'',
  educationalQulification:'',
  emergencyContactNumber:'',
  empId:'',
  fatherName:'',
  fullName:'',
  gender:'',
  ifscCode:'',
  lastName:'',
  maritalStatus:'',
  mobile:'',
  motherName:'',
  name:'',
  nomineeContactNumber:'',
  nomineeName:'',
  nomineeRelationship:'',
  onBoardSource:'',
  onBoardedFrom:'',
  panCard:'',
  percentage:'',
  permanentAddress:'',
  permanentCity:'',
  permanentState:'',
  personalIdentificationMark1:'',
  personalIdentificationMark2:'',
  phone:'',
  presentAddress:'',
  presentCity:'',
  presentState:'',
  previousDesignation:'',
  projectCode:'',
  projectDescription:'',
  religion:'',
  wbsDescription:'',
  wbsId:'',
  position:'',
  submitted:false,
  kycDetails: {
    aadharPhotoCopy: 'assets/imgs/placeholder.png',
    employeeSignature: 'assets/imgs/placeholder.png',
    profilePicture: 'assets/imgs/placeholder.png',
    thumbImpressenRight:'assets/imgs/placeholder.png',
    thumbImpressenLeft:'assets/imgs/placeholder.png',
    prePrintedStatement: 'assets/imgs/placeholder.png',
  },
};

@Component({
  selector: 'page-onboarding-list',
  templateUrl: 'onboardingList.html',
})



export class onboardingExistEmployee implements OnInit {
  onBoardingAction = 'actionRequired';
  popOverEvent: any;
  actionRequiredfilterData = {};
  completedfilterData;
  actionRequiredEmp: any = [];
  completedEmp: any = [];
  errormsg;
  hideFilter = true;
  wbsId;
  AppConfig = AppConfig;
  private selectedProjectCode: any;
  private selectedWbsCode: any;



  constructor(private storage: Storage, private network: Network, private onboardingService: OnboardingService, private navCtrl: NavController, private popoverCtrl: PopoverController, public modalCtrl: ModalController,
    public component: componentService) {
    this.setStorage();


    // this.storage.get('onboardingProjectSiteIds').then((Ids) => {
    //   this.wbsId = Ids['siteId'];
    // });
  }
  ionViewWillEnter() {
    //  this.component.showLoader("Updating....");
    this.getNomineeRelationships();
    this.getLocalData();
    // delete draft

    this.storage.get('OnBoardingData').then((data) => {
       
      if(!data['actionRequired'][data['actionRequired'].length - 1]['personalDetails']['employeeName']){

          delete data['actionRequired'][data['actionRequired'].length - 1];

      }

      console.log(data['actionRequired']);

    });

  }

  getEmployeeDocuments (empDocDetails,docType){

    // let docuemntObject = _.find(empDocDetails,{"docType":docType});

    if(empDocDetails) {
      for (var i = 0; i < empDocDetails.length; i++) {
        if (empDocDetails[i].docType === docType) {
          return empDocDetails[i].docUrl;
        }
      }
    }
    return 'assets/imgs/placeholder.png';

  }

  ngOnInit() {
    // this.component.showLoader("Please wait....");
    console.log('onboard home Empid ' + window.localStorage.getItem('employeeId'));
    console.log('onboard home UserId ' + window.localStorage.getItem('employeeUserId'));

  }

  getLocalData(){
    this.storage.get('OnBoardingData').then((data) => {
      if (data) {
        this.actionRequiredEmp = data['actionRequired'];
        // this.completedEmp = data["completed"];
        this.getPercentage();
      }
      // this.component.closeLoader();
    })
  }


  addNewEmpyoee() {
    let obj = {
      projectId: this.wbsId,
      index: this.actionRequiredEmp.length,
      action: 'add'
    }
    this.storage.set('onboardingCurrentIndex', obj);
    console.log("index === " + this.actionRequiredEmp.length);
    this.navCtrl.push(onboardingNewEmployee);
  }
  updateEmployeeDetails(index) {
    console.log('index = ' + index);
    let obj = {

      index: index,
      action: 'update'
    };
    this.storage.set('onboardingCurrentIndex', obj);
    //window.localStorage.setItem('onboardingCurrentIndex', index);
    this.navCtrl.push(onboardingEmpStatus);
  }
  onboardingUserView(data) {
    this.navCtrl.push(onboardingUserView, { userListData: data });
  }
  userFilter() {

    const modal = this.modalCtrl.create(OnBoardingEmployeeFilter);
    modal.present();
    modal.onDidDismiss(data=>{
      console.log(data);
      searchCriteria.wbsCode = data.wbsCode;
      searchCriteria.projectCode = data.projectCode;
      searchCriteria.employeeEmpId = data.employeeEmpId;
      searchCriteria.name = data.name;
      if(searchCriteria.wbsCode){
        this.onSegmentChange()
      }
    });
  }


  getPercentage() {
    for (var i = 0; i < this.actionRequiredEmp.length; i++) {
      let objectPercentage = 0;
      let keyPercentage = 0;
      let objectkeys = [];
      let objectValues = [];
      let objectFormattedValues = [];
      console.log("percentage calculation");
      console.log(this.actionRequiredEmp[i]);
      for (let list in onBoardingModel) {
        for (let key in onBoardingModel[list]) {
          console.log(this.actionRequiredEmp[i][key]);
          console.log(onBoardingModel[list][key]);
          if(this.actionRequiredEmp[i][list] && this.actionRequiredEmp[i][list][key]){
            onBoardingModel[list][key] = this.actionRequiredEmp[i][list][key];

          }
        }
        objectkeys = Object.keys(onBoardingModel[list]);
        objectValues = Object['values'](onBoardingModel[list]);
        


        let objectFormattedValuesLength = 0;
        let objectFormattedKeysLength = 0;

          for(let obv in objectValues){
            // if (data && JSON.stringify(data) !== '{}') {
            //   return data;
            // }
            let dataValues = objectValues[obv]
            if(dataValues){

              if(Array.isArray(dataValues)){

                  let subDataLength = dataValues.length;
                  let subDataValueLength = 0;

                  for(let j in dataValues){
                    
                    if(dataValues[j]){
                      let subSeccondLevelKeysLength = Array.isArray(dataValues[j]) ? dataValues[j].length :  Object.keys(dataValues[j]).length;
                      let subSeccondLevelValues = 0;

                      for(let h in dataValues[j]){

                        if(dataValues[j][h]){

                          subSeccondLevelValues ++;

                        }

                      }

                      let total = (subSeccondLevelValues/subSeccondLevelKeysLength);

                      total = (isNaN(total) || !isFinite(total)) ? 0 :total;

                      subDataValueLength += total;
                    }
                  }

                  let total = (subDataValueLength / subDataLength);

                  total = (isNaN(total) || !isFinite(total)) ? 0 :total;

                  objectFormattedValuesLength += total; 

              }
              else{
                objectFormattedValuesLength ++;
              }
            }

          };


        keyPercentage = (objectFormattedValuesLength / objectkeys.length) * 100
        objectPercentage += keyPercentage;

      }
      this.actionRequiredEmp[i]['percentage'] = Math.floor(objectPercentage / 7);

      console.log(Math.floor(objectPercentage / 7));
    }
  }
  static findSavedDuplication(empdt, key) {
    let count = 0;
    for (let list of empdt) {
      if (list['employeeCode'] == key) {
        count = count + 1;
      }
    }
    return count != 0;
  }
  onSegmentChange() {
    console.log("Segment changed");
    console.log(searchCriteria);
    console.log(this.onBoardingAction);
    if (this.onBoardingAction == 'actionRequired') {
      if(searchCriteria.wbsCode !=null){
        this.getEmployeesByWBSId(searchCriteria.projectCode, searchCriteria.wbsCode);
      }
      // }else if(searchCriteria.projectCode !=null){
      //   this.getEmployeesByProjectId(searchCriteria.projectCode);
      // }
    } else {
      searchCriteria.submitted = true;
      this.searchEmployees(searchCriteria);
    }
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 0 : 1));
    });
  }
  syncEmployeeDetails(object, index) {
    this.component.showLoader("Loading OnBoarding");
    this.onboardingService.saveOnboardingUser(object).subscribe((res) => {
      this.component.closeAll();
      this.storage.get('OnBoardingData').then((localStoragedData) => {
        localStoragedData['completed'].splice(index, 1);
        this.storage.set('OnBoardingData', localStoragedData);
      });
    }, (error) => {
      this.component.closeAll();
      this.component.showToastMessage('Server Unreachable', 'bottom');
    })
  }

  setStorage() {
    this.storage.get('OnBoardingData').then((data) => {
      if (!data) {
        this.storage.set('OnBoardingData', { actionRequired: [], completed: [] });
      }
    })
  }

  searchEmployees(searchCriteria){
    this.component.showLoader("Loading Employees");
    window.localStorage.setItem('projectId', searchCriteria.projectCode);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];

      this.onboardingService.searchOnBoardingEmployees(searchCriteria).subscribe(response => {
        let objectsKeys;
        let objectsValues;

        console.log("Search response");
        console.log(response);

        let res = response.transactions;


        if(res && res !=null){
          console.log("Response is not null");
          for (var i = 0; i < res.length; i++) {

            if (!onboardingExistEmployee.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

              if(res[i]["submitted"]){
                localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
              }
              else{
                localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
              }

              this.storage.set('OnBoardingData', localStoragedData);

            }

          }
        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        if(res !=null){
          this.completedEmp = res;
        }else{
          this.completedEmp = [];
        }
        console.log(this.completedEmp);
        this.component.closeLoader();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeLoader();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  getEmployeesByProjectId(projectId){
    this.component.showLoader("Loading Employees...")
    window.localStorage.setItem('projectId', projectId);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];

      this.onboardingService.getEmployeeListByProjectId(projectId).subscribe(res => {
        let objectsKeys;
        let objectsValues;


        for (var i = 0; i < res.length; i++) {

          if (!onboardingExistEmployee.findSavedDuplication(localStoragedData['actionRequired'], res[i]['employeeCode'])) {

            if(res[i]["submitted"]){
              localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
            }
            else{
              localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = res[i];
            }

            this.storage.set('OnBoardingData', localStoragedData);

          }

        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.component.closeAll();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  getEmployeesByWBSId(projectId,wbsId){
    this.component.showLoader("Loading Employees...");
    this.actionRequiredEmp = [];
    this.completedEmp = [];
    window.localStorage.setItem('projectId', projectId);

    this.storage.get('OnBoardingData').then((localStoragedData) => {

      localStoragedData["completed"] = [];
      let deleteIndexes = [];
      console.log("Local storage");
      console.log(localStoragedData);
      if(localStoragedData["actionRequired"]){
        for(let i=0;i<localStoragedData["actionRequired"].length;i++){

         
          if(localStoragedData["actionRequired"][i].isSync){
          // delete localStoragedData[i];
            deleteIndexes.push(i);
          }

          // if(i+1 == localStoragedData.length){
          //   this.storage.set('OnBoardingData', localStoragedData);
          // }
        }
      }
      for (var i = deleteIndexes.length -1; i >= 0; i--){

        localStoragedData["actionRequired"].splice(deleteIndexes[i],1);

      }
     
      this.storage.set('OnBoardingData', localStoragedData);
       

      this.onboardingService.getEmployeeListByWbs(wbsId).subscribe(res => {
        let objectsKeys;
        let objectsValues;
        let employeeData = [];

        for (var i = 0; i < res.length; i++) {

          if (!onboardingExistEmployee.findSavedDuplication(localStoragedData['actionRequired'], res[i]['empId'])) {

            if(res[i]["submitted"]){
              console.log("PRofile image");
              if(res[i]['documents']){
                console.log(res[i].documents.find(x=>x.doctype === "profilePicture"))

              }
              localStoragedData['completed'][localStoragedData['completed'].length] = res[i];
            }
            else{
             // employeeData[i] = onBoardingReferenceModel;
              employeeData[i]={};
              employeeData[i]['filtered']=true;
              employeeData[i]['employeeName']=res[i].name;
              employeeData[i]['employeeCode']=res[i].empId;
              employeeData[i]['id'] = res[i].id;
              employeeData[i]['isSync'] = true;
              employeeData[i]['profilePicture'] = this.getEmployeeDocuments(res[i].documents,'profilePicture') ;
              employeeData[i]['siteDetails'] = {};
              employeeData[i]['siteDetails']['projectCode'] = res[i].projectCode;
              employeeData[i]['siteDetails']['projectDescription'] = res[i].projectDescription;
              employeeData[i]['siteDetails']['wbsId'] = res[i].wbsId;
              employeeData[i]['siteDetails']['wbsDescription'] = res[i].wbsDescription;
              employeeData[i]['siteDetails']['position'] = res[i].position;
              employeeData[i]['siteDetails']['gross'] = res[i].gross;
              employeeData[i]['personalDetails'] = {};
              employeeData[i]['personalDetails']['employeeCode'] = res[i].empId;
              employeeData[i]['personalDetails']['employeeName'] = res[i].name;
              employeeData[i]['personalDetails']['relationshipDetails'] = [{
                name: res[i].fatherName,
                relationship: 'Father',
                contactNumber: ''
              }, {name: res[i].motherName, relationship: 'Mother', contactNumber: ''}];
              employeeData[i]['personalDetails']['gender'] = res[i].gender;
              employeeData[i]['personalDetails']['maritalStatus'] = res[i].maritalStatus;
              employeeData[i]['personalDetails']['dateOfBirth'] = res[i].dob;
              employeeData[i]['personalDetails']['dateOfJoining'] = res[i].doj;
              employeeData[i]['personalDetails']['religion'] = res[i].religion;
              employeeData[i]['personalDetails']['bloodGroup'] = res[i].bloodGroup;
              employeeData[i]['personalDetails']['id'] = res[i].id;
              employeeData[i]['personalDetails']['identificationMark'] = [res[i].personalIdentificationMark1, res[i].personalIdentificationMark2];
              employeeData[i]['personalDetails']['identificationMark1'] = res[i].personalIdentificationMark1;
              employeeData[i]['personalDetails']['identificationMark2'] = res[i].personalIdentificationMark2;
              employeeData[i]['contactDetails'] = {};
              employeeData[i]['contactDetails']['contactNumber'] = res[i].mobile;
              employeeData[i]['contactDetails']['emergencyConatctNo'] = res[i].emergencyContactNumber;
              let communicationAddress = [{address:res[i].presentAddress,city:res[i].presentCity, state:res[i].presentState}];
              let permanentAddress = [{address:res[i].permanentAddress,city:res[i].permanentCity, state:res[i].permanentState}];
              employeeData[i]['contactDetails']['communicationAddress'] = communicationAddress;
              employeeData[i]['contactDetails']['permanentAddress'] = permanentAddress;
              res[i].addressProof? employeeData[i]['contactDetails']['addressProof'] = res[i].addressProof : employeeData[i]['contactDetails']['addressProof'] = 'assets/imgs/placeholder.png';
              employeeData[i]['familyAcademicDetails'] = {};
              employeeData[i]['familyAcademicDetails']['educationQualification'] = [{
                qualification: res[i].educationalQulification,
                institute: res[i].boardInstitute
              }];
              employeeData[i]['familyAcademicDetails']['nomineeDetail'] = [{
                name: res[i].nomineeName,
                relationship: res[i].nomineeRelationship,
                contactNumber: res[i].nomineeContactNumber,
                nominePercentage: res[i].percentage
              }];
              employeeData[i]['employmentDetails'] = {};
              employeeData[i]['employmentDetails']['previousEmployee'] = [{
                name: res[i].employer,
                designation: res[i].previousDesignation
              }];
              employeeData[i]['kycDetails'] = {};
              employeeData[i]['kycDetails']['aadharNumber'] = res[i].adharCardNumber;
              employeeData[i]['kycDetails']['bankDetails'] = [{accountNo:res[i].accountNumber, ifsc:res[i].ifscCode}];
              employeeData[i]['kycDetails']['aadharPhotoCopy'] =this.getEmployeeDocuments(res[i].documents,'aadharPhotoCopy') ;
              employeeData[i]['kycDetails']['employeeSignature'] = this.getEmployeeDocuments(res[i].documents,'employeeSignature') ;
              employeeData[i]['kycDetails']['profilePicture'] = this.getEmployeeDocuments(res[i].documents,'profilePicture') ;
              employeeData[i]['kycDetails']['thumbImpressenRight'] = this.getEmployeeDocuments(res[i].documents,'thumbImpressenRight') ;
              employeeData[i]['kycDetails']['thumbImpressenLeft'] = this.getEmployeeDocuments(res[i].documents,'thumbImpressenLeft') ;
              employeeData[i]['kycDetails']['prePrintedStatement'] = this.getEmployeeDocuments(res[i].documents,'prePrintedStatement') ;
              employeeData[i]['kycDetails']['addressProof'] = this.getEmployeeDocuments(res[i].documents,'addressProof') ;
              employeeData[i]['kycDetails']['pancardCopy'] = this.getEmployeeDocuments(res[i].documents,'pancardCopy') ;
              employeeData[i]['kycDetails']['voterId'] = this.getEmployeeDocuments(res[i].documents,'voterId') ;
              employeeData[i]['kycDetails']['aadharPhotoCopyBack'] = this.getEmployeeDocuments(res[i].documents,'aadharPhotoCopyBack') ;
              employeeData[i]['kycDetails']['drivingLicense'] = this.getEmployeeDocuments(res[i].documents,'drivingLicense') ;
              employeeData[i]['declaration']={};
              employeeData[i]['declaration']['agreeTermsAndConditions'] = false;
              employeeData[i]['declaration']['onboardedPlace'] = '';
              employeeData[i]['submitted']=res[i].submitted;
              localStoragedData['actionRequired'][localStoragedData['actionRequired'].length] = employeeData[i];
            }

            this.storage.set('OnBoardingData', localStoragedData);

          }

        }
        //console.log(onBoardingModel);
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.applyNameAndIdFilter();
        this.getPercentage();
        this.component.closeAll();
      }, err => {
        console.log('onbList3');
        this.actionRequiredEmp = localStoragedData['actionRequired'];
        this.completedEmp = localStoragedData["completed"];
        this.getPercentage();
        this.applyNameAndIdFilter();
        this.component.closeAll();
        this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      });
    },err=>{
      this.component.showToastMessage('Server Unreachable ' + err, 'bottom');
      this.component.closeAll();
    });
  }

  applyNameAndIdFilter(){

     if(searchCriteria.employeeEmpId){

        for(let i in this.actionRequiredEmp){

          if(this.actionRequiredEmp[i].employeeCode && this.actionRequiredEmp[i].employeeCode.indexOf(searchCriteria.employeeEmpId) > -1){

            this.actionRequiredEmp[i].filtered = true;

          }
          else{

            this.actionRequiredEmp[i].filtered = false;

          }
          
        }

     }

     if(searchCriteria.name){

      for(let i in this.actionRequiredEmp){

        if(this.actionRequiredEmp[i].employeeName && this.actionRequiredEmp[i].employeeName.toLowerCase().indexOf(String(searchCriteria.name).toLowerCase()) > -1){

          this.actionRequiredEmp[i].filtered = true;

        }
        else{

          this.actionRequiredEmp[i].filtered = false;

        }
        
      }

   }

  }

  getNomineeRelationships(){
    this.onboardingService.getNomineeRelationships().subscribe(relationships=>{
      console.log("Nominee relationships from server");
      console.log(relationships);
      this.storage.set('nomineeRelationships',relationships);
    })
  }

}
