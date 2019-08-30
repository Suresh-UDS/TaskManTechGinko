import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {OnboardingService} from "../../../service/onboarding.service";
import {SelectSearchableComponent} from "ionic-select-searchable";
import {componentService} from "../../../service/componentService";

/**
 * Generated class for the OnBoardingEmployeeFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-on-boarding-employee-filter',
  templateUrl: 'on-boarding-employee-filter.html',
})
export class OnBoardingEmployeeFilter {

  branches:any;
  projects:any;
  wbsList:any;
  selectedBranch:any;
  selectedProject:any;
  selectedWBS:any;

  filterData:{
    branch:any,
    project:any,
    wbs:any
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                        public onBoardingService: OnboardingService, public cs:componentService
  ) {

    this.selectedBranch = null;
    this.selectedProject = null;
    this.selectedWBS = null;

    this.filterData = {
        branch: null,
        project :null,
      wbs:null
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnBoardingEmployeeFilter');
    this.getBranches();
  }

  getBranches(){
    this.cs.showLoader("Loading Branches...");
    this.onBoardingService.getBranches().subscribe(response=>{
      this.cs.closeAll();
      console.log("Getting branches");
      console.log(response);
      this.branches = response;
    },err=>{
      this.cs.closeAll();
    })

  }

  getProjectByBranch(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    this.cs.showLoader("Loading Projects for Branch - "+event.value.element);
    this.selectedBranch = event.value;
    this.onBoardingService.getProjectsByBranch(event.value.elementCode).subscribe(response=>{
      this.cs.closeLoader();
      console.log("Getting projects");
      console.log(response);
      this.projects = response;
    },err=>{
      this.cs.closeAll();
    })
  }

  getWBSByProject(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    this.cs.showLoader("Loading WBS for Project - "+event.value.element);
    this.selectedProject = event.value;
    this.onBoardingService.getWBSByProject(event.value.elementCode).subscribe(response=>{
      this.cs.closeAll();
      console.log("Getting WBS");
      console.log(response);
      this.wbsList = response;
    },err=>{
      this.cs.closeAll();
    })
  }

  getEmployees(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    this.selectedWBS = event.value;
      console.log("Filter employees");
      console.log(event.value);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  filterEmployees(){
    this.filterData.branch = this.selectedBranch;
    this.filterData.project = this.selectedProject;
    this.filterData.wbs = this.selectedWBS;
    this.viewCtrl.dismiss(this.filterData);
  }

}
