import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {componentService} from "../service/componentService";
import {EmployeeDetailPage} from "./employee-detail";

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-list',
  templateUrl: 'employee-list.html',
})
export class EmployeeListPage {

  employee:any;
    firstLetter:any;
  constructor(public navCtrl: NavController,public component:componentService,public myService:authService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Employee list');
    this.component.showLoader('Getting All Employees');
    this.myService.getAllEmployees().subscribe(
        response=>{
          console.log('ionViewDidLoad Employee list:');
            console.log(response);
          this.employee=response;
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad Employee Page:'+error);
        }
    )
  }

    viewEmployee(emp)
    {
        this.navCtrl.push(EmployeeDetailPage,{emp:emp})
    }

    first(emp)
    {
        this.firstLetter=emp.charAt(0);
    }



}
