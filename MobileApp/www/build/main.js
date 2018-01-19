webpackJsonp([5],{

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(312);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = (function () {
    function LoginPage(navCtrl, menuCtrl, navParams, myService) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.navParams = navParams;
        this.myService = myService;
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
        this.menuCtrl.swipeEnable(false);
    };
    LoginPage.prototype.signin = function () {
        var _this = this;
        this.myService.login(this.username, this.password).subscribe(function (response) {
            console.log(response);
            console.log(response.json());
            window.localStorage.setItem('session', response.json().token);
            window.localStorage.setItem('userGroup', response.json().employee.userUserGroupName);
            window.localStorage.setItem('employeeId', response.json().employee.id);
            window.localStorage.setItem('employeeFullName', response.json().employee.fullName);
            window.localStorage.setItem('employeeEmpId', response.json().employee.empId);
            var employee = response.json().employee;
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
            /*  if(employee.userUserGroupName == "Admin"){
                console.log("Admin user ");
                this.navCtrl.setRoot(SiteListPage);
              }else if(employee.userUserGroupName == "Client"){
                console.log("Client User");
              }else if(employee.userUserGroupName == "Employee"){
                console.log("Employee user")
                this.navCtrl.setRoot(EmployeeSiteListPage);
              }else {
                this.navCtrl.setRoot(SiteListPage);
        
              }
        */
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\login\login.html"*/`<!--\n\n  Generated template for the LoginPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header >\n\n\n\n  <ion-navbar color="primary">\n\n    <ion-title text-center>Login</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n\n\n  <div text-center class="margin-top">\n\n    <img src="img/logo.png">\n\n  </div>\n\n\n\n  <div>\n\n    <ion-item class="width80 margin-auto">\n\n      <ion-input type="text" placeholder="Username" class="round" [(ngModel)]="username"></ion-input>\n\n    </ion-item>\n\n\n\n    <ion-item class="width80 margin-auto padding-top10">\n\n      <ion-input type="password"  placeholder="Password" class="round" [(ngModel)]="password"></ion-input>\n\n    </ion-item>\n\n  </div>\n\n\n\n  <div padding text-center>\n\n    <button ion-button color="primary" round (click)="signin()">Sign In</button>\n\n  </div>\n\n\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["MenuController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 170:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 170;

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/attendance-list/attendance-list.module": [
		829,
		4
	],
	"../pages/attendance-view/attendance-view.module": [
		830,
		3
	],
	"../pages/login/login.module": [
		831,
		2
	],
	"../pages/site-employeeList/site-employeeList.module": [
		832,
		1
	],
	"../pages/site-list/site-list.module": [
		833,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 215;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return authService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by admin on 12/26/2017.
 */





var authService = (function () {
    function authService(http, https, loadingCtrl, toastCtrl) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.Url_local = 'http://localhost:8000/';
        this.mobile_url = "http://192.168.1.8:8088/";
        this.aws_url = '';
        this.Url = this.mobile_url;
        this.kairosResponse = {
            status: String,
            headers: String,
            responseText: String
        };
    }
    authService.prototype.login = function (username, password) {
        return this.https.post(this.Url + 'api/auth/' + username + '/' + password, { username: username, password: password }).map(function (response) {
            return response;
        });
    };
    authService.prototype.searchSite = function () {
        return this.http.get(this.Url + 'api/site').map(function (response) {
            return response;
        });
    };
    authService.prototype.searchSiteEmployee = function (siteId) {
        return this.http.get(this.Url + 'api/employee/site/' + siteId).map(function (response) {
            return response;
        });
    };
    authService.prototype.getSiteAttendances = function (siteId) {
        return this.http.get(this.Url + 'api/attendance/site/' + siteId).map(function (response) {
            return response;
        });
    };
    authService.prototype.enrollFace = function (employeeName, base64Image) {
        return this.http.kairosPost('https://api.kairos.com/enroll', { image: base64Image, subject_id: employeeName, gallery_name: 'Employee' }).map(function (response) {
            console.log(response);
            return response;
        });
    };
    authService.prototype.verifyUser = function (employeeName, base64Image) {
        return this.http.kairosPost('https://api.kairos.com/verify', { image: base64Image, subject_id: employeeName, gallery_name: 'Employee' }).map(function (response) {
            console.log(response);
            return response;
        });
    };
    authService.prototype.detectFace = function (employeeName, base64Image) {
        return this.http.kairosPost('https://api.kairos.com/detect', { image: base64Image, selector: 'ROLL' }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
        });
    };
    authService.prototype.markAttendanceCheckIn = function (siteId, empId, lat, long, imageData) {
        return this.http.post(this.Url + 'api/attendance', { siteId: siteId, employeeEmpId: empId, latitudeIn: lat, longitudeIn: long, checkInImage: imageData }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    authService.prototype.markAttendanceCheckOut = function (siteId, empId, lat, long, imageData, attendanceId) {
        return this.http.post(this.Url + 'api/attendance/save', { siteId: siteId, employeeEmpId: empId, latitudeOut: lat, longitudeOut: long, checkOutImage: imageData, id: attendanceId }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    authService.prototype.getAttendances = function (employeeId) {
        return this.http.post(this.Url + 'api/attendance/' + employeeId, { employeeId: employeeId }).map((function (response) {
            console.log(response);
            return response;
        }));
    };
    authService.prototype.checkSiteProximity = function (siteId, lat, lng) {
        return this.http.get('http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/api/site/nearby?' + 'siteId=' + siteId + '&' + 'lat=' + lat + '&lng=' + lng).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            return error;
        });
    };
    authService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["ToastController"]])
    ], authService);
    return authService;
}());

//# sourceMappingURL=authService.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by admin on 12/26/2017.
 */




var HttpClient = (function () {
    function HttpClient(http, storage) {
        this.http = http;
        this.storage = storage;
    }
    HttpClient.prototype.post = function (url, data) {
        console.log(url);
        var token_header = window.localStorage.getItem('session');
        console.log();
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'X-Auth-Token': token_header });
        headers.append('Content-Type', 'application/json');
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(url, data, options).map(function (response) {
            console.log('returning from interceptor');
            return response;
        });
    };
    HttpClient.prototype.get = function (url) {
        var token_header = window.localStorage.getItem('session');
        console.log('from local storage');
        console.log(token_header);
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'X-Auth-Token': token_header });
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        console.log(url);
        return this.http.get(url, options).map(function (Response) {
            console.log('returning from interceptor');
            return Response;
        });
    };
    HttpClient.prototype.kairosPost = function (url, data) {
        console.log(url);
        var token_header = window.localStorage.getItem('session');
        console.log();
        var headers = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["a" /* Headers */]({ 'X-Auth-Token': token_header });
        headers.append('Content-Type', 'application/json');
        headers.append('app_id', '2f2877f2');
        headers.append('app_key', 'a6ae8363069107177e06c3ca3f76a66b');
        var options = new __WEBPACK_IMPORTED_MODULE_0__angular_http__["d" /* RequestOptions */]({ headers: headers });
        return this.http.post(url, data, options).map(function (response) {
            console.log('returning from interceptor');
            window.localStorage.setItem('responseImageDetails', JSON.stringify(response));
            return response;
        }, function (error) {
            window.localStorage.setItem('responseImageDetails', JSON.stringify(error));
            console.log(error);
        });
    };
    HttpClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */]])
    ], HttpClient);
    return HttpClient;
}());

