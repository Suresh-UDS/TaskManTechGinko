import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {EmployeeService} from "../service/employeeService";
import {JobService} from "../service/jobService";
import {SiteService} from "../service/siteService";
import {AttendanceService} from "../service/attendanceService";
import {componentService} from "../service/componentService";
import {AttendanceViewPage} from "../attendance-view/attendance-view";

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
export class EmployeeList {

  employeeList:any;
  userGroup:any;
  employeeId:any;
  employeeFullName: any;
  employeeEmpId:any;
  lattitude:any;
  longitude:any;
  checkedIn:any;
  site:any;
  attendanceId:any;
  loader:any;
  constructor(public navCtrl: NavController,public component:componentService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence, private employeeService: EmployeeService, private jobService: JobService, private siteService:SiteService, private attendanceService:AttendanceService) {

        this.lattitude = 0;
        this.longitude = 0;

    this.site = this.navParams.get('site');

  }

  viewList(i)
  {
    this.navCtrl.push(AttendanceListPage);
  }

  showSuccessToast(msg){
    this.component.showToastMessage(msg,'bottom');
  }

  showLoader(msg){
    this.loader = this.loadingCtrl.create({
      content:msg
    });
    this.loader.present();
  }

  closeLoader(){
      this.loader.dismiss();
  }

  closeAll(){
      this.loader.dismissAll();
  }

  getAttendances(site){
    this.attendanceService.getSiteAttendances(site.id).subscribe(response=>{
      console.log(response.json());
      this.navCtrl.push(AttendanceListPage,{'attendances':response.json()});
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
    var options={
        timeout:3000
    }
      this.geolocation.getCurrentPosition(options).then((response)=>{
          console.log("Current location");
          console.log(response);
          this.lattitude = response.coords.latitude;
          this.longitude = response.coords.longitude;
      }).catch((error)=>{
          console.log("error in getting current location");
          this.lattitude = 0;
          this.longitude = 0;
      });
  }

  getEmployeeAttendance(employeeId){
    this.attendanceService.getAttendances(employeeId,this.site.id).subscribe(
      response=>{
        console.log(response);
        this.navCtrl.push(AttendanceListPage,{'attendances':response.json()});
      }
    )
  }


  ionViewWillEnter(){

    this.siteService.searchSiteEmployee(this.site.id).subscribe(response=>{
      console.log(response.json());
      this.employeeList = response.json();
      this.userGroup = window.localStorage.getItem('userGroup');
      this.employeeId = window.localStorage.getItem('employeeId');
      this.employeeFullName = window.localStorage.getItem('employeeFullName');
      this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
      for(let employee of this.employeeList) {
        this.attendanceService.getAttendances(employee.id,this.site.id).subscribe(
          response =>{
            console.log(response.json());
            var result = response.json()
            if(result[0]){
              console.log("already checked in ");
              employee.checkedIn = true;
              employee.attendanceId = result[0].id;
            }else{
              console.log("Not yet checked in ");
              employee.checkedIn = false;
            }
          }
        );
      }
    })

  }

  isEmployeeCheckedIn(employeeId){
    this.attendanceService.getAttendances(employeeId,this.site.id).subscribe(
      response =>{
        console.log(response.json());
        var result = response.json()
        if(result[0]){
          console.log("already checked in ");
          this.checkedIn = true;

        }else{
          console.log("Not yet checked in ");
          this.checkedIn = false;
        }
      }
    );
  }

  viewCamera(employee,mode,attendanceMode)
  {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection:1
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      var employeeName = employee.fullName+employee.empId;
        this.checkProximity(this.site.id,this.lattitude,this.longitude,imageData,mode,attendanceMode,employee);
      // this.navCtrl.push(AttendanceViewPage,imageData)
    }, (err) => {
      console.log("Location error");
      this.lattitude = 0;
      this.longitude = 0;

      var msg= "Please try again...";
      this.showSuccessToast(msg);
    })
  }

  checkProximity(siteId,lat,lng,imageData,mode,attendanceMode,employee){
      this.attendanceService.checkSiteProximity(siteId,lat,lng).subscribe(
          response=> {
              this.showLoader('Verifying Location..');
              this.verifyFaceAndMarkAttendance(employee,mode,attendanceMode,imageData);

          },error=>{
              console.log("errors");
              this.verifyFaceAndMarkAttendance(employee,mode,attendanceMode,imageData);

          })
  }

