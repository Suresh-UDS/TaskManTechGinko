import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {OnboardingService} from "../../../service/onboarding.service";
import {SelectSearchableComponent} from "ionic-select-searchable";
import {componentService} from "../../../service/componentService";
import {Storage} from "@ionic/storage";

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
  empNameSearch:any;
  empCodeSearch:any;
  showError:any;
  errorMessage:any;

  filterData:{
    branch:any,
    projectCode:any,
    wbsCode:any,
    employeeEmpId:any,
    name:any
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private storage: Storage, public onBoardingService: OnboardingService, public cs:componentService
  ) {

    this.storage.get('initBranches').then(initBranches=>{
      if(initBranches){
        this.branches = initBranches;
      }else{
        this.getBranches();
      }
    },err=>{ 
      this.getBranches();
    });

    this.storage.get('filteredProjects').then(filteredProjects=>{
        this.projects = filteredProjects;
    });

    this.storage.get('filteredWBS').then(filteredWBS=>{
      this.wbsList = filteredWBS;
    });

    this.storage.get('filterDetails').then(filterData=>{
      console.log("Filter data");
      console.log(filterData);
      this.selectedBranch = filterData.branch;
      this.selectedProject = filterData.project;
      this.selectedWBS = filterData.wbs;
      this.empCodeSearch = filterData.empCodeSearch;
      this.empNameSearch = filterData.name;
    },err=>{
      console.log("No filter options available");
      this.clearFilter();
    });


    
  }

  clearFilter(){
    console.log("Clear Filter");
    this.selectedBranch = null;
    this.selectedProject = null;
    this.selectedWBS = null;
    this.showError = false;

    this.filterData = {
      branch: null,
      projectCode :null,
      wbsCode:null,
      employeeEmpId:null,
      name:null
    }

    this.storage.remove('filterDetails').then(result=>{
      console.log("filter cleared from storage");
      console.log(result);
      this.filterData = {
        branch: null,
        projectCode :null,
        wbsCode:null,
        employeeEmpId:null,
        name:null
      }

      this.selectedBranch = null;
      this.selectedProject = null;
      this.selectedWBS = null;
      this.showError = false;

    },err=>{
      console.log("Error in clearing storage");
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnBoardingEmployeeFilter');
    
  }

  getBranches(){
    this.cs.showLoader("Loading Branches...");
    this.onBoardingService.getBranches().subscribe(response=>{
      this.cs.closeAll();
      console.log("Getting branches");
      console.log(response);
      this.branches = response;
      this.storage.set('initBranches',this.branches);
      // if(this.selectedBranch.elementCode){ 
      //   this.loadProjectofBranches(this.selectedBranch.elementCode);
      // }
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
    this.storage.set('branchDetails',this.selectedBranch);
    this.selectedProject = null;
    this.selectedWBS = null;
    this.onBoardingService.getProjectsByBranch(event.value.elementCode).subscribe(response=>{
      this.cs.closeLoader();
      console.log("Getting projects");
      console.log(response);
      this.projects = response;
      this.storage.set('filteredProjects',this.projects);
    },err=>{
      this.cs.closeAll();
    });
  }

  loadProjectofBranches(branchCode){
    this.cs.showLoader("Loading Projects");
    this.onBoardingService.getProjectsByBranch(branchCode).subscribe(response=>{
      this.cs.closeLoader();
      console.log("Getting projects");
      console.log(response);
      if(this.selectedProject.elementCode){
        this.loadWBSofProject(this.selectedProject.elementCode);
      }
      this.projects = response;
      
    },err=>{
      this.cs.closeAll();
    });
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
      this.storage.set('filteredWBS',this.wbsList);
    },err=>{
      this.cs.closeAll();
    })
  }

  loadWBSofProject(projectCode){
    this.cs.showLoader("Loading WBS ");
    this.onBoardingService.getWBSByProject(projectCode).subscribe(response=>{
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
    this.filterData = {
      branch: null,
      projectCode :null,
      wbsCode:null,
      employeeEmpId:null,
      name:null
    }
    if(this.selectedBranch && this.selectedBranch.element){
      this.filterData.branch = this.selectedBranch;
      if(this.selectedProject && this.selectedProject.element){
        this.filterData.projectCode = this.selectedProject.elementCode;
        if(this.selectedWBS && this.selectedWBS.element){
          this.filterData.wbsCode = this.selectedWBS.elementCode;
            this.filterData.employeeEmpId = this.empCodeSearch;
            this.filterData.name = this.empNameSearch;
            this.showError = false;
            let filterDetails = {
              branch:this.selectedBranch,
              project:this.selectedProject,
              wbs:this.selectedWBS,
              name:this.empNameSearch,
              empId: this.empCodeSearch
            }

            if(this.empCodeSearch && this.empNameSearch){
              this.showError = true;
              this.errorMessage = "Please enter Employee Code or Name, searching with both code and name is restricted";
            }else{
              this.storage.set('filterDetails',filterDetails);
              this.viewCtrl.dismiss(this.filterData);
  
            }
            
        }else{
            this.showError= true;
            this.errorMessage = "Please Select WBS";
        }
      }else{
        this.showError = true;
        this.errorMessage = "Please Select Project";
      }
    }else{
      this.showError = true;
        this.errorMessage = "Please Select Branch";
    }
   
  }

}
