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

  constructor(public events:Events, private navCtrl:NavController, private component:componentService) {
    this.DashboardTab=DashboardPage;
    this.QuotationTab=QuotationPage;
    this.CustomerDetailTab=CustomerDetailPage;
    this.EmployeeListTab=EmployeeListPage;

    // this.events.subscribe('userType',(type)=>{
    //   console.log(type);
    //   this.userType = type;
    // })
      this.userType = window.localStorage.getItem('userRole');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
      if(window.localStorage.getItem('session')){
          console.log("Session available");
          // this.component.showToastMessage('Previous Login Detected, Login automatically','bottom');
      }else{
          console.log("Session not Available");
          this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }
  }

  ionViewEnter(){

  }



}
