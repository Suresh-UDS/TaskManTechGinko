import { Component, ViewChild } from '@angular/core';
import { Events, IonicApp, MenuController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BatteryStatus, BatteryStatusResponse } from "@ionic-native/battery-status";
import { BackgroundMode } from '@ionic-native/background-mode';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from "../pages/login/login";
import { SiteListPage } from "../pages/site-list/site-list";
import { AttendanceListPage } from "../pages/attendance-list/attendance-list";
import { AttendanceViewPage } from "../pages/attendance-view/attendance-view";
import { EmployeeList } from "../pages/employee/employee-list";
import { SitePage } from "../pages/site/site";
import { JobsPage } from "../pages/jobs/jobs";
import { ReportsPage } from "../pages/reports/reports";
import { LogoutPage } from "../pages/logout/logout";
import { AttendancePage } from "../pages/attendance/attendance";
import { TabsPage } from "../pages/tabs/tabs";
import { QuotationPage } from "../pages/quotation/quotation";
import { CustomerDetailPage } from "../pages/customer-detail/customer-detail";
import { EmployeeListPage } from "../pages/employee-list/employee-list";
import { RateCardPage } from "../pages/rate-card/rate-card";
import { FeedbackPage } from "../pages/feedback/feedback";
import { InitFeedbackPage } from "../pages/feedback/init-feedback";
import { AppVersion } from "@ionic-native/app-version";
import { Splash } from "../pages/splash/splash";
import { SplashLogo } from "../pages/splash-logo/splash-logo";
import { OfflinePage } from "../pages/offline-page/offline-page";
import { OfflineAssetList } from "../pages/offline-assetlist/offline-assetlist";
import { OfflineGetassetreadings } from "../pages/offline-getassetreadings/offline-getassetreadings";

