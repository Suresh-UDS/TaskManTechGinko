import { Component } from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {DashboardPage} from "../dashboard/dashboard";
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {ReportsPage} from "../reports/reports";
import {QuotationPage} from "../quotation/quotation";
import {AttendancePage} from "../attendance/attendance";
import {CustomerDetailPage} from "../customer-detail/customer-detail";
import {EmployeeDetailPage} from "../employee-list/employee-detail";
import {EmployeeListPage} from "../employee-list/employee-list";
import {LoginPage} from "../login/login";
import {componentService} from "../service/componentService";
import {Network} from "@ionic-native/network";
import {SiteService} from "../service/siteService";
import {AttendanceService} from "../service/attendanceService";
import {OfflineAttendance} from "../employee/offline-attendance";
import {SQLite,SQLiteObject} from "@ionic-native/sqlite";
import {authService} from "../service/authService";
import {AppVersion} from "@ionic-native/app-version";
import {Market} from "@ionic-native/market";
import {Platform} from "ionic-angular";
import {SplashLogo} from "../splash-logo/splash-logo";
import {UpdateApp} from "../update-app/update-app";
import {OfflineAttendanceSites} from "../employee/offline-attendance-sites";
import {AlertController} from "ionic-angular";
import {DBService} from "../service/dbService";
import {OfflinePage} from "../offline-page/offline-page";

declare  var demo ;

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  DashboardTab:any;
  QuotationTab:any;
  CustomerDetailTab:any;
  EmployeeListTab:any;
  userType:any;
  sites:any;
  offlineAttendanceData:any;
  offlineEmployeeList:any;
  appVersionNumber:any;
  isOnline:boolean;
  appPackageName:any;
  constructor(public events:Events, private navCtrl:NavController, private component:componentService, private network:Network, private siteService:SiteService, private attendanceService:AttendanceService, private sqlite:SQLite, private authService:authService, private appVersion:AppVersion, private market:Market, private platform:Platform, private alertController:AlertController, private dbService:DBService) {
    this.DashboardTab=DashboardPage;
    this.QuotationTab=QuotationPage;
    this.CustomerDetailTab=CustomerDetailPage;
    this.EmployeeListTab=EmployeeListPage;
    this.sites = [];
    this.offlineAttendanceData = [];
    this.events.subscribe('isOnline',(data)=>{
        console.log("Is Online event");
        console.log(data);
        if(data =='no'){
            this.isOnline = false;
        }else{
            this.isOnline=true;
        }
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');

    this.appVersion.getPackageName().then(response=>{
        this.appPackageName=response;
    });

    this.appVersion.getVersionNumber().then(response=>{
        this.appVersionNumber = response;
    });

    this.authService.getCurrentVersion('Android').subscribe(
        response=>{
            var currentVersion = response.json()[0];
            console.log(currentVersion.applicationVersion);
            console.log(this.appVersionNumber);
            if(this.appVersionNumber && this.appVersionNumber != currentVersion.applicationVersion ){
                console.log("Application needs to be updated");
                this.navCtrl.push(UpdateApp);

            }else{
                console.log("Application up to date");

                // this.market.open(this.appPackageName);
                // this.platform.exitApp();
            }
        }
    );
    console.log(this.network.type);
    var session = window.localStorage.getItem('session');
      if(window.localStorage.getItem('session')){
          console.log("Session available");

          // this.createLocalDB();
          // this.component.showToastMessage('Previous Login Detected, Login automatically','bottom');
      }else{
          console.log("Session not Available");
          this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }

  }

  ionViewWillEnter(){
    console.log("Check Network Connection");
      if(this.network.type!='none'){

      }else{
          this.navCtrl.setRoot(OfflinePage);
      }

  }

  createLocalDB(){
      this.siteService.searchSite().subscribe(response=>{
          var siteList = response.json();
          this.callSqlLite(siteList)
      })
  }

    callSqlLite(siteList)
    {
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {

                db.executeSql('DROP TABLE assetList',[])

                db.executeSql('create table IF NOT EXISTS assetList(id INT,name VARCHAR(32))', [])
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));


                for (var i = 0; i < siteList.length; i++) {
                    var query = "INSERT INTO assetList (id,name) VALUES (?,?)";

                    db.executeSql(query, [siteList[i].id, siteList[i].name])
                        .then(() => console.log('Executed SQL'))
                        .catch(e => console.log(e));
                }

            })

    }


  loadSiteAttendance(){
      window.localStorage.removeItem('offlineAttendanceData');
      for(var i of this.sites){
          console.log(i);
          var searchCriteria = {
              currPage:1,
              pageSort: 15,
              siteId:i.siteId
          };
          // this.siteService.searchSiteEmployee(i.siteId).subscribe(
          this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(
              response=>{
                  console.log("Attendance data in tabs page");
                  console.log(response.transactions);
                  this.offlineAttendanceData.push(response.transactions);
                  window.localStorage.setItem('offlineAttendanceData',JSON.stringify(this.offlineAttendanceData));
              }
          )
      }
      console.log(this.offlineAttendanceData);
  }


    // if(window.localStorage.getItem('attendanceCheckInData')){
    //     console.log("unsynced checkin information available in local storage");
    //     var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckInData'));
    //
    //     this.dbService.getAttendance().then(response=>{
    //         console.log(response);
    //         // this.componentService.closeLoader()
    //         var data = []
    //         data.push(response)
    //         for(var i=0;i<data.length;i++) {
    //             console.log("==================")
    //             console.log(data[i])
    //             this.attendanceService.markAttendanceCheckIn(data[i].siteId, data[i].employeeEmpId, data[i].latitudeIn, data[i].longitudeIn, data[i].checkInImage).subscribe(
    //                 response => {
    //                     console.log("Offline attendance data synced to server");
    //                     console.log("Clearing local storage");
    //                     window.localStorage.removeItem('attendanceCheckInData');
    //                     if (window.localStorage.getItem('attendanceCheckOutData')) {
    //                         console.log("unsynced checkout information available in local storage");
    //                         var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
    //                         this.attendanceService.markAttendanceCheckOut(data[i].siteId, data[i].employeeEmpId, data[i].latitudeIn, data[i].longitudeIn, data[i].checkInImage, response.id).subscribe(
    //                             response => {
    //                                 console.log("Offline attendance data synced to server");
    //                                 console.log("Clearing local storage");
    //                                 window.localStorage.removeItem('attendanceCheckOutData');
    //                             }, error2 => {
    //                                 console.log("Error in syncing attendance to server");
    //                             }
    //                         )
    //                     }
    //                 }, error2 => {
    //                     console.log("Error in syncing attendance to server");
    //                 }
    //             )
    //         }
    //     },err=>{
    //         console.log(err)
    //     })
    //
    //
    //
    //
    //
    //
    // }else if(window.localStorage.getItem('attendanceCheckOutData')){
    //     console.log("unsynced checkout information available in local storage");
    //     var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
    //     this.attendanceService.markAttendanceCheckOut(offlineData.siteId,offlineData.empId,offlineData.lat,offlineData.lng,offlineData.imageData,offlineData.id).subscribe(
    //         response=>{
    //             console.log("Offline attendance data synced to server");
    //             console.log("Clearing local storage");
    //             window.localStorage.removeItem('attendanceCheckOutData');
    //         },error2 => {
    //             console.log("Error in syncing attendance to server");
    //         }
    //     )
    // }
  // }




}