//# sourceMappingURL=HttpClient.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quotation_quotation__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__customer_detail_customer_detail__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__employee_detail_employee_detail__ = __webpack_require__(439);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TabsPage = (function () {
    function TabsPage() {
        this.DashboardTab = __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard__["a" /* DashboardPage */];
        this.QuotationTab = __WEBPACK_IMPORTED_MODULE_2__quotation_quotation__["a" /* QuotationPage */];
        this.CustomerDetailTab = __WEBPACK_IMPORTED_MODULE_3__customer_detail_customer_detail__["a" /* CustomerDetailPage */];
        this.EmployeeDetailTab = __WEBPACK_IMPORTED_MODULE_4__employee_detail_employee_detail__["a" /* EmployeeDetailPage */];
    }
    TabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TabsPage');
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-tabs',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\tabs\tabs.html"*/`<ion-tabs  tabsPlacement="bottom" color="primary">\n\n  <ion-tab tabTitle="Dashboard" [root]="DashboardTab"  tabIcon="ios-podium-outline"></ion-tab>\n\n  <ion-tab tabTitle="Quotation" [root]="QuotationTab"  tabIcon="md-paper"></ion-tab>\n\n  <ion-tab tabTitle="Customer" [root]="CustomerDetailTab"  tabIcon="list-box"></ion-tab>\n\n  <ion-tab tabTitle="Employee" [root]="EmployeeDetailTab"  tabIcon="clock"></ion-tab>\n\n</ion-tabs>\n\n\n\n\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DashboardPage = (function () {
    function DashboardPage(renderer, navCtrl, authService, modalCtrl, datePickerProvider) {
        this.renderer = renderer;
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.modalCtrl = modalCtrl;
        this.datePickerProvider = datePickerProvider;
    }
    /*
      showCalendar2() {
        const dateSelected =
            this.datePickerProvider.showCalendar(this.modalCtrl);
    
        dateSelected.subscribe(date =>
            console.log("second date picker: date selected is", date));
      }
    */
    DashboardPage.prototype.ionViewDidLoad = function () {
        demo.initFullCalendar();
        this.authService.searchSite().subscribe(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('date'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], DashboardPage.prototype, "MyCalendar", void 0);
    DashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-dashboard',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\dashboard\dashboard.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Dashboard</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n    <ion-row>\n\n        <ion-col col-10>\n\n            <div class="card card-calendar">\n\n                <div class="card-content" class="ps-child">\n\n                    <div id="fullCalendar"></div>\n\n                </div>\n\n            </div>\n\n        </ion-col>\n\n    </ion-row>\n\n\n\n\n\n <!--\n\n  <div class="wrapper">\n\n    <ion-toolbar>\n\n      <ion-segment  color="secondary">\n\n        <ion-segment-button value="camera">\n\n          <ion-icon name="camera"></ion-icon>\n\n        </ion-segment-button>\n\n      </ion-segment>\n\n    </ion-toolbar>\n\n-->\n\n    <!--\n\nTip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\n\n\nTip 2: you can also add an image using data-image tag\n\n-->\n\n\n\n    <div class="container-fluid container-scroll hariz-scroll-con">\n\n        <div class="row">\n\n            <ion-item>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n                <ion-avatar item-left>\n\n                    <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n            </ion-item>\n\n\n\n        </div>\n\n    </div>\n\n\n\n\n\n\n\n\n\n    <div class="container-fluid container-scroll hariz-scroll-con">\n\n        <div class="row">\n\n            <button ion-button round color="light">\n\n                site 1\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 2\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 3\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 4\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 5\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 6\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 7\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 8\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 9\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 10\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 11\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 12\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 13\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 14\n\n            </button>\n\n            <button ion-button round color="light">\n\n                site 15\n\n            </button>\n\n\n\n        </div>\n\n    </div>\n\n\n\n\n\n\n\n        <ion-segment class="segmnt" color="clr-blue">\n\n            <ion-segment-button value="overdue">\n\n                Overdue\n\n            </ion-segment-button>\n\n            <ion-segment-button value="upcoming">\n\n                Upcoming\n\n            </ion-segment-button>\n\n            <ion-segment-button value="completed">\n\n                Completed\n\n            </ion-segment-button>\n\n        </ion-segment>\n\n\n\n    <div class="main-panel" >\n\n\n\n      <div class="content margin-top0">\n\n        <div class="container-fluid">\n\n\n\n          <div class="row">\n\n            <ion-col col-12>\n\n              <div class="card">\n\n                <div class="card-content">\n\n                  <p class="category">Used Space</p>\n\n                  <h3 class="title">49/50\n\n                    <small>GB</small>\n\n                  </h3>\n\n                </div>\n\n                <div class="card-footer">\n\n                  <div class="stats">\n\n                      <i class="fa fa-calendar" aria-hidden="true" class="primary-clr"></i> Jan-5,2018\n\n\n\n                      <i class="fa fa-clock-o" aria-hidden="true" class="primary-clr"></i>5.30 PM\n\n\n\n\n\n                  </div>\n\n                </div>\n\n              </div>\n\n            </ion-col>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n\n\n</ion-content>\n\n<!--\n\n<script type="text/javascript">\n\n    $(document).ready(function() {\n\n        demo.initFullCalendar();\n\n    });\n\n</script>\n\n-->`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\dashboard\dashboard.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"],
            __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__["DatePickerProvider"]])
    ], DashboardPage);
    return DashboardPage;
}());

//# sourceMappingURL=dashboard.js.map

/***/ }),

