import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from "@angular/http";
import {HttpClient} from "../pages/Interceptor/HttpClient";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AttendanceViewPage} from "../pages/attendance-view/attendance-view";
import {LoginPage} from "../pages/login/login";
import {SiteListPage} from "../pages/site-list/site-list";
import {AttendanceListPage} from "../pages/attendance-list/attendance-list";
import {EmployeeList} from "../pages/employee/employee-list";
import {authService} from "../pages/service/authService";
import {IonicStorageModule} from "@ionic/storage";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {EmployeeSiteListPage} from "../pages/site-employeeList/site-employeeList";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {TabsPage} from "../pages/tabs/tabs";
import {SitePage} from "../pages/site/site";
import {JobsPage} from "../pages/jobs/jobs";
import {ReportsPage} from "../pages/reports/reports";
import {LogoutPage} from "../pages/logout/logout";
import {DatePickerModule} from "ionic2-date-picker";
import {Calendar} from "@ionic-native/calendar";
import {QuotationPage} from "../pages/quotation/quotation";
import {QuotationPopoverPage} from "../pages/quotation/quotation-popover";
import {AttendancePage} from "../pages/attendance/attendance";
import {AttendancePopoverPage} from "../pages/attendance/attendance-popover";
import {EmployeeDetailPage} from "../pages/employee-detail/employee-detail";
import {CustomerDetailPage} from "../pages/customer-detail/customer-detail";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SiteListPage,
    AttendanceListPage,
    AttendanceViewPage,
    EmployeeList,
    EmployeeSiteListPage,
    DashboardPage,
    TabsPage,
    SitePage,
    JobsPage,
    ReportsPage,
    LogoutPage,
    QuotationPage,
    QuotationPopoverPage,
    AttendancePage,
    AttendancePopoverPage,
    EmployeeDetailPage,
    CustomerDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DatePickerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SiteListPage,
    AttendanceListPage,
    AttendanceViewPage,
    EmployeeList,
    EmployeeSiteListPage,
    DashboardPage,
    TabsPage,
    SitePage,
    JobsPage,
    ReportsPage,
    LogoutPage,
    QuotationPage,
    QuotationPopoverPage,
    AttendancePage,
    AttendancePopoverPage,
    EmployeeDetailPage,
    CustomerDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    authService,
    HttpClient,
    Geolocation,
    Geofence,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
