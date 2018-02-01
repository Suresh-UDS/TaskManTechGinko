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
import {QuotationViewPage} from "../pages/quotation/quotation-view";
import {CreateQuotationPage} from "../pages/quotation/create-quotation";
import {AttendancePage} from "../pages/attendance/attendance";
import {AttendancePopoverPage} from "../pages/attendance/attendance-popover";
import {CustomerDetailPage} from "../pages/customer-detail/customer-detail";
import {ViewJobPage} from "../pages/jobs/view-job";
import {EmployeeListPage} from "../pages/employee-list/employee-list";
import {componentService} from "../pages/service/componentService";
import {RateCardPage} from "../pages/rate-card/rate-card";
import {CreateRateCardPage} from "../pages/rate-card/create-rate-card";
import {EmployeeDetailPage} from "../pages/employee-list/employee-detail";
import {SiteViewPage} from "../pages/site/site-view";
import {CreateJobPage} from "../pages/jobs/add-job";
import {IonSimpleWizard} from "../pages/ion-simple-wizard/ion-simple-wizard.component";
import {IonSimpleWizardStep} from "../pages/ion-simple-wizard/ion-simple-wizard.step.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CompleteJobPage} from "../pages/jobs/completeJob";
import {CreateQuotationPage2} from "../pages/quotation/create-quotation-step-2";
import {CreateQuotationPage3} from "../pages/quotation/create-quotation-step-3";
import {CreateEmployeePage} from "../pages/employee-list/create-employee";

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
    QuotationViewPage,
    CreateQuotationPage,
      CreateQuotationPage2,
    AttendancePage,
    AttendancePopoverPage,
    EmployeeDetailPage,
    CustomerDetailPage,
    SiteViewPage,
    ViewJobPage,
    EmployeeListPage,
    RateCardPage,
    CreateRateCardPage,
    CreateJobPage,
    CompleteJobPage,


      IonSimpleWizardStep,
      IonSimpleWizard,
    CreateQuotationPage3,
    CreateEmployeePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DatePickerModule,
    BrowserAnimationsModule,
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
    QuotationViewPage,
    CreateQuotationPage,
      CreateQuotationPage2,
    AttendancePage,
    AttendancePopoverPage,
    EmployeeDetailPage,
    CustomerDetailPage,
    SiteViewPage,
    ViewJobPage,
    EmployeeListPage,
    RateCardPage,
    CreateRateCardPage,
    CreateJobPage,
      CompleteJobPage,
      IonSimpleWizardStep,
      IonSimpleWizard,
    CreateQuotationPage3,
    CreateEmployeePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    authService,
    HttpClient,
    Geolocation,
    Geofence,
    componentService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