/***/ 436:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quotation_popover__ = __webpack_require__(437);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QuotationPage = (function () {
    function QuotationPage(navCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
    }
    QuotationPage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_2__quotation_popover__["a" /* QuotationPopoverPage */]);
        popover.present({
            ev: myEvent
        });
    };
    QuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-quotation',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\quotation\quotation.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Quotation</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <div class="row">\n\n    <ion-col col-11 class="margin-auto">\n\n      <div class="card">\n\n          <div class="card-header border-bottom padding-left-right0">\n\n              <p class="category display-inline">Pending</p>\n\n            <button ion-button icon-left icon-only clear (click)="presentPopover($event)" class="pop-icon">\n\n              <ion-icon name="more"></ion-icon>\n\n            </button>\n\n          </div>\n\n            <div class="card-content">\n\n              <h3 class="title" text-center>50</h3>\n\n            </div>\n\n            <div class="card-footer">\n\n              <div class="stats align-right">\n\n                  <p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n              </div>\n\n            </div>\n\n      </div>\n\n    </ion-col>\n\n  </div>\n\n  <div class="row">\n\n    <ion-col col-11 class="margin-auto">\n\n      <div class="card">\n\n        <div class="card-header border-bottom padding-left-right0">\n\n          <p class="category display-inline">Overdue</p>\n\n          <button ion-button icon-left icon-only clear (click)="presentPopover($event)" class="pop-icon">\n\n            <ion-icon name="more"></ion-icon>\n\n          </button>\n\n        </div>\n\n        <div class="card-content">\n\n          <h3 class="title" text-center>50</h3>\n\n        </div>\n\n        <div class="card-footer">\n\n          <div class="stats align-right">\n\n            <p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </ion-col>\n\n  </div>\n\n  <div class="row">\n\n    <ion-col col-11 class="margin-auto">\n\n      <div class="card">\n\n        <div class="card-header border-bottom padding-left-right0">\n\n          <p class="category display-inline">Approved</p>\n\n          <button ion-button icon-left icon-only clear (click)="presentPopover($event)" class="pop-icon">\n\n            <ion-icon name="more"></ion-icon>\n\n          </button>\n\n        </div>\n\n        <div class="card-content">\n\n          <h3 class="title" text-center>50</h3>\n\n        </div>\n\n        <div class="card-footer">\n\n          <div class="stats align-right">\n\n            <p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </ion-col>\n\n  </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\quotation\quotation.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], QuotationPage);
    return QuotationPage;
}());

//# sourceMappingURL=quotation.js.map

/***/ }),

/***/ 437:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationPopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuotationPopoverPage = (function () {
    function QuotationPopoverPage(navCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
    }
    QuotationPopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-quotation-popover',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\quotation\quotation-popover.html"*/`<ion-content>\n\n    <ion-list >\n\n        <button ion-item class="lable-clr">\n\n            item1\n\n        </button>\n\n        <button ion-item>\n\n            item2\n\n        </button>\n\n        <button ion-item>\n\n            item3\n\n        </button>\n\n    </ion-list>\n\n\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\quotation\quotation-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], QuotationPopoverPage);
    return QuotationPopoverPage;
}());

//# sourceMappingURL=quotation-popover.js.map

/***/ }),

/***/ 438:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(85);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CustomerDetailPage = (function () {
    function CustomerDetailPage(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
    }
    CustomerDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    CustomerDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-customer-detail',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\customer-detail\customer-detail.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Customer Detail</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-segment [(ngModel)]="categories" class="segmnt margin-auto margin-top5" color="clr-blue">\n\n    <ion-segment-button value="detail">\n\n      Detail\n\n    </ion-segment-button>\n\n    <ion-segment-button value="jobs">\n\n      Jobs\n\n    </ion-segment-button>\n\n    <ion-segment-button value="quotation">\n\n      Quotation\n\n    </ion-segment-button>\n\n\n\n  </ion-segment>\n\n\n\n\n\n  <div [ngSwitch]="categories">\n\n\n\n        <ion-col col-11 class="margin-auto" *ngSwitchCase="\'detail\'">\n\n          <div class="card">\n\n            <div class="card-content">\n\n              <div class="row">\n\n                <label class="col-md-4 label-on-left">Name</label>\n\n                <div class="col-md-8">\n\n                  <p text-right>Name</p>\n\n                </div>\n\n              </div>\n\n                <div class="row">\n\n                    <label class="col-md-4 label-on-left">Mobile</label>\n\n                    <div class="col-md-8">\n\n                        <p text-right>9003837625</p>\n\n                    </div>\n\n                </div>\n\n                <div class="row">\n\n                    <label class="col-md-4 label-on-left">Email</label>\n\n                    <div class="col-md-8">\n\n                        <p text-right>name@gmail.com</p>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n          </div>\n\n        </ion-col>\n\n\n\n    <ion-list *ngSwitchCase="\'jobs\'">\n\n      <ion-item>\n\n\n\n      </ion-item>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n      <ion-item>\n\n\n\n      </ion-item>\n\n    </ion-list>\n\n\n\n  </div>\n\n\n\n</ion-content>`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\customer-detail\customer-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */]])
    ], CustomerDetailPage);
    return CustomerDetailPage;
}());

//# sourceMappingURL=customer-detail.js.map

/***/ }),

/***/ 439:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(85);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EmployeeDetailPage = (function () {
    function EmployeeDetailPage(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
    }
    EmployeeDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    EmployeeDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-employee-detail',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\employee-detail\employee-detail.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Employee Detail</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-segment [(ngModel)]="categories" class="segmnt margin-auto margin-top5" color="clr-blue">\n\n    <ion-segment-button value="detail">\n\n      Detail\n\n    </ion-segment-button>\n\n    <ion-segment-button value="jobs">\n\n      Jobs\n\n    </ion-segment-button>\n\n    <ion-segment-button value="quotation">\n\n      Quotation\n\n    </ion-segment-button>\n\n\n\n  </ion-segment>\n\n\n\n\n\n  <div [ngSwitch]="categories">\n\n\n\n    <ion-list *ngSwitchCase="\'detail\'">\n\n      <ion-col col-11 class="margin-auto">\n\n        <div class="card">\n\n          <div class="card-content">\n\n            <div class="row">\n\n              <label class="col-md-4 label-on-left">Name</label>\n\n              <div class="col-md-8">\n\n                <p text-right>Name</p>\n\n              </div>\n\n            </div>\n\n            <div class="row">\n\n              <label class="col-md-4 label-on-left">Mobile</label>\n\n              <div class="col-md-8">\n\n                <p text-right>9003837625</p>\n\n              </div>\n\n            </div>\n\n            <div class="row">\n\n              <label class="col-md-4 label-on-left">Email</label>\n\n              <div class="col-md-8">\n\n                <p text-right>name@gmail.com</p>\n\n              </div>\n\n            </div>\n\n          </div>\n\n        </div>\n\n      </ion-col>\n\n    </ion-list>\n\n\n\n    <ion-list *ngSwitchCase="\'jobs\'">\n\n      <ion-item>\n\n\n\n      </ion-item>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n      <ion-item>\n\n\n\n      </ion-item>\n\n    </ion-list>\n\n\n\n  </div>\n\n\n\n</ion-content>`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\employee-detail\employee-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */]])
    ], EmployeeDetailPage);
    return EmployeeDetailPage;
}());

