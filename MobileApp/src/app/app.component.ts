import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from "../pages/login/login";
import {SiteListPage} from "../pages/site-list/site-list";
import {AttendanceListPage} from "../pages/attendance-list/attendance-list";
import {AttendanceViewPage} from "../pages/attendance-view/attendance-view";
import {EmployeeList} from "../pages/employee/employee-list";
import {SitePage} from "../pages/site/site";
import {JobsPage} from "../pages/jobs/jobs";
import {ReportsPage} from "../pages/reports/reports";
import {LogoutPage} from "../pages/logout/logout";
import {AttendancePage} from "../pages/attendance/attendance";
import {TabsPage} from "../pages/tabs/tabs";
import {QuotationPage} from "../pages/quotation/quotation";
import {CustomerDetailPage} from "../pages/customer-detail/customer-detail";
import {EmployeeListPage} from "../pages/employee-list/employee-list";
import {RateCardPage} from "../pages/rate-card/rate-card";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any,active:any,icon:any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: TabsPage,active:true,icon:'dashboard'},
      { title: 'Quotation', component: QuotationPage,active:false,icon:'receipt'},
      { title: 'Site', component: SitePage,active:false,icon:'dns'},
      { title: 'Client', component: CustomerDetailPage,active:false,icon:'person'},
      { title: 'Employee', component: EmployeeListPage,active:false,icon:'people'},
      { title: 'Jobs', component: JobsPage,active:false,icon:'description'},
      { title: 'Rate Card', component: RateCardPage,active:false,icon:'description'},
      { title: 'Attendance', component: AttendancePage,active:false,icon:'content_paste'},
      { title: 'Reports', component: ReportsPage,active:false,icon:'trending_up'},
      { title: 'Logout', component: LogoutPage,active:false,icon:'power_settings_new'}
    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     // this.statusBar.overlaysWebView(true);
     // this.statusBar.backgroundColorByHexString("#25312C");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    for(let i=0;i<this.pages.length;i++)
    {
      if(this.pages[i].component==page.component)
      {
        this.pages[i].active=true;
      }
      else {
        this.pages[i].active=false;
      }
    }
  }
}
