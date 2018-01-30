import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {componentService} from "../service/componentService";

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-detail',
  templateUrl: 'employee-detail.html',
})
export class EmployeeDetailPage {

  empDetail:any;
  categories:any;
  jobs:any;
  attendances:any;
  ref=false;
  job="job";
  attendance="attendance";

  constructor(public navCtrl: NavController,public myService:authService, public component:componentService,public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence) {

    this.empDetail=this.navParams.get('emp');
    this.categories = 'detail';

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Employee Detail Page');
    console.log(this.empDetail);


  }

  doRefresh(refresher,segment)
  {
    this.ref=true;
    if(segment=="job")
    {
      this.getJobs(this.ref);
      refresher.complete();
    }
    else if(segment=="attendance")
    {
      console.log("------------- segment attandance");
      this.getAttendance(this.ref);
      refresher.complete();
    }

  }

  getJobs(ref)
  {
    if(this.jobs)
    {
      if(ref)
      {
        this.loadJobs();
      }
      else
      {
        this.jobs=this.jobs;
      }
    }
    else
    {
      this.loadJobs();
    }
  }

  loadJobs()
  {
    this.component.showLoader('Getting All Jobs');
    var search={empId:this.empDetail.id};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("Job Refresher");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }

  getAttendance(ref)
  {
    if(this.attendances)
    {
      if(ref)
      {
        console.log("------------- segment attandance ref true");
        this.loadAttendance();
      }
      else
      {
        this.attendances=this.attendances;
      }
    }
    else
    {
      this.loadAttendance();
    }
  }


  loadAttendance()
  {
    this.component.showLoader('Getting Attendance');
    this.authService.getSiteAttendances(this.empDetail.id).subscribe(response=>{
      console.log("Loader Attendance");
      console.log(response);
      this.attendances = response.json();
      this.component.closeLoader();
    })
  }

  getAllJobs(){
    this.component.showLoader('Getting All Jobs');
    var search={empId:this.empDetail.id};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }





}