//# sourceMappingURL=employee-detail.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendanceListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the AttendanceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AttendanceListPage = (function () {
    function AttendanceListPage(navCtrl, navParams, camera, authService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.authService = authService;
    }
    AttendanceListPage.prototype.ionViewDidLoad = function () {
        var now = new Date().getTime();
        console.log('ionViewDidLoad AttendanceListPage' + now);
        this.attendances = this.navParams.get('attendances');
        console.log(this.attendances);
    };
    AttendanceListPage.prototype.viewCamera = function () {
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            // this.navCtrl.push(AttendanceViewPage,base64Image)
        }, function (err) {
        });
    };
    AttendanceListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance-list',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\attendance-list\attendance-list.html"*/`<!--\n\n  Generated template for the AttendanceListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Attendance</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <ion-item *ngFor="let a of attendances" class="bottom-border">\n\n      <ion-row (click)="viewCamera(a)">\n\n      <!--<ion-col col-2 >-->\n\n        <!--&lt;!&ndash;<ion-icon name="calendar" class="fnt-30 margin9 icon-color"></ion-icon>&ndash;&gt;-->\n\n      <!--</ion-col>-->\n\n      <ion-col col-10>\n\n        <p>Site Name - {{a.siteName}}</p>\n\n        <p>Employee - {{a.employeeFullName}}</p>\n\n        <p><b>Checkin Time</b>{{a.checkInTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n        <p><b>Checkout Time</b>{{a.checkOutTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n      </ion-col>\n\n      </ion-row>\n\n      <ion-row *ngIf="!a">\n\n        No Attendance Records Found\n\n      </ion-row>\n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\attendance-list\attendance-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */]])
    ], AttendanceListPage);
    return AttendanceListPage;
}());

//# sourceMappingURL=attendance-list.js.map

/***/ }),

/***/ 481:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SitePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SitePage = (function () {
    function SitePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    SitePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\site\site.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\site\site.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], SitePage);
    return SitePage;
}());

//# sourceMappingURL=site.js.map

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var JobsPage = (function () {
    function JobsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    JobsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-jobs',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\jobs\jobs.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\jobs\jobs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], JobsPage);
    return JobsPage;
}());

//# sourceMappingURL=jobs.js.map

/***/ }),

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReportsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ReportsPage = (function () {
    function ReportsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ReportsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-reports',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\reports\reports.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\reports\reports.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], ReportsPage);
    return ReportsPage;
}());

//# sourceMappingURL=reports.js.map

/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LogoutPage = (function () {
    function LogoutPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    LogoutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-logout',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\logout\logout.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\logout\logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], LogoutPage);
    return LogoutPage;
}());

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 485:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendancePopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AttendancePopoverPage = (function () {
    function AttendancePopoverPage(navCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
    }
    AttendancePopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance-popover',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\attendance\attendance-popover.html"*/`<ion-content>\n\n    <ion-list >\n\n        <button ion-item class="lable-clr">\n\n            item1\n\n        </button>\n\n        <button ion-item>\n\n            item2\n\n        </button>\n\n        <button ion-item>\n\n            item3\n\n        </button>\n\n    </ion-list>\n\n\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\attendance\attendance-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], AttendancePopoverPage);
    return AttendancePopoverPage;
}());

//# sourceMappingURL=attendance-popover.js.map

/***/ }),

/***/ 486:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendanceViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(36);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the AttendanceViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AttendanceViewPage = (function () {
    function AttendanceViewPage(navCtrl, navParams, domSanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.domSanitizer = domSanitizer;
        this.img = this.navParams.data;
    }
    AttendanceViewPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad AttendanceViewPage');
    };
    AttendanceViewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance-view',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\attendance-view\attendance-view.html"*/`<!--\n\n  Generated template for the AttendanceViewPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>attendance-view</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <div class="align-center">\n\n    <img *ngIf="img" [src]="domSanitizer.bypassSecurityTrustUrl(img)" width="80%" height="70%" class="margin-auto">\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\attendance-view\attendance-view.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]])
    ], AttendanceViewPage);
    return AttendanceViewPage;
}());

//# sourceMappingURL=attendance-view.js.map

/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeSiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the EmployeeSiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EmployeeSiteListPage = (function () {
    function EmployeeSiteListPage(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geolocation.getCurrentPosition().then(function (response) {
            console.log("Current location");
            console.log(response);
            _this.lattitude = response.coords.latitude;
            _this.longitude = response.coords.longitude;
        }).catch(function (error) {
            _this.lattitude = 0;
            _this.longitude = 0;
        });
    }
    EmployeeSiteListPage.prototype.viewList = function (i) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */]);
    };
    EmployeeSiteListPage.prototype.showSuccessToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    EmployeeSiteListPage.prototype.getAttendances = function (site) {
        var _this = this;
        this.authService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeSiteListPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    EmployeeSiteListPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.siteList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            console.log(window.localStorage.getItem('employeeId'));
            _this.authService.getAttendances(_this.employeeId).subscribe(function (response) {
                console.log(response.json());
                var result = response.json();
                if (result[0]) {
                    console.log("already checked in ");
                    _this.checkedIn = true;
                }
                else {
                    console.log("Not yet checked in ");
                    _this.checkedIn = false;
                }
            });
        });
    };
    EmployeeSiteListPage.prototype.gotoEmployeeList = function (site) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__employee_employee_list__["a" /* EmployeeList */], { site: site });
    };
    EmployeeSiteListPage.prototype.viewCamera = function (siteId, attendanceMode) {
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            var loader = _this.loadingCtrl.create({
                content: ''
            });
            loader.present();
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            var employeeName = _this.employeeFullName + _this.employeeId;
            _this.authService.detectFace(employeeName, imageData).subscribe(function (response) {
                console.log("response in site list");
                console.log(response.json());
                var detectResponse = response.json();
                if (detectResponse && detectResponse.images) {
                    if (detectResponse.images[0].status === 'Complete') {
                        _this.authService.verifyUser(_this.employeeFullName, imageData).subscribe(function (response) {
                            console.log("Face verification response");
                            console.log(response.json());
                            var verificationResponse = response.json();
                            if (verificationResponse && verificationResponse.images) {
                                if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                    if (attendanceMode == 'checkIn') {
                                        _this.authService.markAttendanceCheckIn(siteId, _this.employeeEmpId, _this.lattitude, _this.longitude, imageData).subscribe(function (response) {
                                            console.log(response.json());
                                            loader.dismiss();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            loader.dismiss();
                                        });
                                    }
                                    else {
                                        _this.authService.markAttendanceCheckOut(siteId, _this.employeeEmpId, _this.lattitude, _this.longitude, imageData, 1).subscribe(function (response) {
                                            console.log(response.json());
                                            loader.dismiss();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            loader.dismiss();
                                        });
                                    }
                                }
                            }
                            else {
                                loader.dismiss();
                                var msg = "Unable to verify face, please try again";
                                _this.showSuccessToast(msg);
                            }
                        });
                    }
                }
                else {
                    console.log("error in detecting face");
                    loader.dismiss();
                    var msg = "Face not Detected, please try again";
                    _this.showSuccessToast(msg);
                }
            });
            // this.navCtrl.push(AttendanceViewPage,base64Image)
        }, function (err) {
            console.log(err);
        });
    };
    EmployeeSiteListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site-employee-list',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\site-employeeList\site-employeeList.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Select Site</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list>\n\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border" >\n\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n\n      <p  >{{site.name}}\n\n      <span style="float: right">\n\n        <button ion-button (click)="viewCamera(site.id,\'checkIn\')" *ngIf="!checkedIn" >Check - In</button>\n\n        <button ion-button  (click)="viewCamera(site.id,\'checkOut\')" *ngIf="checkedIn">Check - Out</button>\n\n      </span></p>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\site-employeeList\site-employeeList.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"]])
    ], EmployeeSiteListPage);
    return EmployeeSiteListPage;
}());

