import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AttendanceViewPage} from "../attendance-view/attendance-view";
import {authService} from "../service/authService";
import {AttendanceService} from "../service/attendanceService";
import {componentService} from "../service/componentService";

declare var demo;
/**
 * Generated class for the AttendanceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-attendance-list',
  templateUrl: 'attendance-list.html',
})
export class AttendanceListPage {
  siteList:any;
  attendances:any;
  siteId:any;
  employeeId:any;
  empId:any;

    fakeUsers: Array<any> = new Array(12);
  constructor(public navCtrl: NavController, public navParams: NavParams,public camera: Camera, private authService: authService, private attendanceService:AttendanceService, private cs:componentService) {

  }

  ionViewDidLoad() {


    var now = new Date().getTime();
    console.log('ionViewDidLoad AttendanceListPage'+now);
    this.siteId = this.navParams.get('siteId');
    this.employeeId = this.navParams.get('employeeId');
    this.empId = this.navParams.get('empId');

    // this.getAttendances(this.employeeId,this.siteId);
    this.searchAttendances(this.siteId,this.empId);

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

    let base64Image = 'data:image/jpeg;base64,' + imageData;

    // this.navCtrl.push(AttendanceViewPage,base64Image)
    }, (err) => {

    })
  }

  getAttendances = function(employeeId,siteId){
      this.cs.showLoader('Getting Attendances');
      this.attendanceService.getAttendances(employeeId,siteId).subscribe(
          response=>{
              if(response.errorStatus){
                  this.cs.closeAll();
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  this.cs.closeAll();
                  console.log(response);
                  this.attendances = response;
              }

          }
      )
  }

  searchAttendances = function ( siteId,empId) {
      var search = {
          siteId:siteId,
          isFindAll:true,
          employeeEmpId:empId
      };
      this.cs.showLoader('Getting Attendances');
      this.attendanceService.searchAttendances(search).subscribe(
          response=>{
              this.cs.closeAll();
              console.log(response);
              this.attendances = response.transactions;
          }
      )
  };

  addRemarks = function (attendanceId, remarks) {
      this.cs.showLoader('Adding remarks..');
      this.attendanceService.addRemarks(attendanceId,remarks).subscribe(
          response=>{
              if(response.errorStatus){
                  this.cs.closeAll();
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  this.cs.closeAll();
                  console.log(response);
                  this.searchAttendances(this.employeeId,this.siteId);
              }

          }
      )
  }

}

