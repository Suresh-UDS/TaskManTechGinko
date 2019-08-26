import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {OnboardingService} from "../../../service/onboarding.service";
import {SelectSearchableComponent} from "ionic-select-searchable";
import {onBoardingDataService} from "../onboarding.messageData.service";

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
            this.storedIndex = data['index'];
          });

          this.siteDetailsForm = this.fb.group({
            projectCode: ['', [Validators.required]],
            wbsId:['', [Validators.required]]
          });

          this.siteDetailsSubscription = this.siteDetailsForm.statusChanges.subscribe(status=>{
            console.log(status);
            if(status === 'VALID'){
              let fromStatusValues = {
                status: true,
                data: this.siteDetailsForm.value
              };
              delete fromStatusValues['data']['projectCode'];
              delete fromStatusValues['data']['wbsId'];
              fromStatusValues['data']['projectCode'] = this.selectedProject;
              fromStatusValues['data']['wbsId'] = this.selectedWBS;

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
          this.selectedBranch = event.value.elementCode;
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
          this.selectedProject = event.value.elementCode;
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
          this.selectedWBS = event.value.elementCode;
          console.log("Filter employees");
          console.log(event.value);
        }

}
