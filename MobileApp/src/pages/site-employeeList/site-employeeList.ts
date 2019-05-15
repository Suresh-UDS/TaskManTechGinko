import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {EmployeeList} from "../employee/employee-list";
import {AttendanceService} from "../service/attendanceService";
import {SiteService} from "../service/siteService";
import {EmployeeService} from "../service/employeeService";

declare var demo;

/**
 * Generated class for the EmployeeSiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-site-employee-list',
  templateUrl: 'site-employeeList.html',
})
export class EmployeeSiteListPage {

  siteList:any;
  userGroup:any;
  employeeId:any;
  employeeFullName: any;
  employeeEmpId:any;
  lattitude:any;
  longitude:any;
  checkedIn:any;
  loader:any;
  attendanceId:any;
  employee:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController, private attendanceService: AttendanceService,
              private siteService: SiteService, private employeeService: EmployeeService) {

    this.geolocation.getCurrentPosition().then((response)=>{
      console.log("Current location");
      console.log(response);
      this.lattitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
    }).catch((error)=>{
      this.lattitude = 0;
      this.longitude = 0;
    })

  }

  viewList(i)
  {
      this.navCtrl.push(AttendanceListPage);
  }

  showSuccessToast(msg){
    let toast = this.toastCtrl.create({
      message:msg,
      duration:3000,
      position:'bottom'
    });

    toast.present();
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

  getAttendances(site){
    this.attendanceService.getSiteAttendances(site.id).subscribe(response=>{
        if(response.errorStatus){
            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
        }else{
            console.log(response);
            this.navCtrl.push(AttendanceListPage,{'attendances':response});
        }

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }

  ionViewWillEnter(){

      this.siteService.searchSite().subscribe(response=>{
          if(response.errorStatus){
              demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
          }else{
              console.log(response);
              this.siteList = response;
              this.userGroup = window.localStorage.getItem('userGroup');
              this.employeeId = window.localStorage.getItem('employeeId');
              this.employeeFullName = window.localStorage.getItem('employeeFullName');
              this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
              var employeeDetails = JSON.parse(window.localStorage.getItem('employeeDetails'));
              this.employee = employeeDetails.employee;
              console.log("Employee details from localstorage");
              console.log(this.employee.userId);
              // this.attendanceService.getAttendances(this.employeeId, this.site).subscribe(
              //   response =>{
              //     console.log(response.json());
              //     var result = response.json()
              //     if(result[0]){
              //       console.log("already checked in ");
              //       this.checkedIn = true;
              //       this.attendanceId=result[0].id;
              //
              //     }else{
              //       console.log("Not yet checked in ");
              //       this.checkedIn = false;
              //     }
              //   }
              // );
          }

      })


  }

  gotoEmployeeList(site){
    this.navCtrl.push(EmployeeList,{site:site});
  }

  viewCamera(siteId,attendanceMode)
  {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // let loader = this.loadingCtrl.create({
      //   content:''
      // });
      // loader.present();
      var employeeName = this.employeeFullName + this.employeeEmpId;
      if(attendanceMode == 'enroll'){
        this.showLoader('Enrolling Face');
        this.authService.enrollFace(employeeName,imageData).subscribe(response=>{
          console.log("Face verification response");
          console.log(response);
          var verificationResponse = response;
          this.employee.imageData = imageData;
          this.employeeService.markEnrolled(this.employee).subscribe(response=>{
            console.log("face marked to database");
            this.closeLoader();
            var msg='Face enrolled Successfully';
            this.showSuccessToast(msg);
          },error=>{
            this.closeLoader();
            console.log("Error in enrolling to server");
            console.log(error)
          });

        },error=>{
          this.closeLoader();
          console.log("Error");
          console.log(error)
        })
      }else {

        this.showLoader('getting location');
        var employeeName = this.employeeFullName + this.employeeEmpId;

        this.geolocation.getCurrentPosition().then((response) => {
          console.log("Current location");
          console.log(response);
          this.closeLoader();
          this.showLoader('verifying Location');
          this.lattitude = response.coords.latitude;
          this.longitude = response.coords.longitude;
          this.attendanceService.checkSiteProximity(siteId, this.lattitude, this.longitude).subscribe(
            response => {
              this.closeLoader();
              this.showLoader('');
              console.log(response);

              this.authService.detectFace(employeeName, imageData).subscribe(response => {
                  console.log("response in site list");
                  console.log(response);
                  var detectResponse = response;

                  if (detectResponse.images && detectResponse.images[0].status === 'Complete') {
                    this.closeLoader();

                    if (attendanceMode == 'checkIn') {
                      this.showLoader('Verifying Face');
                      this.authService.verifyUser(employeeName, imageData).subscribe(response => {
                        console.log("Face verification response");
                        console.log(response);
                        var verificationResponse = response;
                        if (verificationResponse && verificationResponse.images) {
                          if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                            console.log(this.lattitude);
                            console.log(this.longitude);
                            this.closeLoader();
                            this.showLoader('Marking Attendance');
                            this.attendanceService.markAttendanceCheckIn(siteId, this.employeeEmpId, this.lattitude, this.longitude, imageData,null,false).subscribe(response => {
                              console.log(response);
                              this.closeLoader();
                              if (response && response.status === 200) {
                                var msg = 'Face Verified and Attendance marked Successfully';
                                this.showSuccessToast(msg);
                                window.location.reload();
                              }
                            }, error => {
                              var msg = 'Attendance Not Marked';
                              console.log(error);
                              this.showSuccessToast(msg);
                              this.closeLoader();
                            })
                          }
                        } else {
                          this.closeLoader();
                          var msg = "Unable to verify face, please try again";
                          this.showSuccessToast(msg);
                        }
                      }, error => {
                        this.closeLoader();
                        var msg = "Unable to verify face, please try again";
                        this.showSuccessToast(msg);
                      })

                    } else {
                      this.showLoader('Verifying Face');
                      this.authService.verifyUser(employeeName, imageData).subscribe(response => {
                        console.log("Face verification response");
                        console.log(response);
                        var verificationResponse = response;
                        if (verificationResponse && verificationResponse.images) {
                          if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                            console.log(this.lattitude);
                            console.log(this.longitude);
                            this.closeLoader();
                            this.showLoader('Marking Attendance');

                            this.attendanceService .markAttendanceCheckOut(siteId, this.employeeEmpId, this.lattitude, this.longitude, imageData, this.attendanceId,null,false).subscribe(response => {
                              console.log(response);
                              this.closeLoader();
                              if (response && response.status === 200) {
                                var msg = 'Face Verified and Attendance marked Successfully';
                                this.showSuccessToast(msg);
                                window.location.reload();
                              }
                            }, error => {
                              var msg = 'Attendance Not Marked';
                              console.log(error);
                              this.showSuccessToast(msg);
                              this.closeLoader();
                            })
                          }
                        } else {
                          this.closeLoader();
                          var msg = "Unable to verify face, please try again";
                          this.showSuccessToast(msg);
                        }
                      }, error => {
                        this.closeLoader();
                        var msg = "Unable to verify face, please try again";
                        this.showSuccessToast(msg);
                      })
                    }

                  } else {
                    console.log("error in detecting face");
                    this.closeLoader();
                    var msg = "Face not Detected, please try again";
                    this.showSuccessToast(msg);
                  }


                }, error => {
                  console.log("errors")
                  console.log(error);
                  if (error.status == "false") {
                    var msg = "You are currently not at the site location";
                    this.showSuccessToast(msg);
                    this.closeLoader();
                  }
                }
              )
            }, error => {
              console.log("errors");
              console.log("errors")
              console.log(error);
              if (error.status === "false") {
                var msg = "You are currently not at the site location";
                this.showSuccessToast(msg);
                this.closeLoader();
              } else {
                var msg = "You are currently not at the site location";
                this.showSuccessToast(msg);
                this.closeLoader();
              }
            });

        }).catch((error) => {

          console.log("Location error")
          this.lattitude = 0;
          this.longitude = 0;
          var msg = "Unable to get location";
          this.showSuccessToast(msg);
          this.closeLoader();
        })
      }

      // this.navCtrl.push(AttendanceViewPage,imageData)
    }, (err) => {


      console.log("Location error")
      this.lattitude = 0;
      this.longitude = 0;

      var msg= "Unable to get location";
      this.showSuccessToast(msg);
    })
  }

}
