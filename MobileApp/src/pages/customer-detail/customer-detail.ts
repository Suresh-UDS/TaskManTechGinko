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
  selector: 'page-customer-detail',
  templateUrl: 'customer-detail.html',
})
export class CustomerDetailPage {

  jobs:any;
  constructor(public navCtrl: NavController, public component:componentService,public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence) {


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }
  getAllJobs(){
    this.component.showLoader('Getting All Jobs');
    var search={};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }



}
