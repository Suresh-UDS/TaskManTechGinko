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
import {SiteListPage} from "../site-list/site-list";
import {OfflineAttendance} from "../employee/offline-attendance";
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
  isOnline:boolean;
  constructor(public events:Events, private navCtrl:NavController, private component:componentService, private network:Network, private siteService:SiteService, private attendanceService:AttendanceService) {
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

    // this.events.subscribe('userType',(type)=>{
    //   console.log(type);
    //   this.userType = type;
    // })
      this.userType = window.localStorage.getItem('userRole');
      console.log("Sites from localstorgage");
      console.log(JSON.parse(window.localStorage.getItem('projectSites')));
      console.log(JSON.parse(window.localStorage.getItem('offlineAttendanceData')));
      if(JSON.parse(window.localStorage.getItem('projectSites')) && JSON.parse(window.localStorage.getItem('projectSites')).length>0){
          this.sites=JSON.parse(window.localStorage.getItem('projectSites'));
      }

      if(JSON.parse(window.localStorage.getItem('offlineAttendanceData')) && JSON.parse(window.localStorage.getItem('offlineAttendanceData')).length>0){
          this.offlineEmployeeList=JSON.parse(window.localStorage.getItem('offlineAttendanceData'));
      }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
    console.log(this.network.type);
      if(window.localStorage.getItem('session')){
          console.log("Session available");
          if(this.network.type == 'none'){
              this.navCtrl.push(SiteListPage,{sites:this.sites})
              console.log("Network not available");
              if(this.offlineEmployeeList && this.offlineEmployeeList.length>0){
                  this.navCtrl.setRoot(OfflineAttendance,{employeeList:this.offlineEmployeeList})
              }else{
                  demo.showSwal('feedback-warning','No Information found locally, please sync your device online to enable offline attendance..');

                  console.log("No employee information available");
              }
          }else{
              this.loadSiteAttendance();
              this.markOfflineAttendance();
          }
          // this.component.showToastMessage('Previous Login Detected, Login automatically','bottom');
      }else{
          console.log("Session not Available");
          this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }
  }

  ionViewEnter(){


  }

  loadSiteAttendance(){
      window.localStorage.removeItem('offlineAttendanceData');
      for(var i of this.sites){
          console.log(i);
          this.siteService.searchSiteEmployee(i.siteId).subscribe(
              response=>{
                  console.log("Attendance data in tabs page");
                  console.log(response.json());
                  this.offlineAttendanceData.push(response.json());
                  window.localStorage.setItem('offlineAttendanceData',JSON.stringify(this.offlineAttendanceData));
              }
          )
      }
      console.log(this.offlineAttendanceData);
  }

  markOfflineAttendance(){
    if(window.localStorage.getItem('attendanceCheckInData')){
        console.log("unsynced checkin information available in local storage");
        var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckInData'));
        this.attendanceService.markAttendanceCheckIn(offlineData.siteId,offlineData.empId,offlineData.lat,offlineData.lng,offlineData.imageData).subscribe(
            response=>{
                console.log("Offline attendance data synced to server");
                console.log("Clearing local storage");
                window.localStorage.removeItem('attendanceCheckInData');
                if(window.localStorage.getItem('attendanceCheckOutData')){
                    console.log("unsynced checkout information available in local storage");
                    var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
                    this.attendanceService.markAttendanceCheckOut(offlineData.siteId,offlineData.empId,offlineData.lat,offlineData.lng,offlineData.imageData,response.id).subscribe(
                        response=>{
                            console.log("Offline attendance data synced to server");
                            console.log("Clearing local storage");
                            window.localStorage.removeItem('attendanceCheckOutData');
                        },error2 => {
                            console.log("Error in syncing attendance to server");
                        }
                    )
                }
            },error2 => {
                console.log("Error in syncing attendance to server");
            }
        )

    }else if(window.localStorage.getItem('attendanceCheckOutData')){
        console.log("unsynced checkout information available in local storage");
        var offlineData = JSON.parse(window.localStorage.getItem('attendanceCheckOutData'));
        this.attendanceService.markAttendanceCheckOut(offlineData.siteId,offlineData.empId,offlineData.lat,offlineData.lng,offlineData.imageData,offlineData.id).subscribe(
            response=>{
                console.log("Offline attendance data synced to server");
                console.log("Clearing local storage");
                window.localStorage.removeItem('attendanceCheckOutData');
            },error2 => {
                console.log("Error in syncing attendance to server");
            }
        )
    }
  }



}
