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
import{TicketFilter} from "../pages/ticket/ticket-filter/ticket-filter";
import{InventoryMaster} from "../pages/inventory-master/inventory-master";
import{ExpenseDetails} from"../pages/expense-details/expense-details";
import {CreateEmployeePage} from "../pages/employee-list/create-employee";
import {OneSignal} from "@ionic-native/onesignal";
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
import {Splash} from "../pages/splash/splash";
import {SplashLogo} from "../pages/splash-logo/splash-logo";
import {InitFeedbackZone} from "../pages/feedback/init-feedback-zone";
import {WizardFeedbackEntry} from "../pages/feedback/wizard-feedback-entry";
import {FeedbackQuestionsForm} from "../pages/feedback/feedback-questions-form";
import {Ticket} from "../pages/ticket/ticket";
import {CreateTicket} from "../pages/ticket/create-ticket";
import {ViewTicket} from "../pages/ticket/view-ticket";
import {FeedbackGridPage} from "../pages/feedback/feedback-grid";
import {AppVersion} from "@ionic-native/app-version";
import {HasPermission} from "../components/has-permission/has-permission";
import {AssetList} from "../pages/asset-list/asset-list";
import {AssetFilter} from "../pages/asset-list/asset-filter";
import {AssetView} from "../pages/asset-view/asset-view";
import {QRScanner} from "@ionic-native/qr-scanner";
import {ScanQRAsset} from "../pages/asset-list/scanQR-asset";
import {ScanQR} from "../pages/jobs/scanQR";
import {IonicImageViewerModule} from "ionic-img-viewer";
import {DatePicker} from "@ionic-native/date-picker";
import{GetAssetReading} from "../pages/asset-view/get-asset-reading";
import{GetAssetReadings} from "../pages/asset-view/get-asset-readings/get-asset-readings";
import{CalenderPage} from "../pages/calender-page/calender-page";
import{UpdateApp} from "../pages/update-app/update-app";
import{AddExpense} from "../pages/expense/add-expense/add-expense";
import{EmployeeFilter} from "../pages/employee-list/employee-filter/employee-filter";
import {JobFilter} from "../pages/jobs/job-filter/job-filter";
import{SQLite} from "@ionic-native/sqlite";
import {DBService} from "../pages/service/dbService";
import {Network} from "@ionic-native/network";
import {Diagnostic} from "@ionic-native/diagnostic";
import {Market} from "@ionic-native/market";
import {Checklist} from "../pages/checklist/checklist";
import {OfflinePage} from "../pages/offline-page/offline-page";
import {OfflineAttendanceSites} from "../pages/employee/offline-attendance-sites";
import{OfflineAssetList} from "../pages/offline-assetlist/offline-assetlist";
import{OfflineAsset} from "../pages/offline-asset/offline-asset";
import{OfflineGetassetreadings} from "../pages/offline-getassetreadings/offline-getassetreadings";
import {OfflineAttendance} from "../pages/employee/offline-attendance";
import{ChangePassword} from "../pages/change-password/change-password";
import{LocationAccuracy} from "@ionic-native/location-accuracy";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import {LocationProvider} from "../providers/location-provider";
import {OfflineCompleteJob} from "../pages/offline-complete-job/offline-complete-job";
import {OfflineJobs} from "../pages/offline-jobs/offline-jobs";
import{ForgotPassword} from "../pages/forgot-password/forgot-password";
import{InventoryFilter} from "../pages/inventory-filter/inventory-filter";
import{AddInventoryTransaction} from "../pages/add-inventory-transaction/add-inventory-transaction";
import {InventoryService} from "../pages/service/inventoryService";
import {ExpenseService} from "../pages/service/expenseService";
import{AutoCompleteModule} from "ionic2-auto-complete";
import {PurchaseRequisitionService} from "../pages/service/PurchaseRequisitionService";
import {ExpensePage} from "../pages/expense/expense";
import {TransactionPage} from "../pages/expense/transaction";
import {Indent} from "../pages/indent/indent";
import{IndentView} from "../pages/indent-view/indent-view";
import {InventoryTransaction} from "../pages/inventorytransaction/inventorytransaction";
import{IndentList} from "../pages/indent-list/indent-list";
import{IndentIssue} from "../pages/indent-issue/indent-issue";
import{AddMaterial} from "../pages/add-material/add-material";
import{SelectSearchableModule} from "ionic-select-searchable";
import {FeedbackGridFinish} from "../pages/feedback-grid-finish/feedback-grid-finish";
// import { PhotoViewer } from '@ionic-native/photo-viewer';

// import{IonicImageViewerModule} from "ionic-img-viewer";


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
      ScanQRAsset,
      ScanQR,
      ScanQRAsset,
      JobFilter,
      TicketFilter,
      Splash,
      SplashLogo,
      EmployeeFilter,
      GetAssetReading,
      GetAssetReadings,
      CalenderPage,
      Checklist,
      OfflinePage,
      OfflineAttendanceSites,
      OfflineAsset,
      OfflineAssetList,
      OfflineGetassetreadings,
      OfflineAttendance,
      ChangePassword,
      InventoryMaster,
      UpdateApp,
      ForgotPassword,
    OfflineCompleteJob,
    OfflineJobs,
    FeedbackGridFinish,
      // PhotoViewer
      InventoryFilter,
      AddInventoryTransaction,
    ExpensePage,
    TransactionPage,
      Indent,
      IndentView,
    InventoryTransaction,
      IndentList,
      IndentIssue,
      ExpenseDetails,
      AddExpense,
    AddMaterial
  ],
  imports: [
    BrowserModule,
    HttpModule,
    DatePickerModule,
    BrowserAnimationsModule,
    SelectSearchableModule,

    IonicModule.forRoot(MyApp,{
        backButtonText
            : '',
        backButtonIcon: 'ios-arrow-back',
        iconMode: 'md'
    }),
    IonicImageViewerModule,
      // PhotoViewer,
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
      ScanQRAsset,
      GetAssetReadings,
      CalenderPage,
      Checklist,
      OfflinePage,
      OfflineAttendanceSites,
      OfflineAssetList,
      OfflineAsset,
      OfflineGetassetreadings,
      OfflineAttendance,
      ChangePassword,
      InventoryMaster,
      UpdateApp,
      ForgotPassword,
    OfflineCompleteJob,
    OfflineJobs,
      InventoryFilter,
      AddInventoryTransaction,
    ExpensePage,
    TransactionPage,
      Indent,
      IndentView,
    InventoryTransaction,
      IndentList,
      IndentIssue,
      ExpenseDetails,
      AddExpense,
    AddMaterial,
    // WheelSelector
    FeedbackGridFinish
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    NativeAudio,
    AttendanceService,
    EmployeeService,
    FeedbackService,
    JobService,
    QuotationService,
    SiteService,
    AssetService,
    DBService,
    authService,
    HttpClient,
    Geolocation,
    BackgroundMode,
    Geofence,
    // GoogleMaps,
    Toast,
    OneSignal,
    componentService,
    OneSignal,
    BatteryStatus,
    Toast,
    FileTransfer,
    File,
    DatePicker,
    AppVersion,
    QRScanner,
    FabContainer,
    Diagnostic,
    SQLite,
    Network,
    Market,
    LocationAccuracy,
    BackgroundGeolocation,
    LocationProvider,
    InventoryService,
    ExpenseService,
    PurchaseRequisitionService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide:MY_CONFIG_TOKEN, useValue: AppConfig}
  ]
})
export class AppModule {}