//# sourceMappingURL=site-employeeList.js.map

/***/ }),

/***/ 488:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the SiteListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SiteListPage = (function () {
    function SiteListPage(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geolocation.getCurrentPosition().then(function (response) {
            console.log("Current location");
            console.log(response);
            _this.lattitude = response.coords.latitude;
            _this.longitude = response.coords.longitude;
        }).catch(function (error) {
            _this.lattitude = 0;
            _this.longitude = 0;
        });
    }
    SiteListPage.prototype.viewList = function (i) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */]);
    };
    SiteListPage.prototype.showSuccessToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    SiteListPage.prototype.getAttendances = function (site) {
        var _this = this;
        this.authService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    SiteListPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    SiteListPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.siteList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            console.log(window.localStorage.getItem('responseImageDetails'));
        });
        this.authService.getAttendances(this.employeeId).subscribe(function (response) {
            console.log(response.json());
            var result = response.json();
            if (result[0]) {
                console.log("already checked in ");
                _this.checkedIn = true;
            }
            else {
                console.log("Not yet checked in ");
                _this.checkedIn = false;
            }
        });
    };
    SiteListPage.prototype.gotoEmployeeList = function (site) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__employee_employee_list__["a" /* EmployeeList */], { site: site });
    };
    SiteListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site-list',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\site-list\site-list.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Select Site</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list>\n\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border" >\n\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n\n      <p (click)="gotoEmployeeList(site)"  >{{site.name}}</p>\n\n\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\site-list\site-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"]])
    ], SiteListPage);
    return SiteListPage;
}());

//# sourceMappingURL=site-list.js.map

/***/ }),

