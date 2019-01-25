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
import {TabsPage} from "../tabs/tabs";
import {DBService} from "../service/dbService";
declare  var demo ;

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-offline-attendance',
    templateUrl: 'offline-attendance.html',
})
export class OfflineAttendance {

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
    showCheckIn:boolean;
    siteId:any;
    constructor(public navCtrl: NavController,private dbService:DBService,public component:componentService, public navParams: NavParams, private  authService: authService, public camera: Camera,
                private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
                private geoFence:Geofence, private employeeService: EmployeeService, private jobService: JobService, private siteService:SiteService, private attendanceService:AttendanceService) {

        this.lattitude = 0;
        this.longitude = 0;
        this.showCheckIn = true;
        this.site = this.navParams.get('site');
        console.log(this.navParams.get('employeeList'));
        // this.employeeList = this.navParams.get('employeeList');
        // this.employeeList = this.employeeList[0];
        this.siteId = this.navParams.get('siteId');
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
        console.log('ionViewDidLoad offline attendance');
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



        this.dbService.getSiteEmployee(this.siteId).then((response)=>{
                console.log(response);
                this.component.closeLoader()
                this.employeeList = response;
            },
            (error)=>{
                console.log(error);
                this.component.closeLoader()
            });

    }




    ionViewWillEnter(){
        // this.getEmployees();
        // console.log("Attendance check in data");
        // console.log(window.localStorage.getItem('attendanceCheckInData'));

        // if(window.localStorage.getItem('attendanceCheckInData')){
        //     this.showCheckIn = false;
        // }else{
        //     this.showCheckIn = true;
        // }
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
            if(attendanceMode == 'checkIn'){
                this.saveAttendanceInLocal(employee,base64Image);
            }else{
                this.saveAttendanceOutLocal(employee,base64Image,employee.attendanceId);
            }
            // this.checkProximity(this.site.id,this.lattitude,this.longitude,imageData,mode,attendanceMode,employee);
            // this.navCtrl.push(AttendanceViewPage,imageData)
        }, (err) => {
            console.log("Location error");
            this.lattitude = 0;
            this.longitude = 0;

            var msg= "Please try again...";
            this.showSuccessToast(msg);
        })
    }


    saveAttendanceInLocal(employee,imageData){
        this.component.showLoader("save attendance")
        var attendanceData = {
            siteId:employee.siteId,
            employeeEmpId:employee.empId,
            latitudeIn:this.lattitude,
            longitudeIn:this.longitude,
            checkInImage:imageData,
            checkInTime:new Date(),
            offline:true,
            id:employee.employeeId,
            offlineCheckin:true
        };

        this.dbService.setAttendance(attendanceData).then(response=>{
            console.log(response);
            this.dbService.updateEmployee(employee.employeeId,true,false).then(response=>{
                console.log(response);
                this.dbService.getSiteEmployee(this.siteId).then((response)=>{
                        console.log(response);
                        // this.component.closeLoader()
                        this.employeeList = response;
                        this.component.closeLoader()
                    },
                    (error)=>{
                        console.log(error);
                        // this.component.closeLoader()
                    });
            },err=>{
                console.log(err)
            })
        },err=>{
            console.log(err)
        })

        // window.localStorage.setItem('attendanceCheckInData',JSON.stringify(attendanceData));
        // this.navCtrl.setRoot(TabsPage);
        // demo.showSwal('feedback-success','Attendance marked locally, please connect to network to sync it to server!');

    }

    saveAttendanceOutLocal(employee,imageData,attendanceId){
        this.component.showLoader("save attendance")
        var attendanceData = {
            siteId:employee.siteId,
            employeeEmpId:employee.empId,
            latitudeIn:this.lattitude,
            longitudeIn:this.longitude,
            checkOutImage:imageData,
            checkOutTime:new Date(),
            id:employee.employeeId,
            offline:true,
            attendanceId:employee.attendanceId,
            offlineCheckOut:true
        };

        this.dbService.setAttendance(attendanceData).then(response=>{
            console.log(response);
                this.component.closeLoader()
            this.dbService.updateEmployee(employee.employeeId,true,true).then(response=>{
                console.log(response);
                this.dbService.getSiteEmployee(this.siteId).then((response)=>{
                        console.log(response);
                        // this.component.closeLoader()
                        this.employeeList = response;
                        this.component.closeLoader()
                    },
                    (error)=>{
                        console.log(error);
                        // this.component.closeLoader()
                    });
            },err=>{
                console.log(err)
            })
        },err=>{
            console.log(err)
        })

        // window.localStorage.setItem('attendanceCheckOutData',JSON.stringify(attendanceData));
        // this.navCtrl.setRoot(TabsPage);
        // this.component.showToastMessage('Your attendnace has been marked localy')
        // demo.showSwal('feedback-success','Attendance marked locally, please connect to network to sync it to server!');

    }


}
