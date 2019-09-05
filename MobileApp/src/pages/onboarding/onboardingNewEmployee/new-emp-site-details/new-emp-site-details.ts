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
  pipe = new DatePipe('en-US');
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private storage: Storage, private onBoardingService: OnboardingService, private messageService: onBoardingDataService) {

    this.selectedBranch = null;
    this.selectedProject = null;
    this.selectedWBS = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewEmpSiteDetails');
    this.getBranches();
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
          })

          this.siteDetailsForm = this.fb.group({
            projectCode: ['', [Validators.required]],
            wbsId:['', [Validators.required]],
            position:['',[Validators.required]]
          });

          this.siteDetailsSubscription = this.siteDetailsForm.statusChanges.subscribe(status=>{
            console.log(status);
            if(status === 'VALID'){
              let fromStatusValues = {
                status: true,
                data: this.siteDetailsForm.value
              };
              console.log(fromStatusValues['data']['projectCode']);
              console.log(fromStatusValues['data']['projectCode']['elementCode']);
              console.log(fromStatusValues['data']['projectCode']['element']);
              let projectDetails = fromStatusValues['data']['projectCode'];
              let wbsDetails = fromStatusValues['data']['wbsId'];
              fromStatusValues['data']['projectCode'] = projectDetails['elementCode'];
              fromStatusValues['data']['wbsId'] = wbsDetails['elementCode'];
              fromStatusValues['data']['projectDescription'] = projectDetails['element'];
              fromStatusValues['data']['wbsDescription'] = wbsDetails['element'];
              console.log("Wbs id");
              console.log(fromStatusValues['data']['wbsId']);
              console.log(fromStatusValues['data']['wbsId']);
              console.log(fromStatusValues['data']['projectDescription']);
              console.log(fromStatusValues['data']['wbsDescription']);
              console.log(fromStatusValues['data']['projectCode']);

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
          console.log("Filter employees");
          console.log(this.selectedWBS);
        }

}
