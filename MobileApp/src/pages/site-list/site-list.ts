import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {EmployeeList} from "../employee/employee-list";
import {AttendanceService} from "../service/attendanceService";
import {SiteService} from "../service/siteService";
import {componentService} from "../service/componentService";

declare var demo;

/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-site-list',
    templateUrl: 'site-list.html',
})
export class SiteListPage {
<<<<<<< HEAD
    isLoading:boolean;
    siteList:any;
    userGroup:any;
    employeeId:any;
    employeeFullName: any;
    employeeEmpId:any;
    lattitude:any;
    longitude:any;
    checkedIn:any;

    fakeSiteList: Array<any> = new Array(12);

    constructor(public navCtrl: NavController,public component:componentService, public navParams: NavParams, private  authService: authService, public camera: Camera,
                private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController, private attendanceService: AttendanceService, private siteService: SiteService) {

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
        this.component.showToastMessage(msg,'bottom');
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
        this.isLoading=true;
        var searchCriteria = {
            findAll:true,
            currPage:1,
            sort:10,
            sortByAsc:true,
            report:true
        };

        this.siteService.searchSites(searchCriteria).subscribe(
            response=>{
                this.siteList=response.transactions;
                this.isLoading=false;
            this.userGroup = window.localStorage.getItem('userGroup');
            this.employeeId = window.localStorage.getItem('employeeId');
            this.employeeFullName = window.localStorage.getItem('employeeFullName');
            this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            console.log(window.localStorage.getItem('responseImageDetails'));
        })

        // this.attendanceService.getAttendances(this.employeeId).subscribe(
        //   response =>{
        //     console.log(response.json());
        //     var result = response.json()
        //     if(result[0]){
        //       console.log("already checked in ");
        //       this.checkedIn = true;
        //
        //     }else{
        //       console.log("Not yet checked in ");
        //       this.checkedIn = false;
        //     }
        //   }
        // );
    }

    gotoEmployeeList(site){
        this.navCtrl.push(EmployeeList,{site:site});
    }

    // viewCamera(siteId)
    // {
    //   const options: CameraOptions = {
    //     quality: 50,
    //     destinationType: this.camera.DestinationType.DATA_URL,
    //     encodingType: this.camera.EncodingType.JPEG,
    //     mediaType: this.camera.MediaType.PICTURE
    //   };
=======
  isLoading:boolean;
  siteList:any;
  userGroup:any;
  employeeId:any;
  employeeFullName: any;
  employeeEmpId:any;
  lattitude:any;
  longitude:any;
  checkedIn:any;

  fakeSiteList: Array<any> = new Array(12);

    constructor(public navCtrl: NavController,public component:componentService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController, private attendanceService: AttendanceService, private siteService: SiteService) {

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
      this.component.showToastMessage(msg,'bottom');
  }

  getAttendances(site){
        this.attendanceService.getSiteAttendances(site.id).subscribe(response=>{
        console.log(response.json());
        this.navCtrl.push(AttendanceListPage,{'attendances':response.json()});
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteListPage');
  }

  ionViewWillEnter(){
        this.isLoading=true;
        this.siteService.searchSite().subscribe(response=>{
        this.isLoading=false;
        console.log(response.json());
        this.siteList = response.json();
        this.userGroup = window.localStorage.getItem('userGroup');
        this.employeeId = window.localStorage.getItem('employeeId');
        this.employeeFullName = window.localStorage.getItem('employeeFullName');
        this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
        console.log(window.localStorage.getItem('responseImageDetails'));
      })

    // this.attendanceService.getAttendances(this.employeeId).subscribe(
    //   response =>{
    //     console.log(response.json());
    //     var result = response.json()
    //     if(result[0]){
    //       console.log("already checked in ");
    //       this.checkedIn = true;
>>>>>>> Release-2.0-Inventory
    //
    //   this.camera.getPicture(options).then((imageData) => {
    //     let loader = this.loadingCtrl.create({
    //       content:''
    //     });
    //     loader.present();
    //     let base64Image = 'data:image/jpeg;base64,' + imageData;
    //     var employeeName = this.employeeFullName+this.employeeId;
    //
    //     this.authService.detectFace(this.employeeFullName,imageData).subscribe(response=>{
    //       console.log("response in site list");
    //         console.log(response.json());
    //         var detectResponse = response.json();
    //
    //         if(detectResponse.images && detectResponse.images[0].status === 'Complete'){
    //           this.authService.verifyUser(this.employeeFullName,imageData).subscribe(response=>{
    //             console.log("Face verification response");
    //             console.log(response.json());
    //             var verificationResponse = response.json();
    //             if(verificationResponse && verificationResponse.images[0].transaction.confidence >=0.75){
    //               this.authService.markAttendance(siteId,this.employeeEmpId,this.lattitude,this.longitude,imageData).subscribe(response=>{
    //                 console.log(response.json());
    //                 loader.dismiss();
    //                 if(response && response.status === 200){
    //                   var msg='Face Verified and Attendance marked Successfully';
    //                   this.showSuccessToast(msg);
    //                 }
    //               },error=>{
    //                 var msg = 'Attendance Not Marked';
    //                 console.log(error);
    //                 this.showSuccessToast(msg);
    //                 loader.dismiss();
    //               })
    //             }else{
    //               loader.dismiss();
    //               var msg = "Unable to verify face, please try again";
    //               this.showSuccessToast(msg);
    //             }
    //           })
    //         }else{
    //           console.log("error in detecting face");
    //           loader.dismiss();
    //           var msg = "Face not Detected, please try again";
    //           this.showSuccessToast(msg);
    //         }
    //     });
    //
    //     // this.navCtrl.push(AttendanceViewPage,base64Image)
    //   }, (err) => {
    //     console.log(err);
    //   })
    // }

}