  verifyFaceAndMarkAttendance(employee,mode,attendanceMode,imageData){
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      var employeeName = employee.fullName+employee.empId;
      this.showLoader('Detecting Face');
      this.authService.detectFace(this.employeeFullName,imageData).subscribe(response=>{
              console.log("response in site list");
              console.log(response.json());
              var detectResponse = response.json();
              this.closeLoader();
              if(detectResponse.images && detectResponse.images[0].status === 'Complete'){
                  if(mode === 'enroll'){
                      this.showLoader('Enrolling Face Id');
                      this.authService.enrollFace(employeeName,imageData).subscribe(response=>{
                          var verificationResponse = response.json();
                          employee.imageData = imageData;
                          this.employeeService.markEnrolled(employee).subscribe(response=>{
                              console.log("face Id marked to database");
                              this.closeLoader();
                              var msg='Face Id enrolled Successfully';
                              this.showSuccessToast(msg);
                          },error=>{
                              this.closeLoader();
                              var msg='Error in enrolling Face Id..';
                              this.showSuccessToast(msg);
                              console.log("Error in enrolling Face Id..");
                              console.log(error)
                          });

                      },error=>{
                          this.closeLoader();
                          var msg='Error in Detecting Face..';
                          this.showSuccessToast(msg);
                          console.log("Error");
                          console.log(error)
                      })

                  }else{

                      if(attendanceMode == 'checkIn'){
                          this.showLoader('Verifying Face');
                          this.authService.verifyUser(employeeName,imageData).subscribe(response=>{
                              console.log("Face verification response");
                              console.log(response.json());
                              this.closeLoader();
                              var verificationResponse = response.json();
                              if(verificationResponse && verificationResponse.images){
                                  if(verificationResponse.images[0].transaction.confidence >=0.75){
                                      console.log(this.lattitude);
                                      console.log(this.longitude);
                                      this.closeLoader();
                                      this.showLoader('Marking Attendance');
                                      this.markAttendance(employee,imageData);
                                  }else{
                                      this.closeLoader();
                                      this.showLoader('Marking Attendance');
                                      this.markAttendance(employee,imageData);
                                  }
                              }else{
                                  this.closeLoader();
                                  var msg = "Unable to verify face, Marking Attendance";
                                  this.showSuccessToast(msg);
                                  this.markAttendance(employee,imageData);
                              }
                          },error=>{
                              this.closeLoader();
                              var msg="Unable to verify face, Marking Attendance";
                              this.showSuccessToast(msg);
                              this.markAttendance(employee,imageData);

                          })

                      }else{
                          this.showLoader('Verifying Face');
                          this.authService.verifyUser(employeeName,imageData).subscribe(response=>{
                              console.log("Face verification response");
                              console.log(response.json());
                              var verificationResponse = response.json();
                              if(verificationResponse && verificationResponse.images){
                                  if(verificationResponse.images[0].transaction.confidence >=0.75){
                                      console.log(this.lattitude);
                                      console.log(this.longitude);
                                      this.closeLoader();
                                      this.showLoader('Marking Attendance');
                                      this.markAttendanceCheckOut(employee,imageData);
                                  }else{
                                      this.closeLoader();
                                      this.showLoader('Marking Attendance');
                                      this.markAttendanceCheckOut(employee,imageData);
                                  }
                              }else{
                                  this.closeLoader();
                                  var msg = "Unable to verify face, Marking Attendance";
                                  this.showSuccessToast(msg);
                                  this.markAttendanceCheckOut(employee,imageData);
                              }
                          },error=>{
                              this.closeLoader();
                              var msg="Unable to verify face, Marking Attendance";
                              this.showSuccessToast(msg);
                              this.markAttendanceCheckOut(employee,imageData);
                          })
                      }

                  }

              }else{
                  console.log("error in detecting face");
                  this.closeLoader();
                  var msg = "Face not Detected, please try again..";
                  this.showSuccessToast(msg);
              }


          },error=>{
              console.log("errors");
          this.closeLoader();
          console.log(error.json());
              if(error.json().status == "false"){
                  var msg= "Face not detected, please try again..";
                  this.showSuccessToast(msg);
                  this.closeLoader();
              }
          }
      )
  }

  markAttendance(employee,imageData){
      this.attendanceService.markAttendanceCheckIn(this.site.id,employee.empId,this.lattitude,this.longitude,imageData).subscribe(response=>{
          console.log(response.json());
          this.closeAll();
          if(response && response.status === 200){
              var msg='Face Verified and Attendance marked Successfully';
              this.showSuccessToast(msg);
          }
      },error=>{
          var msg = 'Attendance Not Marked';
          console.log(error);
          this.showSuccessToast(msg);
          this.closeAll();
      })
  }

  markAttendanceCheckOut(employee,imageData){
      this.attendanceService.markAttendanceCheckOut(this.site.id,employee.empId,this.lattitude,this.longitude,imageData,employee.attendanceId).subscribe(response=>{
          console.log(response.json());
          this.closeAll();
          if(response && response.status === 200){
              var msg='Face Verified and Attendance marked Successfully';
              this.showSuccessToast(msg);
          }
      },error=>{
          var msg = 'Attendance Not Marked';
          console.log(error);
          this.showSuccessToast(msg);
          this.closeAll();
      })
  }


}
