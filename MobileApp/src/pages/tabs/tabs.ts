import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DashboardPage} from "../dashboard/dashboard";
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {ReportsPage} from "../reports/reports";
import {QuotationPage} from "../quotation/quotation";
import {AttendancePage} from "../attendance/attendance";
import {CustomerDetailPage} from "../customer-detail/customer-detail";
import {EmployeeDetailPage} from "../employee-detail/employee-detail";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  DashboardTab:any;
  QuotationTab:any;
  CustomerDetailTab:any;
  EmployeeDetailTab:any;

  constructor() {
    this.DashboardTab=DashboardPage;
    this.QuotationTab=QuotationPage;
    this.CustomerDetailTab=CustomerDetailPage;
    this.EmployeeDetailTab=EmployeeDetailPage;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }



}