/***/ 489:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(494);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 494:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_Interceptor_HttpClient__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(826);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_list_list__ = __webpack_require__(827);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_attendance_view_attendance_view__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_login_login__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_site_list_site_list__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_attendance_list_attendance_list__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_employee_employee_list__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_storage__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_geofence__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_site_employeeList_site_employeeList__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_dashboard_dashboard__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_tabs_tabs__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_site_site__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_jobs_jobs__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_reports_reports__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_logout_logout__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_quotation_quotation__ = __webpack_require__(436);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_quotation_quotation_popover__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_attendance_attendance__ = __webpack_require__(828);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_attendance_attendance_popover__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_employee_detail_employee_detail__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_customer_detail_customer_detail__ = __webpack_require__(438);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_site_list_site_list__["a" /* SiteListPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_attendance_list_attendance_list__["a" /* AttendanceListPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_attendance_view_attendance_view__["a" /* AttendanceViewPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_employee_employee_list__["a" /* EmployeeList */],
                __WEBPACK_IMPORTED_MODULE_20__pages_site_employeeList_site_employeeList__["a" /* EmployeeSiteListPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_dashboard_dashboard__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_site_site__["a" /* SitePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_jobs_jobs__["a" /* JobsPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_reports_reports__["a" /* ReportsPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_quotation_quotation__["a" /* QuotationPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_quotation_quotation_popover__["a" /* QuotationPopoverPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_attendance_attendance__["a" /* AttendancePage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_attendance_attendance_popover__["a" /* AttendancePopoverPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_employee_detail_employee_detail__["a" /* EmployeeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_customer_detail_customer_detail__["a" /* CustomerDetailPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__["DatePickerModule"],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicModule"].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/attendance-list/attendance-list.module#AttendanceListPageModule', name: 'AttendanceListPage', segment: 'attendance-list', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/attendance-view/attendance-view.module#AttendanceViewPageModule', name: 'AttendanceViewPage', segment: 'attendance-view', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/site-employeeList/site-employeeList.module#EmployeeSiteListPageModule', name: 'EmployeeSiteListPage', segment: 'site-employeeList', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/site-list/site-list.module#SiteListPageModule', name: 'SiteListPage', segment: 'site-list', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_17__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicApp"]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_list_list__["a" /* ListPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_site_list_site_list__["a" /* SiteListPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_attendance_list_attendance_list__["a" /* AttendanceListPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_attendance_view_attendance_view__["a" /* AttendanceViewPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_employee_employee_list__["a" /* EmployeeList */],
                __WEBPACK_IMPORTED_MODULE_20__pages_site_employeeList_site_employeeList__["a" /* EmployeeSiteListPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_dashboard_dashboard__["a" /* DashboardPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_site_site__["a" /* SitePage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_jobs_jobs__["a" /* JobsPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_reports_reports__["a" /* ReportsPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_quotation_quotation__["a" /* QuotationPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_quotation_quotation_popover__["a" /* QuotationPopoverPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_attendance_attendance__["a" /* AttendancePage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_attendance_attendance_popover__["a" /* AttendancePopoverPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_employee_detail_employee_detail__["a" /* EmployeeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_customer_detail_customer_detail__["a" /* CustomerDetailPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_16__pages_service_authService__["a" /* authService */],
                __WEBPACK_IMPORTED_MODULE_4__pages_Interceptor_HttpClient__["a" /* HttpClient */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_geofence__["a" /* Geofence */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicErrorHandler"] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 317,
	"./af.js": 317,
	"./ar": 318,
	"./ar-dz": 319,
	"./ar-dz.js": 319,
	"./ar-kw": 320,
	"./ar-kw.js": 320,
	"./ar-ly": 321,
	"./ar-ly.js": 321,
	"./ar-ma": 322,
	"./ar-ma.js": 322,
	"./ar-sa": 323,
	"./ar-sa.js": 323,
	"./ar-tn": 324,
	"./ar-tn.js": 324,
	"./ar.js": 318,
	"./az": 325,
	"./az.js": 325,
	"./be": 326,
	"./be.js": 326,
	"./bg": 327,
	"./bg.js": 327,
	"./bm": 328,
	"./bm.js": 328,
	"./bn": 329,
	"./bn.js": 329,
	"./bo": 330,
	"./bo.js": 330,
	"./br": 331,
	"./br.js": 331,
	"./bs": 332,
	"./bs.js": 332,
	"./ca": 333,
	"./ca.js": 333,
	"./cs": 334,
	"./cs.js": 334,
	"./cv": 335,
	"./cv.js": 335,
	"./cy": 336,
	"./cy.js": 336,
	"./da": 337,
	"./da.js": 337,
	"./de": 338,
	"./de-at": 339,
	"./de-at.js": 339,
	"./de-ch": 340,
	"./de-ch.js": 340,
	"./de.js": 338,
	"./dv": 341,
	"./dv.js": 341,
	"./el": 342,
	"./el.js": 342,
	"./en-au": 343,
	"./en-au.js": 343,
	"./en-ca": 344,
	"./en-ca.js": 344,
	"./en-gb": 345,
	"./en-gb.js": 345,
	"./en-ie": 346,
	"./en-ie.js": 346,
	"./en-nz": 347,
	"./en-nz.js": 347,
	"./eo": 348,
	"./eo.js": 348,
	"./es": 349,
	"./es-do": 350,
	"./es-do.js": 350,
	"./es-us": 351,
	"./es-us.js": 351,
	"./es.js": 349,
	"./et": 352,
	"./et.js": 352,
	"./eu": 353,
	"./eu.js": 353,
	"./fa": 354,
	"./fa.js": 354,
	"./fi": 355,
	"./fi.js": 355,
	"./fo": 356,
	"./fo.js": 356,
	"./fr": 357,
	"./fr-ca": 358,
	"./fr-ca.js": 358,
	"./fr-ch": 359,
	"./fr-ch.js": 359,
	"./fr.js": 357,
	"./fy": 360,
	"./fy.js": 360,
	"./gd": 361,
	"./gd.js": 361,
	"./gl": 362,
	"./gl.js": 362,
	"./gom-latn": 363,
	"./gom-latn.js": 363,
	"./gu": 364,
	"./gu.js": 364,
	"./he": 365,
	"./he.js": 365,
	"./hi": 366,
	"./hi.js": 366,
	"./hr": 367,
	"./hr.js": 367,
	"./hu": 368,
	"./hu.js": 368,
	"./hy-am": 369,
	"./hy-am.js": 369,
	"./id": 370,
	"./id.js": 370,
	"./is": 371,
	"./is.js": 371,
	"./it": 372,
	"./it.js": 372,
	"./ja": 373,
	"./ja.js": 373,
	"./jv": 374,
	"./jv.js": 374,
	"./ka": 375,
	"./ka.js": 375,
	"./kk": 376,
	"./kk.js": 376,
	"./km": 377,
	"./km.js": 377,
	"./kn": 378,
	"./kn.js": 378,
	"./ko": 379,
	"./ko.js": 379,
	"./ky": 380,
	"./ky.js": 380,
	"./lb": 381,
	"./lb.js": 381,
	"./lo": 382,
	"./lo.js": 382,
	"./lt": 383,
	"./lt.js": 383,
	"./lv": 384,
	"./lv.js": 384,
	"./me": 385,
	"./me.js": 385,
	"./mi": 386,
	"./mi.js": 386,
	"./mk": 387,
	"./mk.js": 387,
	"./ml": 388,
	"./ml.js": 388,
	"./mr": 389,
	"./mr.js": 389,
	"./ms": 390,
	"./ms-my": 391,
	"./ms-my.js": 391,
	"./ms.js": 390,
	"./mt": 392,
	"./mt.js": 392,
	"./my": 393,
	"./my.js": 393,
	"./nb": 394,
	"./nb.js": 394,
	"./ne": 395,
	"./ne.js": 395,
	"./nl": 396,
	"./nl-be": 397,
	"./nl-be.js": 397,
	"./nl.js": 396,
	"./nn": 398,
	"./nn.js": 398,
	"./pa-in": 399,
	"./pa-in.js": 399,
	"./pl": 400,
	"./pl.js": 400,
	"./pt": 401,
	"./pt-br": 402,
	"./pt-br.js": 402,
	"./pt.js": 401,
	"./ro": 403,
	"./ro.js": 403,
	"./ru": 404,
	"./ru.js": 404,
	"./sd": 405,
	"./sd.js": 405,
	"./se": 406,
	"./se.js": 406,
	"./si": 407,
	"./si.js": 407,
	"./sk": 408,
	"./sk.js": 408,
	"./sl": 409,
	"./sl.js": 409,
	"./sq": 410,
	"./sq.js": 410,
	"./sr": 411,
	"./sr-cyrl": 412,
	"./sr-cyrl.js": 412,
	"./sr.js": 411,
	"./ss": 413,
	"./ss.js": 413,
	"./sv": 414,
	"./sv.js": 414,
	"./sw": 415,
	"./sw.js": 415,
	"./ta": 416,
	"./ta.js": 416,
	"./te": 417,
	"./te.js": 417,
	"./tet": 418,
	"./tet.js": 418,
	"./th": 419,
	"./th.js": 419,
	"./tl-ph": 420,
	"./tl-ph.js": 420,
	"./tlh": 421,
	"./tlh.js": 421,
	"./tr": 422,
	"./tr.js": 422,
	"./tzl": 423,
	"./tzl.js": 423,
	"./tzm": 424,
	"./tzm-latn": 425,
	"./tzm-latn.js": 425,
	"./tzm.js": 424,
	"./uk": 426,
	"./uk.js": 426,
	"./ur": 427,
	"./ur.js": 427,
	"./uz": 428,
	"./uz-latn": 429,
	"./uz-latn.js": 429,
	"./uz.js": 428,
	"./vi": 430,
	"./vi.js": 430,
	"./x-pseudo": 431,
	"./x-pseudo.js": 431,
	"./yo": 432,
	"./yo.js": 432,
	"./zh-cn": 433,
	"./zh-cn.js": 433,
	"./zh-hk": 434,
	"./zh-hk.js": 434,
	"./zh-tw": 435,
	"./zh-tw.js": 435
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 804;

/***/ }),

