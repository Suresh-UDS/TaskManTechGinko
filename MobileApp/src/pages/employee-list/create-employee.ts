import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {componentService} from "../service/componentService";
import {EmployeeDetailPage} from "./employee-detail";
import {SiteService} from "../service/siteService";
import {EmployeeService} from "../service/employeeService";
import {EmployeeListPage} from "./employee-list";

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-employee',
  templateUrl: 'create-employee.html',
})
export class CreateEmployeePage {

  employee:any;
  firstLetter:any;
  categories:any;
  firstname:any;
  lastname:any;
  number:any;
  eId:any;
  mail:any;
  address:any;
  eMsg:any;
  eImg:any;
  username:any;
  password:any;
  msg:any;
  selectedProject:any;
  selectedSite:any;
  projects:any;
  sites:any;
  designations:any;
  projectSites:any;
  designation:any;
  manager:any;
  selectedManager:any;
  constructor(public navCtrl: NavController,public component:componentService,public myService:authService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController, private siteService:SiteService, private employeeService: EmployeeService,
              private geoFence:Geofence) {

    this.categories = 'basic';
    this.getAllProjects();

    this.employeeService.getAllDesignations().subscribe(
        response=>{
            this.designations = response;
        }
    );

    this.employeeService.getAllEmployees().subscribe(
        response=>{
            this.manager = response;
        }
    )

  }


  ionViewDidLoad()
  {

  }

  viewCamera()
  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.eImg = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // error
    });
  }

  getAllProjects(){
      this.component.showLoader('Getting Clients..');
      this.siteService.getAllProjects().subscribe(
          response=>{
              console.log(response);
              this.projects = response;
              this.component.closeLoader();
          },err=>{
              console.log(err);
              this.component.closeLoader();
              this.component.showToastMessage('Unable to get Clients, please try again..','bottom');
          }
      )
  }

  getSites(projectId,projectName){
      this.component.showLoader('Getting Sites of Client '+projectName+'..');
      this.siteService.findSitesByProject(projectId).subscribe(
          response=>{
          console.log(response);
          this.sites = response;
              this.component.closeLoader();
          },err=>{
              console.log(err);
              this.component.closeLoader();
              this.component.showToastMessage('Unable to get Clients, please try again..','bottom');
      })
  }

  addProjectSites(){
      var projSite = {
          "projectId":this.selectedProject.id,
          "projectName":this.selectedProject.name,
          "siteId":this.selectedSite.id,
          "siteName":this.selectedSite.name
      };
      this.projectSites.push(projSite);
  }

  addJob() {
    console.log('form submitted');
    if (this.firstname && this.lastname && this.eId  )
    {
        // Save Employee
        this.employee = {
                name:this.firstname,
                lastName:this.lastname,
                designation:this.designation,
                empId:this.eId,
                projectId: this.selectedProject.id,
                siteId: this.selectedSite.id,
                projectSites:this.projectSites,
                managerId:this.selectedManager.id
        };

        console.log("Employee Details");
        console.log(this.employee);
        this.component.showLoader('Creating Employee');
        // this.employeeService.createEmployee(this.employee).subscribe(
        //     response=>{
        //         console.log(response)
        //         this.component.closeLoader();
        //         this.component.showToastMessage('Employee Created','bottom');
        //         this.navCtrl.setRoot(EmployeeListPage);
        //     }
        // )
      this.component.showToastMessage(this.msg,'bottom');
    }
    else
    {
      if(!this.firstname)
      {
        this.eMsg = "firstname";
      }
      else if(!this.lastname)
      {
        this.eMsg = "lastname";
      }
      else if(!this.number)
      {
        this.eMsg = "number";
      }
      else if(!this.mail)
      {
        this.eMsg = "mail";
      }
      else if(!this.eId)
      {
        this.eMsg = "eId";
      }
      else if(!this.address)
      {
        this.eMsg = "address";
      }
      else
      {
        this.eMsg = "all";
      }
      this.component.showToastMessage(this.msg,'bottom');
    }
  }
  login() {
    console.log('form submitted');
    if (this.username && this.password) {


    }
    else {
      if (this.username) {
        this.eMsg = "password";
      }
      else if (this.password) {
        this.eMsg = "username";
      }
      else if (!this.username && !this.password) {
        this.eMsg = "all";
      }
    }
  }
}
