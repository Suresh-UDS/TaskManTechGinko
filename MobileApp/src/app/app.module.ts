import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {FabContainer, IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
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
import {InitFeedbackPage} from "../pages/feedback/init-feedback";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
<<<<<<< HEAD
import{TicketFilter} from "../pages/ticket/ticket-filter/ticket-filter";

import {SQLitePorter} from "@ionic-native/sqlite-porter";

=======
import {ForgotPassword} from "../pages/forgot-password/forgot-password";
import { Network } from '@ionic-native/network';
>>>>>>> Release-1.0
import {CreateEmployeePage} from "../pages/employee-list/create-employee";
import {OneSignal} from "@ionic-native/onesignal";
// import {GoogleMaps} from "@ionic-native/google-maps";
import {Toast} from "@ionic-native/toast";
import {AppConfig, MY_CONFIG_TOKEN} from "../pages/service/app-config";
import {AttendanceService} from "../pages/service/attendanceService";
import {EmployeeService} from "../pages/service/employeeService";
import {FeedbackService} from "../pages/service/feedbackService";
import {JobService} from "../pages/service/jobService";
import {QuotationService} from "../pages/service/quotationService";
import {SiteService} from "../pages/service/siteService";
import {AssetService} from "../pages/service/assetService";
import {JobPopoverPage} from "../pages/jobs/job-popover";
import {BatteryStatus, BatteryStatusResponse} from "@ionic-native/battery-status";
import {FeedbackDashboardPage} from "../pages/feedback/feedback-dashboard";
import {QuotationImagePopoverPage} from "../pages/quotation/quotation-image-popover";
import { BackgroundMode } from '@ionic-native/background-mode';
import { NativeAudio } from '@ionic-native/native-audio';
import {SelectFeedbackPage} from "../pages/feedback/select-feedback";
import {FeedbackZone} from "../pages/feedback/feedbackZone";
<<<<<<< HEAD
import {Splash} from "../pages/splash/splash";
import {SplashLogo} from "../pages/splash-logo/splash-logo";
=======
>>>>>>> Release-1.0
import {InitFeedbackZone} from "../pages/feedback/init-feedback-zone";
import {WizardFeedbackEntry} from "../pages/feedback/wizard-feedback-entry";
import {FeedbackQuestionsForm} from "../pages/feedback/feedback-questions-form";
import {Ticket} from "../pages/ticket/ticket";
import {CreateTicket} from "../pages/ticket/create-ticket";
import {ViewTicket} from "../pages/ticket/view-ticket";
import {FeedbackGridPage} from "../pages/feedback/feedback-grid";
import {AppVersion} from "@ionic-native/app-version";
import {HasPermission} from "../components/has-permission/has-permission";
<<<<<<< HEAD
import {AssetList} from "../pages/asset-list/asset-list";
import {AssetFilter} from "../pages/asset-list/asset-filter";
import {AssetView} from "../pages/asset-view/asset-view";
import {QRScanner} from "@ionic-native/qr-scanner";
import {ScanQR} from "../pages/asset-list/scanQR";
import {IonicImageViewerModule} from "ionic-img-viewer";
import {DatePicker} from "@ionic-native/date-picker";
import{GetAssetReading} from "../pages/asset-view/get-asset-reading";
import{GetAssetReadings} from "../pages/asset-view/get-asset-readings/get-asset-readings";
import{CalenderPage} from "../pages/calender-page/calender-page";

import{EmployeeFilter} from "../pages/employee-list/employee-filter/employee-filter";
import {JobFilter} from "../pages/jobs/job-filter/job-filter";
import{SQLite,SQLiteObject} from "@ionic-native/sqlite";
import {DBService} from "../pages/service/dbService";
import {Network} from "@ionic-native/network";
import {Diagnostic} from "@ionic-native/diagnostic";

=======
import {OfflineAttendance} from "../pages/employee/offline-attendance";
import {SQLite} from "@ionic-native/sqlite";
import {Diagnostic} from "@ionic-native/diagnostic";
import {LocationAccuracy} from "@ionic-native/location-accuracy";
import {SplashLogo} from "../pages/splash-logo/splash-logo";
import {Market} from "@ionic-native/market";
import {UpdateApp} from "../pages/update-app/update-app";
import {QRScanner} from "@ionic-native/qr-scanner";
import {ScanQR} from "../pages/jobs/scanQR";
import {DBService} from "../pages/service/dbService";
import {OfflineAttendanceSites} from "../pages/employee/offline-attendance-sites";
import{Checklist} from "../pages/checklist/checklist";
>>>>>>> Release-1.0

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
    QuotationImagePopoverPage,
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
    FeedbackQuestionPage,
    InitFeedbackPage,
    FeedbackDashboardPage,
<<<<<<< HEAD
      FeedbackZone,
      SelectFeedbackPage,
      InitFeedbackZone,
      FeedbackQuestionsForm,
      FeedbackGridPage,
      WizardFeedbackEntry,
      Ticket,
      CreateTicket,
      ViewTicket,
      HasPermission,
      AssetList,
      AssetView,
      AssetFilter,
      ScanQR,
      JobFilter,
      TicketFilter,
      Splash,
      SplashLogo,
      EmployeeFilter,
      GetAssetReading,
      GetAssetReadings,
      CalenderPage,
=======
    FeedbackZone,
    SelectFeedbackPage,
    InitFeedbackZone,
    FeedbackQuestionsForm,
    FeedbackGridPage,
    WizardFeedbackEntry,
    Ticket,
    CreateTicket,
    ViewTicket,
    HasPermission,
    ForgotPassword,
    OfflineAttendance,
    SplashLogo,
    UpdateApp,
    ScanQR,
    OfflineAttendanceSites,
      Checklist
>>>>>>> Release-1.0
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DatePickerModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp,{
        backButtonText: '',
        backButtonIcon: 'ios-arrow-back',
        iconMode: 'md'
    }),
    IonicImageViewerModule,
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
    QuotationImagePopoverPage,
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
    InitFeedbackPage,
    FeedbackGridPage,
    JobPopoverPage,
    FeedbackZone,
    FeedbackDashboardPage,