/***/ 825:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_attendance_list_attendance_list__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_employee_employee_list__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_site_site__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_jobs_jobs__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_reports_reports__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_logout_logout__ = __webpack_require__(484);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Site', component: __WEBPACK_IMPORTED_MODULE_7__pages_site_site__["a" /* SitePage */], active: true, icon: '' },
            { title: 'Employee', component: __WEBPACK_IMPORTED_MODULE_6__pages_employee_employee_list__["a" /* EmployeeList */], active: false, icon: '' },
            { title: 'Jobs', component: __WEBPACK_IMPORTED_MODULE_8__pages_jobs_jobs__["a" /* JobsPage */], active: false, icon: '' },
            { title: 'attendance', component: __WEBPACK_IMPORTED_MODULE_5__pages_attendance_list_attendance_list__["a" /* AttendanceListPage */], active: false, icon: '' },
            { title: 'Reports', component: __WEBPACK_IMPORTED_MODULE_9__pages_reports_reports__["a" /* ReportsPage */], active: false, icon: '' },
            { title: 'Logout', component: __WEBPACK_IMPORTED_MODULE_10__pages_logout_logout__["a" /* LogoutPage */], active: false, icon: '' }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            // this.statusBar.overlaysWebView(true);
            // this.statusBar.backgroundColorByHexString("#25312C");
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].component == page.component) {
                this.pages[i].active = true;
            }
            else {
                this.pages[i].active = false;
            }
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Nav"]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Nav"])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\app\app.html"*/`<ion-menu class="menu-width" [content]="content">\n\n\n\n\n\n  <ion-content>\n\n\n\n    <div class="wrapper bg-clr">\n\n      <div class="sidebar sidebar-right" data-color="orange" data-image="img/sidebar-1.jpg">\n\n        <!--\n\n    Tip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\n\n\n    Tip 2: you can also add an image using data-image tag\n\n  -->\n\n        <div class="logo">\n\n          <p text-center>User</p>\n\n        </div>\n\n        <div class="sidebar-wrapper">\n\n          <ul class="nav">\n\n            <li menuClose *ngFor="let p of pages" (click)="openPage(p)" [ngClass]="{\'active\':p.active}" >\n\n              <a>\n\n                <i class="material-icons">dashboard</i>\n\n                <p>{{p.title}}</p>\n\n              </a>\n\n            </li>\n\n          </ul>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <!--\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        {{p.title}}\n\n      </button>\n\n    </ion-list>-->\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Platform"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 826:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\home\home.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 827:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListPage = (function () {
    function ListPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        // Let's populate this page with some filler content for funzies
        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];
        this.items = [];
        for (var i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }
    ListPage_1 = ListPage;
    ListPage.prototype.itemTapped = function (event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(ListPage_1, {
            item: item
        });
    };
    ListPage = ListPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-list',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\list\list.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n\n      {{item.title}}\n\n      <div class="item-note" item-end>\n\n        {{item.note}}\n\n      </div>\n\n    </button>\n\n  </ion-list>\n\n  <div *ngIf="selectedItem" padding>\n\n    You navigated here from <b>{{selectedItem.title}}</b>\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 828:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendancePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__attendance_popover__ = __webpack_require__(485);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AttendancePage = (function () {
    function AttendancePage(navCtrl, myService, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.myService = myService;
        this.popoverCtrl = popoverCtrl;
    }
    AttendancePage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_3__attendance_popover__["a" /* AttendancePopoverPage */]);
        popover.present({
            ev: myEvent
        });
    };
    AttendancePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Attendance');
        this.empID = window.localStorage.getItem('employeeId');
        console.log('Employ id:' + this.empID);
    };
    AttendancePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\attendance\attendance.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <div class="row">\n\n    <ion-col col-11 class="margin-auto">\n\n      <div class="card">\n\n        <div class="card-header border-bottom padding-left-right0">\n\n          <p class="category display-inline">Name</p>\n\n          <button ion-button icon-left icon-only clear (click)="presentPopover($event)" class="pop-icon">\n\n            <ion-icon name="more"></ion-icon>\n\n          </button>\n\n        </div>\n\n        <div class="card-content">\n\n          <ion-row class="margin0">\n\n            <ion-col col-9 class="ver-center">\n\n              <h3 class="title">Sitename</h3>\n\n            </ion-col>\n\n            <ion-col col-3>\n\n              <ion-item class="remove">\n\n                <ion-avatar item-left>\n\n                  <img src="img/faces/marc.jpg" width="10%">\n\n                </ion-avatar>\n\n              </ion-item>\n\n            </ion-col>\n\n          </ion-row>\n\n        </div>\n\n        <div class="card-footer">\n\n          <ion-row class="margin0">\n\n            <ion-col col-6>\n\n              <p class="title margin0 primary-clr">In:</p>\n\n            </ion-col>\n\n            <ion-col col-6>\n\n              <p class="primary-clr title margin0">Out:</p>\n\n            </ion-col>\n\n          </ion-row>\n\n        </div>\n\n      </div>\n\n    </ion-col>\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\attendance\attendance.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], AttendancePage);
    return AttendancePage;
}());

