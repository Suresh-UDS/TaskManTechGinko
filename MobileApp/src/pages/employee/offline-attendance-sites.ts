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
import {DBService} from "../service/dbService";
import {OfflineAttendance} from "./offline-attendance";
import {DatabaseProvider} from "../../providers/database-provider";

/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'offline-attendance-sites',
    templateUrl: 'offline-attendance-sites.html',
})
export class OfflineAttendanceSites {

    siteList:any;
    userGroup:any;
    employeeId:any;
    employeeFullName: any;
    employeeEmpId:any;
    lattitude:any;
    longitude:any;
    checkedIn:any;
    constructor(public navCtrl: NavController,public component:componentService, public navParams: NavParams,
                private  authService: authService, public camera: Camera,
                private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
                private attendanceService: AttendanceService, private siteService: SiteService,
                private dbService:DBService,private databaseProvider: DatabaseProvider) {

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
    //
    // viewList(i)
    // {
    //     this.navCtrl.push(AttendanceListPage);
    // }

    showSuccessToast(msg){
        this.component.showToastMessage(msg,'bottom');
    }

    // getAttendances(site){
    //     // this.attendanceService.getSiteAttendances(site.id).subscribe(response=>{
    //     //     console.log(response.json());
    //     //     this.navCtrl.push(AttendanceListPage,{'attendances':response.json()});
    //     // })
    //
    //     this.dbService.getSiteEmployee(site.id).then((response)=>{
    //         console.log(response);
    //     });
    // }

    ionViewDidLoad() {
        this.component.showLoader("Load Sites")
        console.log('ionViewDidLoad offline SiteListPage');
        // this.dbService.getSite().then(data=>{
        this.databaseProvider.getSiteData().then(data=>{
            console.log("Loading site list from sqLite");
            this.component.closeLoader()
            console.log(data);
            this.siteList = data;
        },err=>{
            console.log("Error in loading data from Sqlite");
            this.component.closeLoader()
            console.log(err);
        })
    }

    ionViewWillEnter(){

        // this.dbService.getSite().then(data=>{
        //     console.log(data);
        // })
        this.siteList;
        // this.siteService.searchSite().subscribe(response=>{
        //     console.log(response.json());
        //     this.siteList = response.json();
        //     this.userGroup = window.localStorage.getItem('userGroup');
        //     this.employeeId = window.localStorage.getItem('employeeId');
        //     this.employeeFullName = window.localStorage.getItem('employeeFullName');
        //     this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
        //     console.log(window.localStorage.getItem('responseImageDetails'));
        // })
    }

    gotoEmployeeList(site){
        this.component.showLoader("");

        this.navCtrl.push(OfflineAttendance,{siteId:site.id})


    }
}