<<<<<<< HEAD
      SelectFeedbackPage,
      InitFeedbackZone,
      FeedbackQuestionsForm,
      WizardFeedbackEntry,
      Ticket,
      CreateTicket,
      ViewTicket,
      AssetView,
      AssetList,
      AssetFilter,
      JobFilter,
      TicketFilter,
      EmployeeFilter,
      GetAssetReading,
      Splash,
      SplashLogo,
    ScanQR,
      GetAssetReadings,
      CalenderPage,



=======
    SelectFeedbackPage,
    InitFeedbackZone,
    FeedbackQuestionsForm,
    WizardFeedbackEntry,
    Ticket,
    CreateTicket,
    ViewTicket,
    ForgotPassword,
    OfflineAttendance,
    SplashLogo,
    UpdateApp,
    ScanQR,
    OfflineAttendanceSites,
      Checklist
>>>>>>> Release-1.0
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
<<<<<<< HEAD
      NativeAudio,
      AttendanceService,
      EmployeeService,
      FeedbackService,
      JobService,
      QuotationService,
      SiteService,
      AssetService,
      DBService,
=======
    NativeAudio,
    AttendanceService,
    EmployeeService,
    FeedbackService,
    JobService,
    QuotationService,
    SiteService,
>>>>>>> Release-1.0
    authService,
    HttpClient,
    Geolocation,
    BackgroundMode,
    Geofence,
    // GoogleMaps,
    Toast,
    OneSignal,
    componentService,
    BatteryStatus,
    Toast,
    FileTransfer,
    File,
<<<<<<< HEAD
      DatePicker,
      AppVersion,
      QRScanner,
      FabContainer,
      Diagnostic,
      SQLite,
=======
    AppVersion,
    Network,
    SQLite,
    Diagnostic,
    LocationAccuracy,
    Market,
    QRScanner,
    DBService,
>>>>>>> Release-1.0
    {provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide:MY_CONFIG_TOKEN, useValue: AppConfig}
  ]
})
export class AppModule {}
