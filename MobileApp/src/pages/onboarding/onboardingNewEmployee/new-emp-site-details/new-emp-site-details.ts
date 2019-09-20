import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {OnboardingService} from "../../../service/onboarding.service";
import {SelectSearchableComponent} from "ionic-select-searchable";
import {onBoardingDataService} from "../onboarding.messageData.service";
import {DatePipe} from "@angular/common";

/**
 * Generated class for the NewEmpSiteDetails page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-emp-site-details',
  templateUrl: 'new-emp-site-details.html',
})
export class NewEmpSiteDetails {

  storedIndex;
  siteDetailsForm: FormGroup;
  siteDetailsSubscription;
  formStatusValues: any = {};

  branches:any;
  projects:any;
  wbsList:any;
  selectedBranch:any;
  selectedProject:any;
  selectedWBS:any;
  formActionStatus: any;
  showSelectedDetails:any;

  branchCode:any;
  branchDescription:any;
  projectCode:any;
  projectDescription:any;
  wbsCode:any;
  wbsDescription:any;

  positionAndGrossList:any;
  position:any;
  gross :any;

  pipe = new DatePipe('en-US');
  isNewEmployee:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private storage: Storage, private onBoardingService: OnboardingService, private messageService: onBoardingDataService) {

    this.selectedBranch = null;
    this.selectedProject = null;
    this.selectedWBS = null;
    this.showSelectedDetails = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewEmpSiteDetails');
    this.getBranches();
  }

  pgOnChange(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    console.log(event);
    for(let pg of this.positionAndGrossList){
      console.log(pg);
      if(pg.positionId === event.value.positionId){
        console.log("Gross value set");
        this.siteDetailsForm.controls['gross'].setValue(pg.grossAmount);
                  this.gross = pg.grossAmount;
                  break;
      }
    }
  }

    ngOnInit() {

      console.log('ionViewDidLoad NewEmpSiteDetails');
      this.getBranches();

      this.storage.get('onboardingCurrentIndex').then(data => {
        console.log("Stored index data");
        console.log(data);
        console.log(data['index']);
        this.storedIndex = data['index'];
        this.formActionStatus = data['action'];
      });

      this.siteDetailsForm = this.fb.group({
        branchCode:[''],
        projectCode: ['', [Validators.required]],
        wbsId:['', [Validators.required]],
        position:['',[Validators.required]],
        gross:['',[Validators.required]]
      });

      this.siteDetailsSubscription = this.siteDetailsForm.statusChanges.subscribe(status=>{
        console.log(status);
        if(status === 'VALID'){
          let fromStatusValues = {
            status: true,
            data: this.siteDetailsForm.value
          };
          let projectDetails = fromStatusValues['data']['projectCode'];
          let wbsDetails = fromStatusValues['data']['wbsId'];
          let position = fromStatusValues['data']['position'];
          fromStatusValues['data']['projectCode'] = projectDetails['elementCode'];
          fromStatusValues['data']['wbsId'] = wbsDetails['elementCode'];
          fromStatusValues['data']['projectDescription'] = projectDetails['element'];
          fromStatusValues['data']['wbsDescription'] = wbsDetails['element'];
          fromStatusValues['data']['position']=position['positionId'];
          fromStatusValues['data']['gross']=position['grossAmount'];
            this.storage.get('OnBoardingData').then(localStoragedData => {
              if(localStoragedData && localStoragedData['actionRequired'] && localStoragedData['actionRequired'][this.storedIndex]){
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode'] = fromStatusValues['data']['projectCode']  ? fromStatusValues['data']['projectCode'] : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode'];
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId'] = fromStatusValues['data']['wbsId']  ? fromStatusValues['data']['wbsId'] : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId'];
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectDescription'] = fromStatusValues['data']['projectDescription'] ? fromStatusValues['data']['projectDescription'] : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectDescription'] ;
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsDescription'] = fromStatusValues['data']['wbsDescription']  ? fromStatusValues['data']['wbsDescription']  : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsDescription'];
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position'] =  fromStatusValues['data']['position'] ? fromStatusValues['data']['position'] : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position'];
                localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'] =  fromStatusValues['data']['gross'] ?  fromStatusValues['data']['gross'] : localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'];
                this.storage.set('OnBoardingData', localStoragedData);
              }
            });
          this.messageService.formDataMessage(fromStatusValues);
        }else {
          let fromStatusValues = {
            status: false,
            data: {}
          }
          this.messageService.formDataMessage(fromStatusValues);
        }
      })

    }

        getBranches(){
          this.onBoardingService.getBranches().subscribe(response=>{
            console.log("Getting branches");
            console.log(response);
            this.branches = response;
          })

        }

        getProjectByBranch(event:{
          component: SelectSearchableComponent,
          value: any
        }){
          this.selectedBranch = event.value;
          this.selectedProject = null;
          this.selectedWBS = null;
          window.localStorage.setItem('projectId',event.value.elementCode);
          this.onBoardingService.getProjectsByBranch(event.value.elementCode).subscribe(response=>{
            console.log("Getting projects");
            console.log(response);
            this.projects = response;
          })
        }

        getWBSByProject(event:{
          component: SelectSearchableComponent,
          value: any
        }){
          this.selectedProject = event.value;
          this.selectedWBS = null;
          window.localStorage.setItem('wbsId',event.value.elementCode);
          this.onBoardingService.getWBSByProject(event.value.elementCode).subscribe(response=>{
            console.log("Getting WBS");
            console.log(response);
            this.wbsList = response;
          })
        }

        getEmployees(event:{
          component: SelectSearchableComponent,
          value: any
        }){
          this.selectedWBS = event.value;
          this.onBoardingService.getPositionWithGrossByWBSId(event.value.elementCode).subscribe(response=>{
            console.log("Getting position and Gross");
            console.log(response);
            this.positionAndGrossList = response;
          })
        }

  ngAfterViewInit() {
    this.storage.get('OnBoardingData').then(localStoragedData => {
          if (localStoragedData['actionRequired'][this.storedIndex]) {
            if (localStoragedData['actionRequired'][this.storedIndex].hasOwnProperty('siteDetails')) {
              if(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode']){

              console.log('PERSONAL - ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
              this.siteDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']);
              let branchDetails = this.storage.get('branchDetails');
              this.branchCode = branchDetails['elementCode'];
              this.branchDescription = branchDetails['element'];
              this.projectCode = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode'];
              this.projectDescription = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectDescription'];
              this.wbsCode = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId'];
              this.wbsDescription = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsDescription'];
              this.gross = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross'];
              this.position = localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position'];
              this.showSelectedDetails = true;
              this.siteDetailsForm.controls['projectCode']
                  .setValue(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['projectCode']);
              this.siteDetailsForm.controls['wbsId']
                  .setValue(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['wbsId']);
              this.siteDetailsForm.controls['position']
                  .setValue(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['position']);
              this.siteDetailsForm.controls['gross']
                  .setValue(localStoragedData['actionRequired'][this.storedIndex]['siteDetails']['gross']);
              
              this.isNewEmployee = localStoragedData['actionRequired'][this.storedIndex]['newEmployee'];

            }else if(localStoragedData['actionRequired'][this.storedIndex] && localStoragedData['actionRequired'][this.storedIndex]['projectCode']){
                console.log('PERSONAL - ' + JSON.stringify(localStoragedData['actionRequired'][this.storedIndex]));
                this.siteDetailsForm.patchValue(localStoragedData['actionRequired'][this.storedIndex]);
                let branchDetails = this.storage.get('branchDetails');
                this.branchCode = branchDetails['elementCode'];
                this.branchDescription = branchDetails['element'];
                this.projectCode = localStoragedData['actionRequired'][this.storedIndex]['projectCode'];
                this.projectDescription = localStoragedData['actionRequired'][this.storedIndex] ['projectDescription'];
                this.wbsCode = localStoragedData['actionRequired'][this.storedIndex] ['wbsId'];
                this.wbsDescription = localStoragedData['actionRequired'][this.storedIndex] ['wbsDescription'];
                this.showSelectedDetails = true;
                this.siteDetailsForm.controls['projectCode']
                    .setValue(localStoragedData['actionRequired'][this.storedIndex] ['projectCode']);
                this.siteDetailsForm.controls['wbsId']
                    .setValue(localStoragedData['actionRequired'][this.storedIndex] ['wbsId']);
                this.siteDetailsForm.controls['position']
                    .setValue(localStoragedData['actionRequired'][this.storedIndex] ['position']);
                this.siteDetailsForm.controls['gross']
                    .setValue(localStoragedData['actionRequired'][this.storedIndex] ['gross']);

                this.isNewEmployee = localStoragedData['actionRequired'][this.storedIndex]['newEmployee'];

              }else{
                console.log("No saved data found");
                this.isNewEmployee = true;
              }
            }
          }else{
            console.log("Initial condition opt out");
            this.siteDetailsForm.reset();
            this.isNewEmployee = true;
          }

        }
    );
  }

  ngOnDestroy() {
    this.siteDetailsSubscription.unsubscribe();
  }
}
