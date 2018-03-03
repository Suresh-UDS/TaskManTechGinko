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
import {ApprovedQuotationPage} from "../pages/quotation/approvedQuotations";
import {DraftedQuotationPage} from "../pages/quotation/draftedQuotations";
import {SubmittedQuotationPage} from "../pages/quotation/submittedQuotations";
import {ArchivedQuotationPage} from "../pages/quotation/archivedQuotations";
import {ViewQuotationPage} from "../pages/quotation/viewQuotation";
import {FeedbackPage} from "../pages/feedback/feedback";
import {FeedbackQuestionPage} from "../pages/feedback/feedback-questions";



import {CreateEmployeePage} from "../pages/employee-list/create-employee";
import {OneSignal} from "@ionic-native/onesignal";
// import {GoogleMaps} from "@ionic-native/google-maps";
import {Toast} from "@ionic-native/toast";
import {AppConfig, MY_CONFIG_TOKEN} from "../pages/service/app-config";
import {AttendanceService} from "../pages/service/attendanceService";
import {EmployeeService} from "../pages/service/employeeService";
import {JobService} from "../pages/service/jobService";
import {QuotationService} from "../pages/service/quotationService";
import {SiteService} from "../pages/service/siteService";
import {JobPopoverPage} from "../pages/jobs/job-popover";


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
      ApprovedQuotationPage,
      DraftedQuotationPage,
      SubmittedQuotationPage,
      ArchivedQuotationPage,
      ViewQuotationPage,
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
    CreateEmployeePage,
    FeedbackPage,
    JobPopoverPage,
    FeedbackQuestionPage
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
      ApprovedQuotationPage,
      DraftedQuotationPage,
      SubmittedQuotationPage,
      ArchivedQuotationPage,
      ViewQuotationPage,
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
    CreateEmployeePage,
    FeedbackPage,
    FeedbackQuestionPage,
    JobPopoverPage


  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
      AttendanceService,
      EmployeeService,
      JobService,
      QuotationService,
      SiteService,
    authService,
    HttpClient,
    Geolocation,
    Geofence,
      // GoogleMaps,
      Toast,
      OneSignal,
    componentService,
      OneSignal,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide:MY_CONFIG_TOKEN, useValue: AppConfig}
  ]
})
export class AppModule {}
