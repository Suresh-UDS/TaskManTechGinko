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
  constructor(public navCtrl: NavController,public component:componentService,public myService:authService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence) {

    this.categories = 'basic';
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
    }

    this.camera.getPicture(options).then((imageData) => {
      this.eImg = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // error
    });
  }

  addJob() {
    console.log('form submitted');
    if (this.firstname && this.lastname && this.number && this.mail && this.eId && this.address )
    {
        // Save Employee
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