import { OneSignal } from "@ionic-native/onesignal";
import { componentService } from "../pages/service/componentService";
import { Ticket } from "../pages/ticket/ticket";
import { AssetList } from "../pages/asset-list/asset-list";
import { JobFilter } from "../pages/jobs/job-filter/job-filter";
import { TicketFilter } from "../pages/ticket/ticket-filter/ticket-filter";
import { EmployeeFilter } from "../pages/employee-list/employee-filter/employee-filter";
import { authService } from "../pages/service/authService";
import { ChangePassword } from "../pages/change-password/change-password";
import { InventoryMaster } from "../pages/inventory-master/inventory-master";
import { ExpensePage } from "../pages/expense/expense";
import { Indent } from "../pages/indent/indent";
import { IndentList } from "../pages/indent-list/indent-list";
import { ExpenseDetails } from "../pages/expense-details/expense-details";
import { onboardingLocation } from '../pages/onboarding/onboardingLocation/onboardingLocation';
import { onboardingExistEmployee } from '../pages/onboarding/onboardingList/onboardingList';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = TabsPage;
    userName: any;
    userType: any;
    counter = 0;
    pushEvent: any;

    pages: Array<{ title: string, component: any, active: any, icon: any, permission: any }>;

    constructor(public platform: Platform, private ionicApp: IonicApp, public menuCtrl: MenuController, private backgroundMode: BackgroundMode,
        public statusBar: StatusBar, public component: componentService, public toastCtrl: ToastController,
        public splashScreen: SplashScreen, private oneSignal: OneSignal, public events: Events, private batteryStatus: BatteryStatus,
        private appVersion: AppVersion, private authService: authService) {
        this.initializeApp();

        //
        //
        //
        //
        // this.oneSignal.startInit('be468c76-586a-4de1-bd19-fc6d9512e5ca','1088177211637');
        // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        // this.oneSignal.handleNotificationReceived().subscribe(response=>{
        //     console.log("Notification received");
        //     console.log(JSON.stringify(response))
        //
        //
        // });
        // this.oneSignal.handleNotificationOpened().subscribe(response=> {
        //     console.log("Notification Opened")
        //     console.log(JSON.stringify(response))
        //     this.pushEvent=response.notification.payload.additionalData.event;
        //     if(this.pushEvent=='assign_driver')
        //     {
        //         this.nav.setRoot(TabsPage,{event:this.pushEvent})
        //     }
        //     else if(this.pushEvent=='cancel_booking')
        //     {
        //         this.nav.setRoot(TabsPage,{event:this.pushEvent})
        //     }
        // });
        //
        // this.oneSignal.getIds().then(
        //     response=>{
        //         console.log("Push Subscription response - get Ids");
        //         console.log(response);
        //             this.registerForPush("android",response.pushToken,response.userId);
        //     }
        // );
        //
        //
        // this.oneSignal.endInit();
        //
        //



        platform.registerBackButtonAction(() => {
            let view = this.nav.getActive();
            console.log("Back button event");
            console.log(view);
            console.log(this.nav.canGoBack());
            if (this.ionicApp._overlayPortal.getActive()) {
                this.ionicApp._overlayPortal.getActive().dismiss();
            }
            else if (this.nav.canGoBack()) {
                this.nav.pop();
            }
            else if (this.menuCtrl.isOpen()) {
                this.menuCtrl.close();
            }
            else if (this.ionicApp._modalPortal.getActive()) {
                this.ionicApp._modalPortal.getActive().dismiss();
            }
            else if (this.counter == 0) {
                this.counter++;
                this.component.showToastMessage('Press again to exit', 'center');
                setTimeout(() => { this.counter = 0 }, 3000)
            } else {
                // console.log("exitapp");
                platform.exitApp();
            }
        }, 0);

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Dashboard', component: TabsPage, active: true, icon: 'dashboard', permission: 'DashboardList' },
            { title: 'Site', component: SitePage, active: false, icon: 'device_hub', permission: 'SiteList' },
            // { title: 'Client', component: CustomerDetailPage,active:false,icon:'person'},
            // { title: 'Employee', component: EmployeeListPage,active:false,icon:'people',permission:'EmployeeList'},
            { title: 'Jobs', component: JobsPage, active: false, icon: 'description', permission: 'JobsList' },
            { title: 'Assets', component: AssetList, active: false, icon: 'assessment', permission: 'AssetsList' },
            { title: 'Tickets', component: Ticket, active: false, icon: 'tab', permission: 'TicketsList' },
            { title: 'Attendance', component: SiteListPage, active: false, icon: 'content_paste', permission: 'AttendanceList' },
            // { title: 'Rate Card', component: RateCardPage,active:false,icon:'description',permission:'RateCardList'},
            { title: 'Quotation', component: QuotationPage, active: false, icon: 'receipt', permission: 'QuotationList' },
            { title: 'OnBoarding', component: onboardingExistEmployee, active: false, icon: 'person_add', permission: 'DashboardList' },
            { title: 'Expense', component: ExpensePage, active: false, icon: 'pie_chart', permission: 'AttendanceList' },
            { title: 'InventoryMaster', component: InventoryMaster, active: false, icon: 'widgets', permission: 'FeedbackList' },
            { title: 'Indent', component: Indent, active: false, icon: 'build', permission: 'TicketsList' },
            { title: 'IndentList', component: IndentList, active: false, icon: 'shopping_cart', permission: 'AttendanceList' },
            { title: 'Feedback', component: InitFeedbackPage, active: false, icon: 'feedback', permission: 'FeedbackList' },
            { title: 'ChangePassword', component: ChangePassword, active: false, icon: 'lock', permission: 'FeedbackList' }
            // {title:'Splash page', component:Splash,active:false,icon:'feedback',permission:'DashboardList'},
            // {title:'Splash logo', component:SplashLogo,active:false,icon:'feedback',permission:'DashboardList'},
            // { title: 'Reports', component: ReportsPage,active:false,icon:'trending_up'},
            // { title: 'Logout', component: LogoutPage,active:false,icon:'power_settings_new'}
        ];

        console.log("Employee Name");
        console.log(window.localStorage.getItem('employeeFullName'));
        this.userName = window.localStorage.getItem('employeeFullName');


    }


    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.menuCtrl.swipeEnable(false);
            console.log("Version details");
            console.log("current version" + "0.4.0");
            console.log(this.appVersion.getAppName());
            console.log(this.appVersion.getPackageName());
            console.log(this.appVersion.getVersionCode());
            console.log(this.appVersion.getVersionNumber());
            // this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.backgroundMode.enable();
            let subscription = this.batteryStatus.onChange().subscribe(
                (status: BatteryStatusResponse) => {
                    console.log("Battery level");
                    console.log(status.level, status.isPlugged);
                }
            );

            // this.statusBar.overlaysWebView(true);
            // this.statusBar.backgroundColorByHexString("#25312C");
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString("#e67817");

            this.oneSignal.startInit('647127c6-f890-4aad-b4e2-52379805f26c', '1015991031299');
            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            this.oneSignal.handleNotificationReceived().subscribe(response => {
                console.log(response);
            });



            this.oneSignal.handleNotificationOpened().subscribe(response => {
                console.log(response);
            });

            this.oneSignal.getIds().then(
                response => {
                    console.log("Push Subscription response - get Ids");
                    console.log(response);
                    this.registerForPush("android", response.pushToken, response.userId);
                }
            );

            this.oneSignal.endInit();
        });
    }



    logout() {
        this.nav.setRoot(LoginPage);
        window.localStorage.clear();
    }



    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        for (let i = 0; i < this.pages.length; i++) {
            if (this.pages[i].component == page.component) {
                this.pages[i].active = true;
            }
            else {
                this.pages[i].active = false;
            }
        }
    }

    gotoDashboard() {
        this.nav.setRoot(TabsPage);
    }

    registerForPush(type, pushToken, pushUserId) {
        var user = { user: 'user' + Math.floor((Math.random() * 10000000) + 1), type: type, token: pushToken, pushUserId: pushUserId, userType: 'driver' };
        this.authService.pushSubscription(user).subscribe(
            response => {
                console.log("Response from register for push");
                console.log(response);
            }
        )
    }

}
