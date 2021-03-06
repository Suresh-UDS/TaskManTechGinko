import { Component, ViewChild } from '@angular/core';
import {Events, Nav, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {BatteryStatus, BatteryStatusResponse} from "@ionic-native/battery-status";
import { BackgroundMode } from '@ionic-native/background-mode';
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
import {FeedbackPage} from "../pages/feedback/feedback";
import {InitFeedbackPage} from "../pages/feedback/init-feedback";
import {AppVersion} from "@ionic-native/app-version";

import{OneSignal} from "@ionic-native/onesignal";
import {componentService} from "../pages/service/componentService";
import {Ticket} from "../pages/ticket/ticket";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  userName:any;
  userType :any;
    counter=0;
  pages: Array<{title: string, component: any,active:any,icon:any,permission:any}>;

  constructor(public platform: Platform,private backgroundMode: BackgroundMode, public statusBar: StatusBar,public component:componentService,public toastCtrl: ToastController, public splashScreen: SplashScreen, private oneSignal: OneSignal, public events:Events, private batteryStatus: BatteryStatus, private appVersion:AppVersion) {
    this.initializeApp();
      this.backgroundMode.enable();
      let subscription = this.batteryStatus.onChange().subscribe(
          (status:BatteryStatusResponse)=>{
              console.log("Battery level");
              console.log(status.level,status.isPlugged);
          }
      );
      platform.registerBackButtonAction(() => {
          let view = this.nav.getActive();
          console.log("Back button event");
          console.log(view);
          console.log(this.nav.canGoBack());
          if(this.nav.canGoBack())
          {
                this.nav.pop();
          }
          else if (this.counter == 0) {
              this.counter++;
              this.component.showToastMessage('Press again to exit','center');
              setTimeout(() => { this.counter = 0 }, 3000)
          } else {
              // console.log("exitapp");
              platform.exitApp();
          }
      }, 0);
      this.events.subscribe('userType',(type)=>{
          console.log("User type event");
          console.log(type);
          this.userType = type;
      });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: TabsPage,active:true,icon:'dashboard',permission:'Dashboard'},
      { title: 'Site', component: SitePage,active:false,icon:'dns',permission:'SiteList'},
      // { title: 'Client', component: CustomerDetailPage,active:false,icon:'person'},
      { title: 'Employee', component: EmployeeListPage,active:false,icon:'people',permission:'EmployeeList'},
      { title: 'Jobs', component: JobsPage,active:false,icon:'description',permission:'JobsList'},
      { title: 'Tickets', component: Ticket,active:false,icon:'description',permission:'TicketsList'},
        { title: 'Attendance', component: SiteListPage,active:false,icon:'content_paste',permission:'AttendanceList'},
        { title: 'Rate Card', component: RateCardPage,active:false,icon:'description',permission:'RateCardList'},
      { title: 'Quotation', component: QuotationPage,active:false,icon:'receipt',permission:'QuotationList'},
       { title: 'Feedback', component: InitFeedbackPage,active:false,icon:'feedback',permission:'FeedbackList'},
      // { title: 'Reports', component: ReportsPage,active:false,icon:'trending_up'},
      // { title: 'Logout', component: LogoutPage,active:false,icon:'power_settings_new'}
    ];

    console.log("Employee Name");
    console.log(window.localStorage.getItem('employeeFullName'));
    this.userName = window.localStorage.getItem('employeeFullName');

    this.events.subscribe('permissions:set',(permission)=>{
        console.log("Event permission in component");
        console.log(permission);
    })
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        console.log("Version details");
        console.log("current version"+"0.4.0");
        console.log(this.appVersion.getAppName());
        console.log(this.appVersion.getPackageName());
        console.log(this.appVersion.getVersionCode());
        console.log(this.appVersion.getVersionNumber());
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     // this.statusBar.overlaysWebView(true);
     // this.statusBar.backgroundColorByHexString("#25312C");

        this.oneSignal.startInit('647127c6-f890-4aad-b4e2-52379805f26c','1015991031299');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(response =>{
            console.log(response);
        })

        this.oneSignal.handleNotificationOpened().subscribe(response=>{
            console.log(response);
        })

        this.oneSignal.endInit();
    });
  }



  logout(){
    this.nav.setRoot(LoginPage);
    window.localStorage.clear();
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

  gotoDashboard(){
      this.nav.setRoot(TabsPage);
  }

}