//# sourceMappingURL=attendance.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__ = __webpack_require__(85);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EmployeeList = (function () {
    function EmployeeList(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
        this.geolocation.getCurrentPosition().then(function (response) {
            console.log("Current location");
            console.log(response);
            _this.lattitude = response.coords.latitude;
            _this.longitude = response.coords.longitude;
        }).catch(function (error) {
            console.log("error in getting current location");
            _this.lattitude = 12.946227;
            _this.longitude = 80.241741;
        });
        this.site = this.navParams.get('site');
        this.geoFence.initialize().then(function () {
            console.log('Geo fence ready');
        }, function (err) {
            console.log("Error in initializing geo fence");
            console.log(err);
        });
    }
    EmployeeList.prototype.viewList = function (i) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */]);
    };
    EmployeeList.prototype.showSuccessToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    EmployeeList.prototype.getAttendances = function (site) {
        var _this = this;
        this.authService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeList.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    EmployeeList.prototype.getEmployeeAttendance = function (employeeId) {
        var _this = this;
        this.authService.getAttendances(employeeId).subscribe(function (response) {
            console.log(response);
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeList.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.authService.searchSiteEmployee(this.site.id).subscribe(function (response) {
            console.log(response.json());
            _this.employeeList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            var _loop_1 = function (employee) {
                _this.authService.getAttendances(employee.id).subscribe(function (response) {
                    console.log(response.json());
                    var result = response.json();
                    if (result[0]) {
                        console.log("already checked in ");
                        employee.checkedIn = true;
                        employee.attendanceId = result[0].id;
                    }
                    else {
                        console.log("Not yet checked in ");
                        employee.checkedIn = false;
                    }
                });
            };
            for (var _i = 0, _a = _this.employeeList; _i < _a.length; _i++) {
                var employee = _a[_i];
                _loop_1(employee);
            }
        });
    };
    EmployeeList.prototype.isEmployeeCheckedIn = function (employeeId) {
        var _this = this;
        this.authService.getAttendances(employeeId).subscribe(function (response) {
            console.log(response.json());
            var result = response.json();
            if (result[0]) {
                console.log("already checked in ");
                _this.checkedIn = true;
            }
            else {
                console.log("Not yet checked in ");
                _this.checkedIn = false;
            }
        });
    };
    EmployeeList.prototype.viewCamera = function (employee, mode, attendanceMode) {
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            var loader = _this.loadingCtrl.create({
                content: ''
            });
            loader.present();
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            var employeeName = employee.fullName + employee.empId;
            // this.geolocation.getCurrentPosition().then((response)=>{
            //   console.log("Current location");
            //   console.log(response);
            //   this.lattitude = response.coords.latitude;
            //   this.longitude = response.coords.longitude;
            //   this.authService.checkSiteProximity(this.site.id,this.lattitude,this.longitude).subscribe(
            //     response=>{
            //       console.log(response.json());
            _this.authService.detectFace(_this.employeeFullName, imageData).subscribe(function (response) {
                console.log("response in site list");
                console.log(response.json());
                var detectResponse = response.json();
                if (detectResponse.images && detectResponse.images[0].status === 'Complete') {
                    if (mode === 'enroll') {
                        _this.authService.enrollFace(employeeName, imageData).subscribe(function (response) {
                            console.log("Face verification response");
                            console.log(response.json());
                            var verificationResponse = response.json();
                            loader.dismiss();
                            var msg = 'Face enrolled Successfully';
                            _this.showSuccessToast(msg);
                        }, function (error) {
                            loader.dismiss();
                            console.log("Error");
                            console.log(error);
                        });
                    }
                    else {
                        if (attendanceMode == 'checkIn') {
                            _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                console.log("Face verification response");
                                console.log(response.json());
                                var verificationResponse = response.json();
                                if (verificationResponse && verificationResponse.images) {
                                    if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                        console.log(_this.lattitude);
                                        console.log(_this.longitude);
                                        _this.authService.markAttendanceCheckIn(_this.site.id, employee.empId, _this.lattitude, _this.longitude, imageData).subscribe(function (response) {
                                            console.log(response.json());
                                            loader.dismiss();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            loader.dismiss();
                                        });
                                    }
                                }
                                else {
                                    loader.dismiss();
                                    var msg = "Unable to verify face, please try again";
                                    _this.showSuccessToast(msg);
                                }
                            }, function (error) {
                                loader.dismiss();
                                var msg = "Unable to verify face, please try again";
                                _this.showSuccessToast(msg);
                            });
                        }
                        else {
                            _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                console.log("Face verification response");
                                console.log(response.json());
                                var verificationResponse = response.json();
                                if (verificationResponse && verificationResponse.images) {
                                    if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                        console.log(_this.lattitude);
                                        console.log(_this.longitude);
                                        _this.authService.markAttendanceCheckOut(_this.site.id, employee.empId, _this.lattitude, _this.longitude, imageData, employee.attendanceId).subscribe(function (response) {
                                            console.log(response.json());
                                            loader.dismiss();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            loader.dismiss();
                                        });
                                    }
                                }
                                else {
                                    loader.dismiss();
                                    var msg = "Unable to verify face, please try again";
                                    _this.showSuccessToast(msg);
                                }
                            }, function (error) {
                                loader.dismiss();
                                var msg = "Unable to verify face, please try again";
                                _this.showSuccessToast(msg);
                            });
                        }
                    }
                }
                else {
                    console.log("error in detecting face");
                    loader.dismiss();
                    var msg = "Face not Detected, please try again";
                    _this.showSuccessToast(msg);
                }
            }, function (error) {
                console.log("errors");
                console.log(error.json());
                if (error.json().status == "false") {
                    var msg = "You are currently not at the site location";
                    _this.showSuccessToast(msg);
                    loader.dismiss();
                }
            });
            // },error=>{
            //       console.log("errors");
            //       console.log("errors")
            //       console.log(error.json());
            //       if(error.json().status === "false"){
            //         var msg= "You are currently not at the site location";
            //         this.showSuccessToast(msg);
            //         loader.dismiss()
            //       }else{
            //         var msg= "You are currently not at the site location";
            //         this.showSuccessToast(msg);
            //         loader.dismiss()
            //       }
            //     });
            //
            // }).catch((error)=>{
            //
            //   console.log("Location error")
            //   this.lattitude = 0;
            //   this.longitude = 0;
            //
            //   var msg= "Unable to get location";
            //   this.showSuccessToast(msg);
            //   loader.dismiss()
            // })
            // this.navCtrl.push(AttendanceViewPage,imageData)
        }, function (err) {
            console.log("Location error");
            _this.lattitude = 0;
            _this.longitude = 0;
            var msg = "Unable to get location";
            _this.showSuccessToast(msg);
        });
    };
    EmployeeList = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-employee-list',template:/*ion-inline-start:"D:\workspace\timesheet-mobile\src\pages\employee\employee-list.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Employee List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list>\n\n    <ion-item *ngFor="let employee of employeeList;let i of index" class="bottom-border" >\n\n\n\n      <p (click)="getEmployeeAttendance(employee.id)"  >{{employee.fullName}}\n\n        <span style="float: right">\n\n          <button ion-button  (click)="viewCamera(employee,\'enroll\')"  >Enroll</button>\n\n          <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkIn\')" *ngIf="!employee.checkedIn" >Check - In</button>\n\n          <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkOut\')" *ngIf="employee.checkedIn">Check - Out</button>\n\n        </span></p>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\workspace\timesheet-mobile\src\pages\employee\employee-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__["a" /* Geofence */]])
    ], EmployeeList);
    return EmployeeList;
}());

//# sourceMappingURL=employee-list.js.map

/***/ })

},[489]);
//# sourceMappingURL=main.js.map