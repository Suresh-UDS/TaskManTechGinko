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
import {Diagnostic} from "@ionic-native/diagnostic";
import {LocationAccuracy} from "@ionic-native/location-accuracy";
import {LocationProvider} from "../../providers/location-provider";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

declare  var demo ;


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
    isLoading:boolean;
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
    page:1;
    totalPages:0;
    pageSort:15;
    count=0;

    fakeEmployeeList: Array<any> = new Array(12);
    constructor(public navCtrl: NavController,public component:componentService, public navParams: NavParams, private  authService: authService, public camera: Camera,
                private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,private locationAccuracy:LocationAccuracy,
                private geoFence:Geofence, private employeeService: EmployeeService, private jobService: JobService, private siteService:SiteService, private attendanceService:AttendanceService,
                private diagonistic:Diagnostic, public locationProvider: LocationProvider,public backgroundGeolocation: BackgroundGeolocation) {

        this.lattitude = 0;
        this.longitude = 0;

        this.site = this.navParams.get('site');

    }

    viewList(i)
    {
        this.navCtrl.push(AttendanceListPage);
    }


    getAttendances(site){
        this.attendanceService.getSiteAttendances(site.id).subscribe(response=>{
            console.log(response.json());
            this.navCtrl.push(AttendanceListPage,{'attendances':response.json()});
        })
    }

    getLocation(){
        console.log("Location on enter");
        console.log(this.locationProvider.lat);
        console.log(this.locationProvider.lng);

        this.locationProvider.startTracking().subscribe(response=>{
            console.log(response);
        });
    }

    stop(){
        this.locationProvider.stopTracking();
    }

    ionViewDidLoad() {

        console.log("Location on enter");
        console.log(this.locationProvider.lat);
        console.log(this.locationProvider.lng);

        console.log('ionViewDidLoad SiteListPage');
        var options={
            timeout:3000
        };
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

    getEmployeeAttendance(empId){

        this.navCtrl.push(AttendanceListPage,{siteId:this.site.id,empId:empId});
    }


    ionViewWillEnter(){

        console.log("Attendnace page location availability");
        this.diagonistic.getLocationMode().then((isAvailable)=>{
            console.log(isAvailable);
            if(isAvailable == 'location_off'){
                this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                    if (canRequest) {
                        // the accuracy option will be ignored by iOS
                        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                            () => console.log('Request successful'),
                            error => {console.log('Error requesting location permissions', error);
                                demo.showSwal('warning-message-and-confirmation-ok','GPS Not available','Please turn GPS on');
                                this.navCtrl.pop();
                            }
                        );
                    }
                });
            }else{
                this.component.showToastMessage('GPS Available','bottom');
                this.getEmployees();

            }
        }).catch((e)=>{
            demo.showSwal('warning-message-and-confirmation-ok','GPS Not available','Please turn GPS on');
            this.navCtrl.pop();
        });

    }

    isEmployeeCheckedIn(employeeId){
        this.attendanceService.getAttendances(employeeId,this.site.id).subscribe(
            response =>{
                console.log(response.json());
                var result = response.json();
                if(result[0]){
                    console.log("already checked in ");
                    console.log(result[0].notCheckedOut);
                    if(result[0].notCheckedOut){
                        console.log("Not checked out true");
                        this.checkedIn = false;
                    }else{
                        console.log("Not checked out false");

                        this.checkedIn = true;

                    }

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
            this.component.showLoader("Getting Face..")
            this.checkProximity(this.site.id,base64Image,mode,attendanceMode,employee);
            // this.enrollFace(employee,base64Image);
            // this.navCtrl.push(AttendanceViewPage,imageData)
        }, (err) => {
            console.log("Location error");
            this.lattitude = 0;
            this.longitude = 0;

            var msg= "Please try again...";
            this.component.showToastMessage(msg,'bottom');
        })
    }

    enrollFace(employee,imageData){
        var employeeName = employee.fullName+employee.empId;
        employee.enrolled_face = imageData;
        this.employeeService.enrollFace(employee).subscribe(
            response=>{
                console.log("Enroll face result");
                console.log(response);
            }
        )
    }

    checkProximity(siteId,imageData,mode,attendanceMode,employee){

        // this.component.showLoader('Getting Location..');
        this.component.closeAll();
        this.component.showLoader("Getting Locations...");

        // demo.showSwal('success-message-and-ok','Success','Checking Site Proximity');

        this.locationProvider.startTracking();

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: false,
            // interval: 2000
        };

        this.backgroundGeolocation.configure(config).subscribe((response) => {

            this.component.closeAll();
            this.component.showLoader("Verifying Location...");
            console.log("Response from background geo location");
            console.log(response);

            console.log(response.latitude);
            console.log(response.longitude);
            if(response.latitude && response.longitude){
                console.log("if condition verified");

                if(response.latitude && response.longitude>0){
                    this.locationProvider.stopTracking();
                    this.attendanceService.checkSiteProximity(siteId,response.latitude,response.longitude).subscribe(
                        response=> {
                            this.component.closeAll();
                            this.locationProvider.stopTracking();
                            this.verifyFaceAndMarkAttendance(employee,mode,response.latitude,response.longitude,attendanceMode,imageData);
                            // demo.showSwal('success-message-and-ok','Success','Face Enrolled Successfully');

                        },error=>{
                            console.log("errors");
                            this.component.closeAll();
                            this.locationProvider.stopTracking();
                            demo.showSwal('warning-message-and-confirmation-ok',"Location Error", "Please check-in/out from site location   ");
                            // this.verifyFaceAndMarkAttendance(employee,mode,response.latitude,response.longitude,attendanceMode,imageData);


                        })
                }else{
                    this.component.closeAll();
                    console.log("error in getting current location");
                    demo.showSwal('warning-message-and-confirmation-ok',"Location Error", "Error in getting location..");
                    // this.verifyFaceAndMarkAttendance(employee,mode,attendanceMode,imageData);
                    console.log(response);

                }

            }

            // this.locationProvider.stopTracking();



        },err=>{
            // demo.showSwal('warning-message-and-confirmation-ok','Failure','Error in getting background location');
            this.component.closeAll();
            console.log("Error from background geo location");
            console.log(err);
        });


    }

    verifyFaceAndMarkAttendance(employee,mode,lat,lng,attendanceMode,imageData){
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        var employeeName = employee.fullName+employee.empId;
        // this.component.showLoader('Detecting Face');
        if(mode === 'enroll'){
            this.component.closeAll();
            this.component.showLoader('Enrolling Face Id');
            employee.enrolled_face = imageData;
            this.employeeService.enrollFace(employee).subscribe(response=>{
                this.component.closeAll();
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    var verificationResponse = response;
                    console.log(verificationResponse);
                    // this.component.showToastMessage('Face Enrolled successfully..','bottom');
                    demo.showSwal('success-message-and-ok','Success','Face Enrolled Successfully');

                }

            },error=>{
                this.component.closeAll();
                var msg='Error in Detecting Face..';
                this.component.showLoader(msg);
                console.log("Error");
                console.log(error)
            })

        }else{
            this.component.closeAll();
            if(attendanceMode == 'checkIn'){

                this.markAttendance(employee,lat,lng,imageData);

            }else{
                this.markAttendanceCheckOut(employee,lat,lng,imageData);
            }

        }


    }

    markAttendance(employee,lat,lng,imageData){
        this.component.showLoader("Marking Attendance...");
        this.attendanceService.markAttendanceCheckIn(this.site.id,employee.empId,lat,lng,imageData).subscribe(response=>{
            this.component.closeAll();
            this.getEmployees();
            if(response.errorStatus){
                var msg='Face Verified and Attendance marked Successfully';
                demo.showSwal('warning-message-and-confirmation-ok','Error in Marking Attendance',response.errorMessage);
            }else{
                this.getEmployees();
                demo.showSwal('success-message-and-ok','Success','Face Verified and Attendance marked Successfully');

            }
        },error=>{
            this.component.closeAll();
            var msg = 'Attendance Not Marked';
            demo.showSwal('warning-message-and-confirmation-ok','Error in Marking Attendance',msg);
            console.log(error);

        })
    }

    markAttendanceCheckOut(employee,lat,lng,imageData){
        this.component.showLoader("Marking Attendance...");
        this.attendanceService.markAttendanceCheckOut(this.site.id,employee.empId,lat,lng,imageData,employee.attendanceId).subscribe(response=>{
            this.component.closeAll();
            this.getEmployees();
            if(response.errorStatus){
                var msg='Face Verified and Attendance marked Successfully';
                demo.showSwal('warning-message-and-confirmation-ok','Error in Marking Attendance',response.errorMessage);
            }else{
                this.getEmployees();
                demo.showSwal('success-message-and-ok','Success','Face Verified and Attendance marked Successfully');

            }
        },error=>{
            this.component.closeAll();
            var msg = 'Attendance Not Marked';
            demo.showSwal('warning-message-and-confirmation-ok','Error in Marking Attendance',msg);
            console.log(error);
        })
    }

    getEmployees(){
        this.isLoading=true;
        var searchCriteria = {
            currPage:this.page,
            pageSort: this.pageSort,
            siteId:this.site.id
        };
        this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(response=>{
            this.isLoading=false;
            this.employeeList = response.transactions;
            this.page = response.currPage;
            this.totalPages = response.totalPages;
            this.userGroup = window.localStorage.getItem('userGroup');
            this.employeeId = window.localStorage.getItem('employeeId');
            this.employeeFullName = window.localStorage.getItem('employeeFullName');
            this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
        })
    }

    doInfinite(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria ={
            currPage:this.page+1,
            siteId:this.site.id
        };
        if(this.page>this.totalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('All Employees Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(()=>{
                this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad Employee list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.employeeList.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.component.closeAll();
                    },
                    error=>{
                        console.log('ionViewDidLoad Employee Page:'+error);
                    }
                )

                infiniteScroll.complete();
            },1000);
        }


    }

    enrollAllFaces(){
        this.employeeService.enrollAllFaces().subscribe(
            response=>{
                console.log(response);
                this.component.closeAll();
            }
        )
    }


}
