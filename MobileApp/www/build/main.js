webpackJsonp([5],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__view_job__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__completeJob__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_jobService__ = __webpack_require__(40);
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
    function JobsPage(navCtrl, component, authService, loadingCtrl, actionSheetCtrl, jobService, events) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.component = component;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.jobService = jobService;
        this.events = events;
        this.all = "all";
        this.today = "today";
        this.ref = false;
        this.count = 0;
        this.categories = 'today';
        this.loadTodaysJobs();
        this.events.subscribe('userType', function (type) {
            console.log("User type event");
            console.log(type);
            _this.userType = type;
        });
    }
    JobsPage.prototype.ionViewDidLoad = function () {
    };
    JobsPage.prototype.doRefresh = function (refresher, segment) {
        this.ref = true;
        if (segment == "today") {
            this.getTodaysJobs(this.ref);
            refresher.complete();
        }
        else if (segment == "all") {
            console.log("------------- segment attandance");
            this.getAllJobs(this.ref);
            refresher.complete();
        }
    };
    JobsPage.prototype.getTodaysJobs = function (ref) {
        if (this.todaysJobs) {
            if (ref) {
                this.loadTodaysJobs();
            }
            else {
                this.todaysJobs = this.todaysJobs;
            }
        }
        else {
            this.loadTodaysJobs();
        }
    };
    JobsPage.prototype.getAllJobs = function (ref) {
        if (this.allJobs) {
            if (ref) {
                this.loadAllJobs();
            }
            else {
                this.allJobs = this.allJobs;
            }
        }
        else {
            this.loadAllJobs();
        }
    };
    JobsPage.prototype.loadTodaysJobs = function () {
        var _this = this;
        this.component.showLoader('Getting Today\'s Jobs');
        this.jobService.getTodayJobs().subscribe(function (response) {
            console.log("Todays jobs of current user");
            console.log(response);
            _this.todaysJobs = response;
            _this.component.closeLoader();
        }, function (err) {
            _this.component.closeLoader();
            _this.component.showToastMessage('Unable to fetch todays jobs', 'bottom');
        });
    };
    JobsPage.prototype.loadAllJobs = function () {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        var search = {};
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("All jobs of current user");
            console.log(response);
            _this.allJobs = response;
            _this.component.closeLoader();
        }, function (err) {
            _this.component.closeLoader();
            _this.component.showToastMessage('Unable to fetch Jobs', 'bottom');
        });
    };
    JobsPage.prototype.addJob = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__add_job__["a" /* CreateJobPage */]);
    };
    JobsPage.prototype.viewJob = function (job) {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__view_job__["a" /* ViewJobPage */], { job: job });
    };
    JobsPage.prototype.compeleteJob = function (job) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__completeJob__["a" /* CompleteJobPage */], { job: job });
    };
    JobsPage.prototype.open = function (itemSlide, item, c) {
        this.count = c;
        if (c == 1) {
            this.count = 0;
            console.log('------------:' + this.count);
            this.close(itemSlide);
        }
        else {
            this.count = 1;
            console.log('------------:' + this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)");
        }
    };
    JobsPage.prototype.close = function (item) {
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    };
    JobsPage.prototype.presentActionSheet = function (job) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Job',
            buttons: [
                {
                    text: 'View Job',
                    handler: function () {
                        console.log("view job");
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__view_job__["a" /* ViewJobPage */], { job: job });
                    }
                },
                {
                    text: 'Edit job',
                    handler: function () {
                        console.log('edit job');
                    }
                },
                {
                    text: 'Complete Job',
                    handler: function () {
                        console.log('Complete job');
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__completeJob__["a" /* CompleteJobPage */], { job: job });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log("Cancel clicker");
                    }
                }
            ]
        });
        actionSheet.present();
    };
    JobsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-jobs',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/jobs.html"*/`<ion-header no-border>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Jobs</ion-title>\n      <!--<ion-buttons right>-->\n          <!--<button ion-button clear (click)="addJob()" class="add-btn">-->\n              <!--<ion-icon name="add"></ion-icon>-->\n          <!--</button>-->\n      <!--</ion-buttons>-->\n  </ion-navbar>\n        <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="#ff9800">\n            <ion-segment-button value="today" (click)="getTodaysJobs(false)">\n                Today\'s Jobs\n            </ion-segment-button>\n            <ion-segment-button value="jobs" (click)="getAllJobs(false)">\n                All Jobs\n            </ion-segment-button>\n\n        </ion-segment>\n\n\n</ion-header>\n\n<ion-content>\n    <ion-fab bottom right >\n        <button (click)="addJob()" ion-fab><ion-icon name="add"></ion-icon></button>\n    </ion-fab>\n\n    <div [ngSwitch]="categories">\n        <ion-list *ngSwitchCase="\'today\'">\n            <ion-refresher (ionRefresh)="doRefresh($event,today)">\n                <ion-refresher-content></ion-refresher-content>\n            </ion-refresher>\n            <div *ngIf="allJobs?.length<0">\n                <ion-card>\n                    <ion-card-content>\n                        No Jobs\n                    </ion-card-content>\n                </ion-card>\n            </div>\n            <div  class="white-bg" *ngFor="let job of allJobs" >\n\n                <div class="padding-left16 padding-top5">\n                    <ion-row class="margin0">\n\n                        <ion-col col-2 class="ver-center">\n                            <button ion-button clear color="primary" class="icon-round"\n                                    [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n                            </button>\n                        </ion-col>\n                        <ion-col col-7 class="padding-left5">\n                            <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n                                <p text-left class="margin0">{{job.title}}</p>\n                                <p text-left class="margin0">{{job.employeeName}}</p>\n                                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n                            </div>\n                        </ion-col>\n                        <ion-col col-2 class="padding-left0 ver-center">\n                            <div class="padding-bottom5">\n                                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n                                    <i class="material-icons">more_horiz</i>\n                                </button>\n                            </div>\n                        </ion-col>\n                        <!--\n                        <ion-col col-1>\n                            <p (click)="open(ItemSliding,Item)">f</p>\n                        </ion-col>\n                        -->\n\n                    </ion-row>\n                </div>\n                <ion-item-sliding #slidingItem>\n\n                    <ion-item #item class="item-fnt padding-left0" >\n                        <!--<div class="padding-left16">-->\n\n                        <div text-capitalize >\n                            <ion-row class="margin0">\n                                <ion-col col-6 class="padding-right5">\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                </ion-col>\n                                <ion-col col-6>\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                </ion-col>\n                            </ion-row>\n                        </div>\n                        <!--</div>-->\n                    </ion-item>\n\n                    <ion-item-options (click)="close(slidingItem)">\n                        <div>\n                            <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n                        </div>\n                        <!--<div *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'">-->\n                            <!--<button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>-->\n                        <!--</div>-->\n                        <div >\n                            <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n                        </div>\n                        <div *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'">\n                            <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n                        </div>\n                    </ion-item-options>\n                </ion-item-sliding>\n\n            </div>\n\n\n\n            <!--\n                <div class="card" *ngFor="let job of todaysJobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                    <div class="card-content padding-bottom0" >\n                        <ion-row class="margin0">\n                            <ion-col col-12 class="padding-right0">\n                                <button ion-button icon-left icon-only clear class="pop-icon" (click)="presentActionSheet(job)">\n                                    <ion-icon name="ios-more" class="fnt-12 padding0"></ion-icon>\n                                </button>\n                            </ion-col>\n                        </ion-row>\n                        <ion-row class="margin0">\n                            <ion-col col-7 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n                            <ion-col col-5 class="padding-right0">\n                                <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n                                    {{job.status}}\n                                </p>\n                            </ion-col>\n                        </ion-row>\n                        <p>{{job.employeeName}}</p>\n                        <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n                    </div>\n\n\n                    <div class="card-footer">\n                        <div *ngIf="job.status !=\'COMPLETED\'">\n                            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                        </div>\n                        <div *ngIf="job.status ==\'COMPLETED\'">\n                            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                        </div>\n                        <div class="stats align-right">\n                            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n\n        </ion-list>\n        <ion-list *ngSwitchCase="\'jobs\'">\n\n            <ion-refresher (ionRefresh)="doRefresh($event,all)">\n                <ion-refresher-content></ion-refresher-content>\n            </ion-refresher>\n\n            <div  class="white-bg" *ngFor="let job of allJobs" >\n                <div class="padding-left16 padding-top5">\n                <ion-row class="margin0">\n\n                    <ion-col col-2 class="ver-center">\n                        <button ion-button clear color="primary" class="icon-round"\n                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n                        </button>\n                    </ion-col>\n                    <ion-col col-8 class="padding-left5">\n                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n                            <p text-left class="margin0">{{job.title}}</p>\n                            <p text-left class="margin0">{{job.employeeName}}</p>\n                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n                        </div>\n                    </ion-col>\n                    <ion-col col-2 class="padding-left0 ver-center">\n                        <div class="padding-bottom5">\n                            <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n                                <i class="material-icons">more_horiz</i>\n                            </button>\n                        </div>\n                    </ion-col>\n                    <!--\n                    <ion-col col-1>\n                        <p (click)="open(ItemSliding,Item)">f</p>\n                    </ion-col>\n                    -->\n\n                </ion-row>\n                </div>\n            <ion-item-sliding #slidingItem>\n\n                <ion-item #item class="item-fnt padding-left0" >\n                    <!--<div class="padding-left16">-->\n\n                        <div text-capitalize >\n                            <ion-row class="margin0">\n                                <ion-col col-6 class="padding-right5">\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                </ion-col>\n                                <ion-col col-6>\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                    </div>\n                                </ion-col>\n                            </ion-row>\n                        </div>\n                    <!--</div>-->\n                </ion-item>\n\n                <ion-item-options (click)="close(slidingItem)">\n                    <div>\n                        <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n                    </div>\n                    <!--<div>-->\n                        <!--<button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>-->\n                    <!--</div>-->\n                    <div>\n                        <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n                    </div>\n                    <div>\n                        <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n                    </div>\n                </ion-item-options>\n            </ion-item-sliding>\n\n        </div>\n\n            <!--\n            <div class="card" *ngFor="let job of allJobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                    <div class="card-content padding-bottom0" >\n                        <ion-row class="margin0">\n                            <ion-col col-12 class="padding-right0">\n                                <button ion-button icon-left icon-only clear class="pop-icon" (click)="presentActionSheet(job)">\n                                    <ion-icon name="ios-more" class="fnt-12 padding0"></ion-icon>\n                                </button>\n                            </ion-col>\n                        </ion-row>\n                        <ion-row class="margin0">\n                            <ion-col col-7 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n                            <ion-col col-5 class="padding-right0">\n                                <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n                                    {{job.status}}\n                                </p>\n                            </ion-col>\n                        </ion-row>\n                        <p>{{job.employeeName}}</p>\n                        <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n                    </div>\n\n                    <div class="card-footer">\n                        <div *ngIf="job.status !=\'COMPLETED\'">\n                            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                        </div>\n                        <div *ngIf="job.status ==\'COMPLETED\'">\n                            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                        </div>\n                        <div class="stats align-right">\n                            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n                        <!--</div>-->\n                    <!--</div>-->\n                <!--</div>-->\n\n\n        </ion-list>\n\n    </div>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/jobs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ActionSheetController"], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], JobsPage);
    return JobsPage;
}());

//# sourceMappingURL=jobs.js.map

/***/ }),

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApprovedQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__viewQuotation__ = __webpack_require__(77);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ApprovedQuotationPage = (function () {
    function ApprovedQuotationPage(navCtrl, popoverCtrl, authService, navParams) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.navParams = navParams;
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }
    ApprovedQuotationPage.prototype.viewQuotation = function (quotation) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__viewQuotation__["a" /* ViewQuotationPage */], { quotationDetails: quotation });
    };
    ApprovedQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-approved-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/approvedQuotations.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Approved </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n    <ion-list>\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n            <p text-left>{{quotation.title}}</p>\n        </ion-item>\n    </ion-list>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/approvedQuotations.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], ApprovedQuotationPage);
    return ApprovedQuotationPage;
}());

//# sourceMappingURL=approvedQuotations.js.map

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArchivedQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__viewQuotation__ = __webpack_require__(77);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ArchivedQuotationPage = (function () {
    function ArchivedQuotationPage(navCtrl, popoverCtrl, authService, navParams) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.navParams = navParams;
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }
    ArchivedQuotationPage.prototype.viewQuotation = function (quotation) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__viewQuotation__["a" /* ViewQuotationPage */], { quotationDetails: quotation });
    };
    ArchivedQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-archived-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/archivedQuotations.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Archived</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-list>\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n            <p text-left>{{quotation.title}}</p>\n        </ion-item>\n    </ion-list>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/archivedQuotations.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], ArchivedQuotationPage);
    return ArchivedQuotationPage;
}());

//# sourceMappingURL=archivedQuotations.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraftedQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__viewQuotation__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DraftedQuotationPage = (function () {
    function DraftedQuotationPage(navCtrl, popoverCtrl, authService, navParams, componentService) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.navParams = navParams;
        this.componentService = componentService;
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }
    DraftedQuotationPage.prototype.viewQuotation = function (quotation) {
        console.log(quotation);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__viewQuotation__["a" /* ViewQuotationPage */], { quotationDetails: quotation });
    };
    DraftedQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-drafted-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/draftedQuotations.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Drafts </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-list>\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n            <p text-left>{{quotation.title}}</p>\n        </ion-item>\n    </ion-list>\n</ion-content>\n\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/draftedQuotations.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */]])
    ], DraftedQuotationPage);
    return DraftedQuotationPage;
}());

//# sourceMappingURL=draftedQuotations.js.map

/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmittedQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__viewQuotation__ = __webpack_require__(77);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SubmittedQuotationPage = (function () {
    function SubmittedQuotationPage(navCtrl, popoverCtrl, authService, navParams) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.navParams = navParams;
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }
    SubmittedQuotationPage.prototype.viewQuotation = function (quotation) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__viewQuotation__["a" /* ViewQuotationPage */], { quotationDetails: quotation });
    };
    SubmittedQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-submitted-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/submittedQuotations.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Sent </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <ion-list>\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n            <p text-left>{{quotation.title}}</p>\n        </ion-item>\n    </ion-list>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/submittedQuotations.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], SubmittedQuotationPage);
    return SubmittedQuotationPage;
}());

//# sourceMappingURL=submittedQuotations.js.map

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return authService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Created by admin on 12/26/2017.
 */






var authService = (function () {
    function authService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
        this.kairosResponse = {
            status: String,
            headers: String,
            responseText: String
        };
    }
    // Kairos Api Calls
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
    authService.prototype.login = function (username, password) {
        return this.https.post(this.config.Url + 'api/auth/' + username + '/' + password, { username: username, password: password }).map(function (response) {
            return response;
        });
    };
    authService.prototype.getClientDetails = function (id) {
        return this.http.get(this.config.Url + 'api/project/' + id).map(function (response) {
            console.log(response);
            return response;
        });
    };
    authService.prototype.userRolePermissions = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/userRolePermission/search', searchCriteria).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    authService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], authService);
    return authService;
}());

//# sourceMappingURL=authService.js.map

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__customer_detail_customer_detail__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__employee_list_employee_list__ = __webpack_require__(161);
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
    function TabsPage(events) {
        var _this = this;
        this.events = events;
        this.DashboardTab = __WEBPACK_IMPORTED_MODULE_2__dashboard_dashboard__["a" /* DashboardPage */];
        this.QuotationTab = __WEBPACK_IMPORTED_MODULE_3__quotation_quotation__["a" /* QuotationPage */];
        this.CustomerDetailTab = __WEBPACK_IMPORTED_MODULE_4__customer_detail_customer_detail__["a" /* CustomerDetailPage */];
        this.EmployeeListTab = __WEBPACK_IMPORTED_MODULE_5__employee_list_employee_list__["a" /* EmployeeListPage */];
        this.events.subscribe('userType', function (type) {
            console.log(type);
            _this.userType = type;
        });
    }
    TabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TabsPage');
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-tabs',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/tabs/tabs.html"*/`<ion-tabs  tabsPlacement="bottom" color="primary">\n  <ion-tab tabTitle="Dashboard" [root]="DashboardTab"  tabIcon="ios-podium-outline" tabsHideOnSubPages="true"></ion-tab>\n  <ion-tab tabTitle="Quotation" [root]="QuotationTab"  tabIcon="md-paper" tabsHideOnSubPages="true"></ion-tab>\n  <ion-tab tabTitle="Employee" [root]="EmployeeListTab" *ngIf="userType === \'ADMIN\' || userType === \'CLIENT\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'"  tabIcon="list-box" tabsHideOnSubPages="true"></ion-tab>\n</ion-tabs>\n\n\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateRateCardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_quotationService__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CreateRateCardPage = (function () {
    function CreateRateCardPage(navCtrl, navParams, authService, loadingCtrl, quotationService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.quotationService = quotationService;
        this.rateCardDetails = {
            type: '',
            title: '',
            cost: '',
            uom: ''
        };
    }
    CreateRateCardPage.prototype.ionViewDidLoad = function () {
    };
    CreateRateCardPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.quotationService.getRateCardTypes().subscribe(function (response) {
            console.log("Rate Card types");
            console.log(response);
            _this.rateCardTypes = response;
        });
    };
    CreateRateCardPage.prototype.createRateCard = function (rateCard) {
        var _this = this;
        if (this.rateCardDetails.title && this.rateCardDetails.cost) {
            rateCard.uom = this.uom;
            this.quotationService.createRateCard(rateCard).subscribe(function (response) {
                console.log(response);
                _this.navCtrl.pop();
            });
        }
        else {
            if (!this.rateCardDetails.title) {
                this.eMsg = "title";
                this.field = "title";
            }
            else if (!this.rateCardDetails.cost) {
                this.eMsg = "title";
                this.field = "cost";
            }
            else if (!this.rateCardDetails.title && !this.rateCardDetails.cost) {
                this.eMsg = "all";
            }
        }
    };
    CreateRateCardPage.prototype.rateCardUOM = function (rateCardType) {
        this.uom = rateCardType;
        console.log("Rate Card types");
        console.log(this.uom);
    };
    CreateRateCardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-create-rate-card',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/rate-card/create-rate-card.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Create Rate Card</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n    <div class="row">\n        <div class="col-md-8">\n            <div class="card">\n                <div class="card-content">\n                        <ion-row>\n                            <ion-col col-12>\n                                <ion-list radio-group  [(ngModel)]="rateCardDetails.type" class="margin0">\n                                    <ion-item *ngFor="let type of rateCardTypes" class="padding-left0 inline-block width50" no-lines>\n                                        <ion-label class="radio-label">{{type.name}}</ion-label>\n                                        <ion-radio  value={{type.name}} (ionSelect)="rateCardUOM(type.uom)"></ion-radio>\n                                    </ion-item>\n                                </ion-list>\n                            </ion-col>\n\n                            <ion-col col-12>\n\n                                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n                                    <label class="control-label">Title</label>\n                                    <input class="form-control" type="text" [(ngModel)]="rateCardDetails.title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n                                    <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n                                    </div>\n\n                                    <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n                                    </div>\n                                </div>\n\n\n                            </ion-col>\n\n                            <ion-col col-12>\n                                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n                                    <label class="control-label">Cost</label>\n                                    <input class="form-control" type="number" [(ngModel)]="rateCardDetails.cost" id="cost" name="cost" #cst="ngModel" required [ngClass]="{\'has-error\': cst.errors || eMsg==\'all\'|| eMsg==\'cost\'}">\n                                    <div *ngIf="cst.errors && (cst.dirty || cst.touched)" class="error-msg">\n\n                                    </div>\n\n                                    <div *ngIf="cst.errors && (cst.untouched )" class="error-msg">\n\n                                    </div>\n                                </div>\n\n                            </ion-col>\n\n                            <ion-col col-12>\n                                <div class="form-group ">\n                                    <label class="control-label" *ngIf="uom">UOM</label>\n                                    <input type="text" class="form-control" placeholder="UOM" [(ngModel)]="uom" disabled>\n                                </div>\n                            </ion-col>\n                            <button class="btn btn-warning pull-right margin-auto" (click)="createRateCard(rateCardDetails)" >Create</button>\n                            <div class="clearfix"></div>\n                        </ion-row>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/rate-card/create-rate-card.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_3__service_quotationService__["a" /* QuotationService */]])
    ], CreateRateCardPage);
    return CreateRateCardPage;
}());

//# sourceMappingURL=create-rate-card.js.map

/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateJobPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var CreateJobPage = (function () {
    function CreateJobPage(navCtrl, component, navParams, myService, authService, loadingCtrl, jobService, attendanceService, siteService) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.navParams = navParams;
        this.myService = myService;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.jobService = jobService;
        this.attendanceService = attendanceService;
        this.siteService = siteService;
        this.jobDetails = this.navParams.get('job');
        this.jobService.loadCheckLists().subscribe(function (response) {
            console.log(response);
        });
        this.empPlace = "Employee";
    }
    CreateJobPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.empSelect = true;
        this.component.showLoader('Getting All Sites');
        this.siteService.searchSite().subscribe(function (response) {
            console.log('ionViewDidLoad Add jobs');
            console.log(response.json());
            _this.sites = response.json();
            _this.component.closeLoader();
        }, function (error) {
            console.log('ionViewDidLoad SitePage:' + error);
        });
    };
    CreateJobPage.prototype.addJob = function () {
        var _this = this;
        if (this.title && this.description && this.siteName && this.employ && this.startDate && this.startTime && this.endDate && this.endTime) {
            this.siteId = window.localStorage.getItem('site');
            console.log(this.siteId);
            var sDate = __WEBPACK_IMPORTED_MODULE_3_moment__(this.startDate).format("MM/DD/YYYY");
            var sTime = __WEBPACK_IMPORTED_MODULE_3_moment__(this.startTime).format("hh:mm A");
            var startDateTimeMoment = __WEBPACK_IMPORTED_MODULE_3_moment__(sDate + ' ' + sTime, "MM/DD/YYYY hh:mm A");
            var eDate = __WEBPACK_IMPORTED_MODULE_3_moment__(this.endDate).format("MM/DD/YYYY");
            var eTime = __WEBPACK_IMPORTED_MODULE_3_moment__(this.endTime).format("hh:mm A");
            var endDateTimeMoment = __WEBPACK_IMPORTED_MODULE_3_moment__(eDate + ' ' + eTime, "MM/DD/YYYY hh:mm A");
            this.plannedStartTime = startDateTimeMoment.toDate();
            this.plannedStartTime = this.plannedStartTime.toISOString();
            this.plannedEndTime = endDateTimeMoment.toDate().toISOString();
            this.plannedHours = 2;
            this.userId = localStorage.getItem('employeeUserId');
            this.newJob = {
                "title": this.title,
                "description": this.description,
                "plannedStartTime": this.plannedStartTime,
                "plannedEndTime": this.plannedEndTime,
                "plannedHours": this.plannedHours,
                "jobStatus": "ASSIGNED",
                "comments": "test",
                "siteId": this.siteId,
                "employeeId": this.employ,
                "userId": this.userId,
                "locationId": 1
            };
            this.jobService.createJob(this.newJob).subscribe(function (response) {
                console.log(response);
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__jobs__["a" /* JobsPage */]);
            }, function (error) {
                console.log(error);
            });
        }
        else {
            console.log("============else");
            if (!this.title) {
                console.log("============title");
                this.eMsg = "title";
                this.field = "title";
            }
            else if (!this.description) {
                console.log("============desc");
                this.eMsg = "description";
                this.field = "description";
            }
            else if (!this.siteName) {
                console.log("============site");
                this.eMsg = "siteName";
                this.field = "siteName";
            }
            else if (!this.employ) {
                console.log("============employ");
                this.eMsg = "employ";
                this.field = "employ";
            }
            else if (!this.startDate) {
                console.log("============sdate");
                this.eMsg = "startDate";
                this.field = "startDate";
            }
            else if (!this.startTime) {
                console.log("============stime");
                this.eMsg = "startTime";
                this.field = "startTime";
            }
            else if (!this.endDate) {
                console.log("============edate");
                this.eMsg = "endDate";
                this.field = "endDate";
            }
            else if (!this.endTime) {
                console.log("============etime");
                this.eMsg = "endTime";
                this.field = "endTime";
            }
            else if (!this.title && !this.description && !this.siteName && !this.employ && !this.startDate && !this.startTime && !this.endDate && !this.endTime) {
                console.log("============all");
                this.eMsg = "all";
            }
        }
    };
    CreateJobPage.prototype.getEmployee = function (id) {
        var _this = this;
        if (id) {
            console.log('ionViewDidLoad Add jobs employee');
            window.localStorage.setItem('site', id);
            console.log(this.empSelect);
            this.siteService.searchSiteEmployee(id).subscribe(function (response) {
                console.log(response.json());
                if (response.json().length !== 0) {
                    _this.empSelect = false;
                    _this.empPlace = "Employee";
                    _this.employee = response.json();
                    console.log(_this.employee);
                }
                else {
                    _this.empSelect = true;
                    _this.empPlace = "No Employee";
                    _this.employee = [];
                }
            }, function (error) {
                console.log(error);
                console.log(_this.employee);
            });
        }
        else {
            this.employee = [];
        }
    };
    CreateJobPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-add-job',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/add-job.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Jobs</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <div class="row">\n        <div class="col-md-8">\n            <div class="card">\n                <div class="card-content">\n                    <ion-row>\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n                                <label class="control-label">Title</label>\n                                <input class="form-control" type="text" [(ngModel)]="title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n                                <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n                        </ion-col>\n\n                        <ion-col col-12>\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'description\'}">\n                                <label class="control-label">Description</label>\n                                <input class="form-control" type="text" [(ngModel)]="description" id="description" name="title" #desc="ngModel" required [ngClass]="{\'has-error\': desc.errors || eMsg==\'all\'|| eMsg==\'description\'}">\n                                <div *ngIf="desc.errors && (desc.dirty || desc.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="desc.errors && (desc.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n                        </ion-col>\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'siteName\'}">\n                                <label class="control-label" *ngIf="!site.errors">Site</label>\n\n                                <ion-select [(ngModel)]="siteName" class="select-box" id="siteName" placeholder="Choose Site" name="siteName" #site="ngModel" required [ngClass]="{\'has-error\': site.errors || eMsg==\'all\'|| eMsg==\'siteName\'}">\n                                    <ion-option *ngFor="let site of sites" [value]="site.name" (ionSelect)="getEmployee(site.id)">{{site.name}}</ion-option>\n                                </ion-select>\n\n                                <div *ngIf="site.errors && (site.dirty || site.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="site.errors && (site.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n\n                        </ion-col>\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'siteName\'}">\n                                <label class="control-label" *ngIf="empSelect">Employee</label>\n                                    <ion-select [(ngModel)]="employ" [disabled]="empSelect" class="select-box" id="employ" name="employ" [placeholder]="empPlace" #emp="ngModel" required [ngClass]="{\'has-error\': emp.errors || eMsg==\'all\'|| eMsg==\'employ\'}">\n                                        <ion-option  *ngFor="let emp of employee" [value]="emp.id" >{{emp.fullName}}</ion-option>\n                                    </ion-select>\n\n                                <div *ngIf="emp.errors && (emp.dirty || emp.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="emp.errors && (emp.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n                            <!--\n                            <div class="form-group label-floating">\n                                <label class="control-label">Employee</label>\n                                <ion-select [(ngModel)]="employ" [disabled]="empSelect" class="select-box">\n                                    <ion-option *ngFor="let emp of employee" [value]="emp.id" >{{emp.fullName}}</ion-option>\n                                </ion-select>\n                                <span *ngIf="field===\'employ\' && errorMsg" class="error">{{errorMsg}}</span>\n                            </div>\n                            -->\n                        </ion-col>\n\n                        <ion-col col-12>\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'startDate\'}">\n                                <label class="control-label" *ngIf="!sDate.errors">Start Date</label>\n\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" placeholder="Select Date" [(ngModel)]="startDate" id="startDate" name="startDate" #sDate="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'startDate\'}"></ion-datetime>\n\n                                <div *ngIf="sDate.errors && (sDate.dirty || sDate.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="sDate.errors && (sDate.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n\n                            <!--\n                            <div class="form-group label-floating">\n                                <label class="control-label">Start Date</label>\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" [(ngModel)]="startDate"></ion-datetime>\n                                <span *ngIf="field===\'startDate\' && errorMsg" class="error">{{errorMsg}}</span>\n                            </div>\n                            -->\n                        </ion-col>\n                        <ion-col col-12>\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'startTime\'}">\n                                <label class="control-label" *ngIf="!sTime.errors">Start Time</label>\n\n                                <ion-datetime displayFormat="hh:mm a" class="form-control" [(ngModel)]="startTime" id="startTime" placeholder="Select Time" name="startTime" #sTime="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'startTime\'}"></ion-datetime>\n\n                                <div *ngIf="sTime.errors && (sTime.dirty || sTime.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="sTime.errors && (sTime.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n                        </ion-col>\n                        <ion-col col-12>\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'endDate\'}">\n                                <label class="control-label" *ngIf="!eDate.errors">End Time</label>\n\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" [(ngModel)]="endDate" id="endDate" placeholder="End Date" name="endDate" #eDate="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'endDate\'}"></ion-datetime>\n\n                                <div *ngIf="eDate.errors && (eDate.dirty || eDate.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="eDate.errors && (eDate.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n                        </ion-col>\n                        <ion-col col-12>\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'endTime\'}">\n                                <label class="control-label" *ngIf="!eTime.errors">Start Time</label>\n\n                                <ion-datetime displayFormat="hh:mm a" class="form-control" [(ngModel)]="endTime" id="endTime" placeholder="End Time" name="endTime" #eTime="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'endTime\'}"></ion-datetime>\n\n                                <div *ngIf="eTime.errors && (eTime.dirty || eTime.touched)" class="error-msg">\n\n                                </div>\n\n                                <div *ngIf="eTime.errors && (eTime.untouched )" class="error-msg">\n\n                                </div>\n                            </div>\n\n\n                        </ion-col>\n\n                        <button type="submit" class="btn btn-warning pull-right margin-auto" (click)="addJob()">Add</button>\n\n                        <div class="clearfix"></div>\n                    </ion-row>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/add-job.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_6__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_8__service_siteService__["a" /* SiteService */]])
    ], CreateJobPage);
    return CreateJobPage;
}());

//# sourceMappingURL=add-job.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompleteJobPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__job_popover__ = __webpack_require__(462);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var CompleteJobPage = (function () {
    function CompleteJobPage(navCtrl, navParams, authService, loadingCtrl, camera, geolocation, jobService, attendanceService, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.camera = camera;
        this.geolocation = geolocation;
        this.jobService = jobService;
        this.attendanceService = attendanceService;
        this.popoverCtrl = popoverCtrl;
        this.jobDetails = this.navParams.get('job');
        this.takenImages = [];
        this.checkOutDetails = {
            employeeId: '',
            employeeEmpId: '',
            projectId: '',
            siteId: '',
            jobId: '',
            latitudeOut: '',
            longitude: ''
        };
        /*
        this.jobService.loadCheckLists().subscribe(
            response=>{
                console.log("Checklist items");
                console.log(response[0].items);
                this.checkList = response[0].items;
            }
        )
        */
    }
    CompleteJobPage.prototype.ionViewDidLoad = function () {
        console.log(this.jobDetails);
        console.log(this.jobDetails.checklistItems);
    };
    CompleteJobPage.prototype.viewImage = function (index, img) {
        var _this = this;
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_8__job_popover__["a" /* JobPopoverPage */], { i: img, ind: index }, { cssClass: 'view-img', showBackdrop: true });
        popover.present({});
        popover.onDidDismiss(function (data) {
            _this.takenImages.pop(data);
        });
    };
    CompleteJobPage.prototype.viewCamera = function (status, job) {
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.NATIVE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            console.log(imageData);
            _this.takenImages.push(imageData);
        });
    };
    CompleteJobPage.prototype.completeJob = function (job, takenImages) {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (response) {
            console.log("Current location");
            console.log(response);
            _this.latitude = response.coords.latitude;
            _this.longitude = response.coords.longitude;
        }).catch(function (error) {
            _this.latitude = 0;
            _this.longitude = 0;
        });
        console.log(job);
        this.checkOutDetails.employeeId = window.localStorage.getItem('employeeId');
        this.checkOutDetails.employeeEmpId = window.localStorage.getItem('employeeEmpId');
        this.checkOutDetails.projectId = job.siteProjectId;
        this.checkOutDetails.siteId = job.siteId;
        this.checkOutDetails.jobId = job.id;
        this.checkOutDetails.latitudeOut = this.latitude;
        this.checkOutDetails.longitude = this.longitude;
        console.log(this.checkOutDetails);
        this.jobService.checkOutJob(this.checkOutDetails).subscribe(function (response) {
            console.log(response);
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__jobs__["a" /* JobsPage */]);
            //TODO
            //File Upload after successful checkout
        });
    };
    CompleteJobPage.prototype.changeStatus = function (i) {
        this.sLength = this.jobDetails.checklistItems.length;
        this.count = this.jobDetails.checklistItems.filter(function (data, i) {
            return data.status;
        }).length;
        console.log(this.jobDetails.checklistItems[i].status);
        this.jobDetails.checklistItems[i].status = true;
        console.log("Count:" + this.count);
        console.log("Slength" + this.sLength);
        this.onButton = true;
    };
    CompleteJobPage.prototype.call = function () {
    };
    CompleteJobPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-complete-job',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/completeJob.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Complete Job</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n    <ion-list >\n        <ion-row class="margin0 white-bg padding10">\n            <ion-col col-6 class="label-on-left">Job Id</ion-col>\n            <ion-col col-6>\n                <p text-right>{{jobDetails.id}}</p>\n            </ion-col>\n            <ion-col col-6 class="label-on-left">Name</ion-col>\n            <ion-col col-6>\n                <p text-right>{{jobDetails.title}}</p>\n            </ion-col>\n            <ion-col col-6 class="label-on-left">Status</ion-col>\n            <ion-col col-6>\n                <p text-right>{{jobDetails.status}}</p>\n            </ion-col>\n        </ion-row>\n\n        <div class="margin-tp25 white-bg padding10">\n            <ion-row class="margin0">\n                <ion-col col-6 class="label-on-left">\n                    <p class="line-height">Photo (Before)</p>\n                </ion-col>\n                <ion-col col-6 text-right>\n                    <button class="ion-button" round (click)="viewCamera(\'beforeJob\',jobDetails)" class="camera-btn"><ion-icon name="ios-camera"></ion-icon></button>\n                </ion-col>\n            </ion-row>\n            <ion-row>\n                <ion-col col-3 *ngFor="let image of takenImages;let i of index" class="">\n                    <img [src]="image" class="job-img margin-bottom25" (click)="viewImage(i,image)">\n                </ion-col>\n            </ion-row>\n        </div>\n\n        <ion-row class="margin-tp25 white-bg padding10" >\n            <div *ngIf="jobDetails.checklistItems?.length > 0">\n                <ion-item *ngFor="let list of jobDetails.checklistItems;let i = index">\n                    <ion-label style="color: black">{{list.checklistItemName}}</ion-label>\n                    <ion-checkbox [(ngModel)]="list.status"  (ionChange)="changeStatus(i)" checked="list.status"></ion-checkbox>\n                </ion-item>\n            </div>\n            <div *ngIf="!jobDetails.checklistItems?.length > 0" class="align-center">\n                <p text-center>No Checklist Found</p>\n            </div>\n        </ion-row>\n    </ion-list>\n\n</ion-content>\n\n<ion-footer>\n    <ion-toolbar class="align-center">\n        <button class="btn btn-warning center" (click)="completeJob(jobDetails,takenImages)">\n            complete job\n        </button>\n    </ion-toolbar>\n</ion-footer>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/completeJob.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_6__service_jobService__["a" /* JobService */],
            __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], CompleteJobPage);
    return CompleteJobPage;
}());

//# sourceMappingURL=completeJob.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationPopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_quotationService__ = __webpack_require__(35);
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
    function QuotationPopoverPage(navCtrl, popoverCtrl, authService, viewCtrl, quotationService) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.viewCtrl = viewCtrl;
        this.quotationService = quotationService;
        this.addrates = { type: '', name: '', no: 1, cost: 0, uom: '', total: 0 };
    }
    QuotationPopoverPage.prototype.ionViewWillEnter = function () {
        this.getRateCardTypes();
    };
    QuotationPopoverPage.prototype.getRateCardTypes = function () {
        var _this = this;
        this.quotationService.getRateCardTypes().subscribe(function (response) {
            console.log("Rate Card types");
            _this.rateCardTypes = response;
            console.log(_this.rateCardTypes);
        });
    };
    QuotationPopoverPage.prototype.selectUOMType = function (type) {
        this.selectedType = type.name;
        this.selectedUOM = type.uom;
    };
    QuotationPopoverPage.prototype.addRates = function () {
        if (this.name && this.cost) {
            this.addrates = { type: this.type, name: this.name, no: 1, cost: this.cost, uom: this.selectedUOM, total: this.cost };
            console.log(this.addrates);
            // this.navCtrl.push(CreateQuotationPage2,{rates:this.addrates})
            this.viewCtrl.dismiss(this.addrates);
        }
        else {
            if (!this.name) {
                this.eMsg = "name";
                this.field = "name";
            }
            else if (!this.cost) {
                this.eMsg = "cost";
                this.field = "cost";
            }
        }
    };
    QuotationPopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-quotation-popover',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation-popover.html"*/`<ion-content >\n    <ion-list >\n        <ion-row class="margin0 white-bg padding10">\n            <ion-col col-12>\n                <div class="form-group">\n                        <ion-select style="color: black" interface="action-sheet" [(ngModel)]="type" class="select-box" placeholder="Choose Type">\n                            <ion-option style="color: black" *ngFor="let type of rateCardTypes" [value]="type.name" (ionSelect)="selectUOMType(type)" >{{type.name}}</ion-option>\n                        </ion-select>\n                </div>\n            </ion-col>\n\n            <ion-col col-12>\n\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'name\'}">\n                    <label class="control-label">Name</label>\n                    <input class="form-control" type="text" [(ngModel)]="name" id="name" name="name" #nme="ngModel" required [ngClass]="{\'has-error\': nme.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n                    <div *ngIf="nme.errors && (nme.dirty || nme.touched)" class="error-msg">\n\n                    </div>\n\n                    <div *ngIf="nme.errors && (nme.untouched )" class="error-msg">\n\n                    </div>\n                </div>\n\n\n            </ion-col>\n\n            <ion-col col-12>\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'cost\'}">\n                    <label class="control-label">Cost</label>\n                    <input class="form-control" type="number" [(ngModel)]="cost" id="cost" name="cost" #cst="ngModel" required [ngClass]="{\'has-error\': cst.errors || eMsg==\'all\'|| eMsg==\'cost\'}">\n                    <div *ngIf="cst.errors && (cst.dirty || cst.touched)" class="error-msg">\n\n                    </div>\n\n                    <div *ngIf="cst.errors && (cst.untouched )" class="error-msg">\n\n                    </div>\n                </div>\n            </ion-col>\n\n            <button type="submit" class="btn btn-warning pull-right margin-auto" (click)="addRates()">Ok</button>\n        </ion-row>\n    </ion-list>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"],
            __WEBPACK_IMPORTED_MODULE_3__service_quotationService__["a" /* QuotationService */]])
    ], QuotationPopoverPage);
    return QuotationPopoverPage;
}());

//# sourceMappingURL=quotation-popover.js.map

/***/ }),

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateEmployeePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_employeeService__ = __webpack_require__(51);
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
var CreateEmployeePage = (function () {
    function CreateEmployeePage(navCtrl, component, myService, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, siteService, employeeService, geoFence) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.component = component;
        this.myService = myService;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.siteService = siteService;
        this.employeeService = employeeService;
        this.geoFence = geoFence;
        this.categories = 'basic';
        this.getAllProjects();
        this.employeeService.getAllDesignations().subscribe(function (response) {
            _this.designations = response;
        });
        this.employeeService.getAllEmployees().subscribe(function (response) {
            _this.manager = response;
        });
    }
    CreateEmployeePage.prototype.ionViewDidLoad = function () {
    };
    CreateEmployeePage.prototype.viewCamera = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.eImg = 'data:image/jpeg;base64,' + imageData;
        }, function (err) {
            // error
        });
    };
    CreateEmployeePage.prototype.getAllProjects = function () {
        var _this = this;
        this.component.showLoader('Getting Clients..');
        this.siteService.getAllProjects().subscribe(function (response) {
            console.log(response);
            _this.projects = response;
            _this.component.closeLoader();
        }, function (err) {
            console.log(err);
            _this.component.closeLoader();
            _this.component.showToastMessage('Unable to get Clients, please try again..', 'bottom');
        });
    };
    CreateEmployeePage.prototype.getSites = function (projectId, projectName) {
        var _this = this;
        this.component.showLoader('Getting Sites of Client ' + projectName + '..');
        this.siteService.findSitesByProject(projectId).subscribe(function (response) {
            console.log(response);
            _this.sites = response;
            _this.component.closeLoader();
        }, function (err) {
            console.log(err);
            _this.component.closeLoader();
            _this.component.showToastMessage('Unable to get Clients, please try again..', 'bottom');
        });
    };
    CreateEmployeePage.prototype.addProjectSites = function () {
        var projSite = {
            "projectId": this.selectedProject.id,
            "projectName": this.selectedProject.name,
            "siteId": this.selectedSite.id,
            "siteName": this.selectedSite.name
        };
        this.projectSites.push(projSite);
    };
    CreateEmployeePage.prototype.addJob = function () {
        console.log('form submitted');
        if (this.firstname && this.lastname && this.eId) {
            // Save Employee
            this.employee = {
                name: this.firstname,
                lastName: this.lastname,
                designation: this.designation,
                empId: this.eId,
                projectId: this.selectedProject.id,
                siteId: this.selectedSite.id,
                projectSites: this.projectSites,
                managerId: this.selectedManager.id
            };
            console.log("Employee Details");
            console.log(this.employee);
            this.component.showLoader('Creating Employee');
            // this.employeeService.createEmployee(this.employee).subscribe(
            //     response=>{
            //         console.log(response)
            //         this.component.closeLoader();
            //         this.component.showToastMessage('Employee Created','bottom');
            //         this.navCtrl.setRoot(EmployeeListPage);
            //     }
            // )
            this.component.showToastMessage(this.msg, 'bottom');
        }
        else {
            if (!this.firstname) {
                this.eMsg = "firstname";
            }
            else if (!this.lastname) {
                this.eMsg = "lastname";
            }
            else if (!this.number) {
                this.eMsg = "number";
            }
            else if (!this.mail) {
                this.eMsg = "mail";
            }
            else if (!this.eId) {
                this.eMsg = "eId";
            }
            else if (!this.address) {
                this.eMsg = "address";
            }
            else {
                this.eMsg = "all";
            }
            this.component.showToastMessage(this.msg, 'bottom');
        }
    };
    CreateEmployeePage.prototype.login = function () {
        console.log('form submitted');
        if (this.username && this.password) {
        }
        else {
            if (this.username) {
                this.eMsg = "password";
            }
            else if (this.password) {
                this.eMsg = "username";
            }
            else if (!this.username && !this.password) {
                this.eMsg = "all";
            }
        }
    };
    CreateEmployeePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-create-employee',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/create-employee.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar no-border>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Create Employee</ion-title>\n  </ion-navbar>\n    <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="clr-blue">\n      <ion-segment-button value="basic">\n        Basic\n      </ion-segment-button>\n      <ion-segment-button value="login" >\n        Login\n      </ion-segment-button>\n    </ion-segment>\n\n</ion-header>\n\n<ion-content padding>\n  <div [ngSwitch]="categories">\n\n    <ion-list *ngSwitchCase="\'basic\'">\n      <div class="card">\n        <div class="card-content">\n          <ion-row>\n\n            <ion-col col-12>\n                <div class="margin-auto empl-round" (click)="viewCamera()">\n                  <img src="img/user.png">\n                </div>\n            </ion-col>\n\n              <ion-col col-12>\n                  <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'eId\'}">\n                      <label class="control-label">Employee Id</label>\n                      <input class="form-control" type="text" [(ngModel)]="eId" id="eId" name="number" #id="ngModel" required [ngClass]="{\'has-error\': id.errors || eMsg==\'all\'|| eMsg==\'eId\'}">\n                      <div *ngIf="id.errors && (id.dirty || id.touched)" class="error-msg">\n\n                      </div>\n\n                      <div *ngIf="id.errors && (id.untouched )" class="error-msg">\n\n                      </div>\n                  </div>\n              </ion-col>\n\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'firstname\'}">\n                <label class="control-label">First Name</label>\n                <input class="form-control" type="text" [(ngModel)]="firstname" id="firstname" name="firstname" #fname="ngModel" required [ngClass]="{\'has-error\': fname.errors || eMsg==\'all\'|| eMsg==\'firstname\'}">\n                <div *ngIf="fname.errors && (fname.dirty || fname.touched)" class="error-msg">\n\n                </div>\n\n                <div *ngIf="fname.errors && (fname.untouched )" class="error-msg">\n\n                </div>\n              </div>\n\n            </ion-col>\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'lastname\'}">\n                <label class="control-label">Last Name</label>\n                <input class="form-control" type="text" [(ngModel)]="lastname" id="lastname" name="lastname" #lname="ngModel" required [ngClass]="{\'has-error\': lname.errors || eMsg==\'all\'|| eMsg==\'lastname\'}">\n                <div *ngIf="lname.errors && (lname.dirty || lname.touched)" class="error-msg">\n\n                </div>\n\n                <div *ngIf="lname.errors && (lname.untouched )" class="error-msg">\n\n                </div>\n              </div>\n\n            </ion-col>\n\n              <!--<ion-col col-12>-->\n                  <!--<div class="form-group">-->\n                      <!--<ion-select [(ngModel)]="designation" class="select-box" id="designation" placeholder="Choose Designation" name="designation" #designation="ngModel" required >-->\n                          <!--<ion-option *ngFor="let designation of designations" [value]="designation.designation" >{{designation.designation}}</ion-option>-->\n                      <!--</ion-select>-->\n                  <!--</div>-->\n              <!--</ion-col>-->\n\n            <ion-col col-12>\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'number\'}">\n                <label class="control-label">Mobile Number</label>\n                <input class="form-control" type="number" [(ngModel)]="number" id="number" name="number" #num="ngModel" required [ngClass]="{\'has-error\': num.errors || eMsg==\'all\'|| eMsg==\'number\'}">\n                <div *ngIf="num.errors && (num.dirty || num.touched)" class="error-msg">\n\n                </div>\n                <div *ngIf="num.errors && (num.untouched )" class="error-msg">\n\n                </div>\n              </div>\n            </ion-col>\n\n              <ion-col col-12>\n                  <div class="form-group">\n                      <ion-select [(ngModel)]="selectedProject" class="select-box" id="selectedProject" placeholder="Choose Project" name="selectedProject" #selectedPeoject="ngModel" required >\n                          <ion-option *ngFor="let project of projects" [value]="project.name" (ionSelect)="getSites(project.id,project.name)">{{project.name}}</ion-option>\n                      </ion-select>\n                  </div>\n              </ion-col>\n\n              <ion-col col-12>\n                  <div class="form-group">\n                      <ion-select [(ngModel)]="selectedSite" class="select-box" id="siteName" placeholder="Choose Site" name="siteName" #site="ngModel" required >\n                          <ion-option *ngFor="let site of sites" [value]="site.name" (ionSelect)="addProjectSites()">{{site.name}}</ion-option>\n                      </ion-select>\n                  </div>\n              </ion-col>\n\n              <!--<ion-col col-12>-->\n                  <!--<div class="form-group">-->\n                      <!--<ion-select [(ngModel)]="selectedManager" class="select-box" id="selectedManager" placeholder="Choose Manager" name="selectedManager" #selectedManager="ngModel" required >-->\n                          <!--<ion-option *ngFor="let manager of manager" [value]="manager.name" >{{manager.name}}</ion-option>-->\n                      <!--</ion-select>-->\n                  <!--</div>-->\n              <!--</ion-col>-->\n\n              <!--<ion-col col-12>-->\n              <!--<div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'mail\'}">-->\n                <!--<label class="control-label">Mail Id</label>-->\n                <!--<input class="form-control" type="email" [(ngModel)]="mail" id="mail" name="mail" #mid="ngModel" required [ngClass]="{\'has-error\': mid.errors || eMsg==\'all\'|| eMsg==\'number\'}">-->\n                <!--<div *ngIf="mid.errors && (mid.dirty || mid.touched)" class="error-msg">-->\n\n                <!--</div>-->\n                <!--<div *ngIf="mid.errors && (mid.untouched )" class="error-msg">-->\n\n                <!--</div>-->\n              <!--</div>-->\n            <!--</ion-col>-->\n\n\n\n\n            <!--<ion-col col-12>-->\n\n              <!--<div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'address\'}">-->\n                <!--<label class="control-label">Address</label>-->\n                <!--<input class="form-control" type="text" [(ngModel)]="address" id="address" name="address" #add="ngModel" required [ngClass]="{\'has-error\': add.errors || eMsg==\'all\'|| eMsg==\'address\'}">-->\n                <!--<div *ngIf="add.errors && (add.dirty || add.touched)" class="error-msg">-->\n\n                <!--</div>-->\n\n                <!--<div *ngIf="add.errors && (add.untouched )" class="error-msg">-->\n\n                <!--</div>-->\n              <!--</div>-->\n\n\n            <!--</ion-col>-->\n\n            <button type="submit" class="btn btn-warning  margin-auto" (click)="addJob()">Next</button>\n\n            <div class="clearfix"></div>\n          </ion-row>\n        </div>\n      </div>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'login\'">\n      <div class="card">\n        <div class="card-content">\n          <ion-row>\n            <ion-col col-12>\n              <div class="form-group label-floating">\n\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'username\'}">\n                  <label class="control-label">User Name</label>\n                  <input class="form-control" type="text" [(ngModel)]="username" id="username" name="username" #uname="ngModel" required [ngClass]="{\'has-error\': uname.errors || eMsg==\'all\'|| eMsg==\'username\'}">\n                  <div *ngIf="uname.errors && (uname.dirty || uname.touched)" class="error-msg">\n\n                  </div>\n\n                  <div *ngIf="uname.errors && (uname.untouched )" class="error-msg">\n\n                  </div>\n                </div>\n              </div>\n\n            </ion-col>\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'password\'}">\n                <label class="control-label">Password</label>\n                <input class="form-control" type="text" [(ngModel)]="password" id="password" name="password" #pass="ngModel" required [ngClass]="{\'has-error\': pass.errors || eMsg==\'all\'|| eMsg==\'password\'}">\n                <div *ngIf="pass.errors && (pass.dirty || pass.touched)" class="error-msg">\n\n                </div>\n\n                <div *ngIf="pass.errors && (pass.untouched )" class="error-msg">\n\n                </div>\n              </div>\n\n\n            </ion-col>\n\n\n            <button type="submit" class="btn btn-warning  margin-auto" (click)="login()">Next</button>\n\n            <div class="clearfix"></div>\n          </ion-row>\n        </div>\n      </div>\n    </ion-list>\n  </div>\n</ion-content>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/create-employee.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_7__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_8__service_employeeService__["a" /* EmployeeService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */]])
    ], CreateEmployeePage);
    return CreateEmployeePage;
}());

//# sourceMappingURL=create-employee.js.map

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendancePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__attendance_popover__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__site_list_site_list__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__site_employeeList_site_employeeList__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
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
    function AttendancePage(navCtrl, myService, attendanceService, popoverCtrl, component) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.myService = myService;
        this.attendanceService = attendanceService;
        this.popoverCtrl = popoverCtrl;
        this.component = component;
        this.component.showLoader('');
        this.attendanceService.getAllAttendances().subscribe(function (response) {
            console.log("All attendances");
            console.log(response);
            _this.attendances = response;
            _this.component.closeLoader();
        });
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
    AttendancePage.prototype.markAttendance = function () {
        console.log(window.localStorage.getItem('userGroup'));
        if (window.localStorage.getItem('userGroup') == 'Admin') {
            console.log("Admin login");
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__site_list_site_list__["a" /* SiteListPage */]);
        }
        else if (window.localStorage.getItem('userGroup') == 'Employee') {
            console.log("Empoyee login");
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__site_employeeList_site_employeeList__["a" /* EmployeeSiteListPage */]);
        }
        else if (window.localStorage.getItem('userGroup') == 'client') {
            console.log("Client login");
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__site_list_site_list__["a" /* SiteListPage */]);
        }
        else {
            console.log("Others login");
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__site_list_site_list__["a" /* SiteListPage */]);
        }
    };
    AttendancePage.prototype.viewImage = function (img) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_3__attendance_popover__["a" /* AttendancePopoverPage */], { i: img }, { cssClass: 'view-img', showBackdrop: true });
        popover.present({});
    };
    AttendancePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance/attendance.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Attendance</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-fab bottom right>\n    <button (click)="markAttendance()" ion-fab><ion-icon name="add"></ion-icon></button>\n  </ion-fab>\n\n  <div class="row">\n      <ion-row class="margin0 white-bg padding10 margin-bottom25 width98 margin-side-auto" *ngFor="let a of attendances">\n          <ion-col col-12 *ngIf="!attendances">\n              <p>No Records</p>\n          </ion-col>\n          <ion-col col-6 >\n              <p text-left class="margin0">{{a.employeeFullName}}</p>\n              <p text-left class="margin0 label-on-left">{{a.siteName}}</p>\n          </ion-col>\n          <ion-col col-6>\n\n          </ion-col>\n\n          <ion-col col-6 class="align-center">\n              <ion-item no-lines class="item-label" >\n                  <ion-avatar *ngIf="a.checkInImage">\n                      <img  [src]="a.checkInImage" (click)="viewImage(a.checkInImage)">\n                  </ion-avatar>\n                  <ion-avatar *ngIf="!a.checkInImage">\n                      <img  src="img/user.png" width="10%">\n                  </ion-avatar>\n              </ion-item>\n          </ion-col>\n          <ion-col col-6 class="align-center">\n              <ion-item no-lines class="item-label">\n                  <ion-avatar *ngIf="a.checkOutImage" (click)="viewImage(a.checkOutImage)">\n                      <img  [src]="a.checkOutImage" >\n                  </ion-avatar>\n                  <ion-avatar *ngIf="!a.checkOutImage">\n                      <img  src="img/user.png" >\n                  </ion-avatar>\n              </ion-item>\n          </ion-col>\n          <ion-col col-6>\n              <p text-left class="fnt-12">\n                  <ion-icon ios="ios-calendar" md="md-calendar" class="green  padding-right10"></ion-icon>\n                  {{a.checkInTime | date:\'MMM d, y, h:mm a\' }}\n              </p>\n          </ion-col>\n          <ion-col col-6>\n              <p text-left class="fnt-12">\n                  <ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>\n                  {{a.checkOutTime | date:\'MMM d, y, h:mm a\' }}\n              </p>\n          </ion-col>\n      </ion-row>\n  </div>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance/attendance.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */]])
    ], AttendancePage);
    return AttendancePage;
}());

//# sourceMappingURL=attendance.js.map

/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_employeeService__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__service_componentService__ = __webpack_require__(19);
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
    function EmployeeList(navCtrl, component, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence, employeeService, jobService, siteService, attendanceService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.component = component;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
        this.employeeService = employeeService;
        this.jobService = jobService;
        this.siteService = siteService;
        this.attendanceService = attendanceService;
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
    }
    EmployeeList.prototype.viewList = function (i) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */]);
    };
    EmployeeList.prototype.showSuccessToast = function (msg) {
        this.component.showToastMessage(msg, 'bottom');
    };
    EmployeeList.prototype.showLoader = function (msg) {
        this.loader = this.loadingCtrl.create({
            content: msg
        });
        this.loader.present();
    };
    EmployeeList.prototype.closeLoader = function () {
        this.loader.dismiss();
    };
    EmployeeList.prototype.getAttendances = function (site) {
        var _this = this;
        this.attendanceService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeList.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    EmployeeList.prototype.getEmployeeAttendance = function (employeeId) {
        var _this = this;
        this.attendanceService.getAttendances(employeeId).subscribe(function (response) {
            console.log(response);
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeList.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.siteService.searchSiteEmployee(this.site.id).subscribe(function (response) {
            console.log(response.json());
            _this.employeeList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            var _loop_1 = function (employee) {
                _this.attendanceService.getAttendances(employee.id).subscribe(function (response) {
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
        this.attendanceService.getAttendances(employeeId).subscribe(function (response) {
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
            // let loader = this.loadingCtrl.create({
            //   content:''
            // });
            // loader.present();
            _this.showLoader('getting location');
            var base64Image = 'data:image/jpeg;base64,' + imageData;
            var employeeName = employee.fullName + employee.empId;
            // this.geolocation.getCurrentPosition().then((response)=>{
            //   console.log("Current location");
            //   console.log(response);
            //   this.closeLoader();
            //   this.showLoader('verifying Location');
            //   this.lattitude = response.coords.latitude;
            //   this.longitude = response.coords.longitude;
            //   this.authService.checkSiteProximity(this.site.id,this.lattitude,this.longitude).subscribe(
            //     response=>{
            //       this.closeLoader();
            //       this.showLoader('');
            //       console.log(response.json());
            _this.authService.detectFace(_this.employeeFullName, imageData).subscribe(function (response) {
                console.log("response in site list");
                console.log(response.json());
                var detectResponse = response.json();
                if (detectResponse.images && detectResponse.images[0].status === 'Complete') {
                    _this.closeLoader();
                    if (mode === 'enroll') {
                        _this.showLoader('Enrolling Face');
                        _this.authService.enrollFace(employeeName, imageData).subscribe(function (response) {
                            console.log("Face verification response");
                            console.log(response.json());
                            var verificationResponse = response.json();
                            employee.imageData = imageData;
                            _this.employeeService.markEnrolled(employee).subscribe(function (response) {
                                console.log("face marked to database");
                                _this.closeLoader();
                                var msg = 'Face enrolled Successfully';
                                _this.showSuccessToast(msg);
                            }, function (error) {
                                _this.closeLoader();
                                console.log("Error in enrolling to server");
                                console.log(error);
                            });
                        }, function (error) {
                            _this.closeLoader();
                            console.log("Error");
                            console.log(error);
                        });
                    }
                    else {
                        if (attendanceMode == 'checkIn') {
                            _this.showLoader('Verifying Face');
                            _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                console.log("Face verification response");
                                console.log(response.json());
                                var verificationResponse = response.json();
                                if (verificationResponse && verificationResponse.images) {
                                    if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                        console.log(_this.lattitude);
                                        console.log(_this.longitude);
                                        _this.closeLoader();
                                        _this.showLoader('Marking Attendance');
                                        _this.attendanceService.markAttendanceCheckIn(_this.site.id, employee.empId, _this.lattitude, _this.longitude, imageData).subscribe(function (response) {
                                            console.log(response.json());
                                            _this.closeLoader();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                                // employee.attendanceId = response.
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            _this.closeLoader();
                                        });
                                    }
                                }
                                else {
                                    _this.closeLoader();
                                    var msg = "Unable to verify face, please try again";
                                    _this.showSuccessToast(msg);
                                }
                            }, function (error) {
                                _this.closeLoader();
                                var msg = "Unable to verify face, please try again";
                                _this.showSuccessToast(msg);
                            });
                        }
                        else {
                            _this.showLoader('Verifying Face');
                            _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                console.log("Face verification response");
                                console.log(response.json());
                                var verificationResponse = response.json();
                                if (verificationResponse && verificationResponse.images) {
                                    if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                        console.log(_this.lattitude);
                                        console.log(_this.longitude);
                                        _this.closeLoader();
                                        _this.showLoader('Marking Attendance');
                                        _this.attendanceService.markAttendanceCheckOut(_this.site.id, employee.empId, _this.lattitude, _this.longitude, imageData, employee.attendanceId).subscribe(function (response) {
                                            console.log(response.json());
                                            _this.closeLoader();
                                            if (response && response.status === 200) {
                                                var msg = 'Face Verified and Attendance marked Successfully';
                                                _this.showSuccessToast(msg);
                                            }
                                        }, function (error) {
                                            var msg = 'Attendance Not Marked';
                                            console.log(error);
                                            _this.showSuccessToast(msg);
                                            _this.closeLoader();
                                        });
                                    }
                                }
                                else {
                                    _this.closeLoader();
                                    var msg = "Unable to verify face, please try again";
                                    _this.showSuccessToast(msg);
                                }
                            }, function (error) {
                                _this.closeLoader();
                                var msg = "Unable to verify face, please try again";
                                _this.showSuccessToast(msg);
                            });
                        }
                    }
                }
                else {
                    console.log("error in detecting face");
                    _this.closeLoader();
                    var msg = "Face not Detected, please try again";
                    _this.showSuccessToast(msg);
                }
            }, function (error) {
                console.log("errors");
                console.log(error.json());
                if (error.json().status == "false") {
                    var msg = "You are currently not at the site location";
                    _this.showSuccessToast(msg);
                    _this.closeLoader();
                }
            });
            // },error=>{
            //       console.log("errors");
            //       console.log("errors")
            //       console.log(error.json());
            //       if(error.json().status === "false"){
            //         var msg= "You are currently not at the site location";
            //         this.showSuccessToast(msg);
            //         this.closeLoader();
            //       }else{
            //         var msg= "You are currently not at the site location";
            //         this.showSuccessToast(msg);
            //         this.closeLoader();
            //       }
            //     });
            //
            // }).catch((error)=>{
            //
            //   console.log("Location error")
            //   this.lattitude = 0;
            //   this.longitude = 0;
            //   var msg= "Unable to get location";
            //   this.showSuccessToast(msg);
            //   this.closeLoader();
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
            selector: 'page-employee-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee/employee-list.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary" >\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Employee List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-list>\n    <ion-item *ngFor="let employee of employeeList;let i of index" class="bottom-border" >\n\n      <p><span style="float:left" (click)="getEmployeeAttendance(employee.id)"  >{{employee.fullName}}</span>\n        <span style="float: right">\n          <button ion-button  (click)="viewCamera(employee,\'enroll\')"  >Enroll</button>\n          <span *ngIf="employee.faceAuthorised">\n            <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkIn\')" *ngIf="!employee.checkedIn" >Check - In</button>\n            <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkOut\')" *ngIf="employee.checkedIn">Check - Out</button>\n          </span>\n\n        </span></p>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee/employee-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_11__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_8__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_9__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_10__service_attendanceService__["a" /* AttendanceService */]])
    ], EmployeeList);
    return EmployeeList;
}());

//# sourceMappingURL=employee-list.js.map

/***/ }),

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__employee_detail__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__create_employee__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_employeeService__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_toast__ = __webpack_require__(99);
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
var EmployeeListPage = (function () {
    function EmployeeListPage(navCtrl, component, myService, navParams, authService, camera, loadingCtrl, geolocation, toast, geoFence, employeeService, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.myService = myService;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toast = toast;
        this.geoFence = geoFence;
        this.employeeService = employeeService;
        this.actionSheetCtrl = actionSheetCtrl;
        this.count = 0;
        this.employees = [];
    }
    EmployeeListPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad Employee list');
        this.component.showLoader('Getting Employees');
        var searchCriteria = {
            currPage: this.page,
            pageSort: this.pageSort
        };
        this.employeeService.searchEmployees(searchCriteria).subscribe(function (response) {
            console.log('ionViewDidLoad Employee list:');
            console.log(response);
            console.log(response.transactions);
            _this.employees = response.transactions;
            console.log(_this.employees);
            _this.page = response.currPage;
            _this.totalPages = response.totalPages;
            _this.component.closeLoader();
        }, function (error) {
            console.log('ionViewDidLoad Employee Page:' + error);
        });
    };
    EmployeeListPage.prototype.viewEmployee = function (emp) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__employee_detail__["a" /* EmployeeDetailPage */], { emp: emp });
    };
    EmployeeListPage.prototype.first = function (emp) {
        // console.log(emp)
        this.firstLetter = emp.charAt(0);
    };
    EmployeeListPage.prototype.createEmployee = function ($event) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__create_employee__["a" /* CreateEmployeePage */]);
    };
    EmployeeListPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria = {
            currPage: this.page + 1
        };
        if (this.page > this.totalPages) {
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('All Employees Loaded', 'bottom');
        }
        else {
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(function () {
                _this.employeeService.searchEmployees(searchCriteria).subscribe(function (response) {
                    console.log('ionViewDidLoad Employee list:');
                    console.log(response);
                    console.log(response.transactions);
                    for (var i = 0; i < response.transactions.length; i++) {
                        _this.employees.push(response.transactions[i]);
                    }
                    _this.page = response.currPage;
                    _this.totalPages = response.totalPages;
                    _this.component.closeLoader();
                }, function (error) {
                    console.log('ionViewDidLoad Employee Page:' + error);
                });
                infiniteScroll.complete();
            }, 1000);
        }
    };
    EmployeeListPage.prototype.presentActionSheet = function (employee) {
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Employee Actions',
            buttons: [
                {
                    text: 'Mark Left',
                    handler: function () {
                        console.log("Mark Employee Left");
                        // this.navCtrl.push(ViewJobPage,{job:job})
                    }
                },
                {
                    text: 'Site Transfer',
                    handler: function () {
                        console.log('Transfer Employee');
                    }
                },
                {
                    text: 'Relieve Employee',
                    handler: function () {
                        console.log('Relieve employee with another employee ');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log("Cancel clicker");
                    }
                }
            ]
        });
        actionSheet.present();
    };
    EmployeeListPage.prototype.open = function (itemSlide, item, c, menu) {
        this.count = c;
        if (c == 1) {
            this.count = 0;
            menu.setElementStyle("display", "block");
        }
        else {
            this.count = 1;
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-120px, 0px, 0px)");
            menu.setElementStyle("display", "none");
        }
    };
    EmployeeListPage.prototype.close = function (item, menu) {
        this.count = 0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
        menu.setElementStyle("display", "block");
    };
    EmployeeListPage.prototype.drag = function (menu, e) {
        var percent = e.getSlidingPercent();
        console.log("Drag:" + percent);
        if (percent == 1) {
            menu.setElementStyle("display", "none");
        }
        else {
            menu.setElementStyle("display", "block");
        }
    };
    EmployeeListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-employee-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/employee-list.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Employee List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-fab bottom right>\n    <button (click)="createEmployee($event)"  ion-fab><ion-icon name="add"></ion-icon></button>\n  </ion-fab>\n\n  <ion-list class="emp-list">\n\n    <div *ngFor="let emp of employees;let i of index">\n    <ion-item-sliding #slidingItem (ionDrag)="drag(menu,$event)">\n      <ion-item #item  class="bottom-border emp padding-left0"  >\n        <ion-row class="margin0">\n          <ion-col col-2>\n            <ion-avatar item-start *ngIf="emp.enrolled_face" >\n              <img  [src]="emp.enrolled_face" >\n            </ion-avatar>\n            <p *ngIf="!emp.enrolled_face && first(emp.name)"></p>\n            <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round">\n              <p class="margin-auto">{{firstLetter}}</p>\n            </ion-avatar>\n          </ion-col>\n          <ion-col col-8 class="ver-center" (click)="viewEmployee(emp)">\n              <p text-left class="fnt-wt" text-capitalize>{{emp.name}}</p>\n          </ion-col>\n          <ion-col col-1 class="ver-center">\n              <button #menu ion-button icon-left icon-only clear class="pop-icon" (click)="open(slidingItem, item ,count,menu)">\n                <ion-icon name="md-more" class="fnt-18 padding0"></ion-icon>\n              </button>\n          </ion-col>\n        </ion-row>\n      </ion-item>\n\n      <ion-item-options side="right" (click)="close(slidingItem,menu)">\n        <button ion-button clear color="danger"><ion-icon name="close" class="fnt-24 padding-bottom0"></ion-icon></button>\n        <button ion-button clear color="primary"><i class="material-icons fnt-24">transfer_within_a_station</i></button>\n        <button ion-button clear color="clr-blue"><i class="material-icons fnt-24">assignment_ind</i></button>\n      </ion-item-options>\n    </ion-item-sliding>\n    </div>\n  </ion-list>\n\n  <ion-infinite-scroll *ngIf="page<totalPages"  (ionInfinite)="doInfinite($event)">\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n  </ion-infinite-scroll>\n</ion-content>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/employee-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_toast__["a" /* Toast */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_9__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ActionSheetController"]])
    ], EmployeeListPage);
    return EmployeeListPage;
}());

//# sourceMappingURL=employee-list.js.map

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_toast__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_employeeService__ = __webpack_require__(51);
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
    function LoginPage(navCtrl, component, formBuilder, menuCtrl, toastCtrl, toast, navParams, myService, employeeService, events) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.formBuilder = formBuilder;
        this.menuCtrl = menuCtrl;
        this.toastCtrl = toastCtrl;
        this.toast = toast;
        this.navParams = navParams;
        this.myService = myService;
        this.employeeService = employeeService;
        this.events = events;
        this.permission = [
            { module: null,
                action: null }
        ];
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
        this.menuCtrl.swipeEnable(false);
        this.now = new Date().getTime();
    };
    LoginPage.prototype.signin = function () {
        var _this = this;
        console.log('form submitted');
        if (this.username && this.password) {
            this.component.showLoader('Login');
            this.myService.login(this.username, this.password).subscribe(function (response) {
                console.log(response);
                console.log(response.json());
                _this.employeeService.getUser(response.json().employee.userId).subscribe(function (response) {
                    console.log("User response");
                    console.log(response);
                    var module = {};
                    window.localStorage.setItem('userType', response.userRole.name.toUpperCase());
                    _this.events.publish('userType', response.userRole.name.toUpperCase());
                    if (response.name.toUpperCase() === 'ADMIN') {
                    }
                    for (var _i = 0, _a = response.userRole.rolePermissions; _i < _a.length; _i++) {
                        var userRole = _a[_i];
                        // this.permissionService.addPermission([userRole.moduleName])
                        module = { module: userRole.moduleName,
                            action: userRole.actionName };
                        _this.permission.push(module);
                    }
                    _this.events.publish('permissions:set', _this.permission);
                    console.log("Modules and permissions");
                    console.log(_this.permission);
                }, function (err) {
                    _this.events.publish('userType', 'ADMIN');
                });
                window.localStorage.setItem('session', response.json().token);
                window.localStorage.setItem('userGroup', response.json().employee.userUserGroupName);
                window.localStorage.setItem('employeeId', response.json().employee.id);
                window.localStorage.setItem('employeeFullName', response.json().employee.fullName);
                window.localStorage.setItem('employeeEmpId', response.json().employee.empId);
                window.localStorage.setItem('employeeUserId', response.json().employee.userId);
                window.localStorage.setItem('employeeDetails', JSON.stringify(response.json()));
                var employee = response.json().employee;
                if (response.status == 200) {
                    _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
                    _this.component.closeLoader();
                }
                else {
                    _this.component.closeLoader();
                    _this.component.showToastMessage(_this.msg, 'center');
                }
                /*if(employee.userUserGroupName == "Admin"){
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
            }, function (error) {
                _this.component.closeLoader();
                console.log(error);
                if (error.type == 2) {
                    _this.msg = 'Invalid UserName and Password';
                }
                if (error.type == 3) {
                    _this.msg = 'Server Unreachable';
                }
                _this.component.showToastMessage(_this.msg, 'center');
                /*
                 this.toast.show(this.msg, '3000', 'center').subscribe(
                     toast => {
                         console.log(toast);
                     }
                 );
                 */
            });
        }
        else {
            if (this.username) {
                this.eMsg = "password";
                this.field = "password";
            }
            else if (this.password) {
                this.eMsg = "username";
                this.field = "username";
            }
            else if (!this.username && !this.password) {
                this.eMsg = "all";
            }
        }
    };
    LoginPage.prototype.ionViewDidEnter = function () {
        //this.callValidation();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/login/login.html"*/`<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n\n<ion-content class="login">\n    <div class="wrapper wrapper-full-page">\n        <div class="full-page login-page" filter-color="black" data-image="img/login.jpeg">\n            <!--   you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " -->\n            <div class="content padding-top40">\n              <div class="container">\n                <div class="row">\n                    <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">\n\n                              <div class="width90 margin-auto align-center">\n                                  <div class="margin-bottom">\n                                      <img src="img/logo.png">\n                                  </div>\n\n                                  <div class="card card-login">\n                                    <div class="card-header text-center" data-background-color="orange">\n                                      <h4 class="card-title">Login</h4>\n                                    </div>\n                                    <div class="card-content padding-top25">\n                                      <div class="input-group">\n                                          <span class="input-group-addon">\n                                              <i class="material-icons">face</i>\n                                          </span>\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'username\'}">\n                                          <label class="control-label">User Name</label>\n                                                <input class="form-control" type="text" [(ngModel)]="username" id="username" name="username" #uname="ngModel" required [ngClass]="{\'has-error\': uname.errors || eMsg==\'all\'|| eMsg==\'username\'}">\n                                                <div *ngIf="uname.errors && (uname.dirty || uname.touched)" class="error-msg">\n\n                                                </div>\n\n                                                <div *ngIf="uname.errors && (uname.untouched )" class="error-msg">\n\n                                                </div>\n                                        </div>\n                                      </div>\n                                      <div class="input-group">\n                                          <span class="input-group-addon">\n                                              <i class="material-icons">lock_outline</i>\n                                          </span>\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'|| eMsg==\'password\'}">\n                                          <label class="control-label">Password</label>\n                                            <input class="form-control" type="password" [(ngModel)]="password" id="password" name="password" #pass="ngModel" required [ngClass]="{\'has-error\':eMsg==\'all\' || eMsg==\'password\'}">\n                                            <div *ngIf="pass.errors && (pass.dirty || pass.touched)" class="error-msg">\n\n                                            </div>\n                                            <div *ngIf="pass.errors && (pass.untouched )" class="error-msg">\n\n                                            </div>\n                                        </div>\n                                      </div>\n                                    </div>\n                                    <div class="footer text-center">\n                                      <button class="btn btn-warning btn-simple btn-wd btn-lg" (click)="signin()">Sign In</button>\n                                    </div>\n                                  </div>\n\n                                  <div class="">\n                                      <p class="copyright align-center icon-color">\n                                          &copy;<a href="" class="clr-white"><span class="clr-blk">Powered By</span> <span class="icon-color">T</span>ech<span class="icon-color">G</span>inko</a>\n                                      </p>\n                                  </div>\n                              </div>\n\n                    </div>\n                </div>\n            </div>\n        </div>\n        </div>\n    </div>\n\n\n\n\n\n<!--\n  <div text-center class="margin-top25 margn-btom20">\n    <img src="img/logo.png">\n  </div>\n\n  <div>\n    <ion-item class="width80 margin-auto bg-grey">\n      <ion-input type="text" placeholder="Username" class="round" [(ngModel)]="username"></ion-input>\n    </ion-item>\n\n    <ion-item class="width80 margin-auto padding-top10 bg-grey">\n      <ion-input type="password"  placeholder="Password" class="round" [(ngModel)]="password"></ion-input>\n    </ion-item>\n  </div>\n\n  <div padding text-center>\n    <button ion-button color="primary" round >Sign In</button>\n  </div>\n-->\n\n</ion-content>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["MenuController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_6__ionic_native_toast__["a" /* Toast */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_7__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_componentService__ = __webpack_require__(19);
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
    function SiteListPage(navCtrl, component, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, attendanceService, siteService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.component = component;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.attendanceService = attendanceService;
        this.siteService = siteService;
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
        this.component.showToastMessage(msg, 'bottom');
    };
    SiteListPage.prototype.getAttendances = function (site) {
        var _this = this;
        this.attendanceService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    SiteListPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    SiteListPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.siteService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.siteList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            console.log(window.localStorage.getItem('responseImageDetails'));
        });
        this.attendanceService.getAttendances(this.employeeId).subscribe(function (response) {
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
            selector: 'page-site-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site-list/site-list.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary" >\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Select Site</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-list class="emp-list">\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border emp" >\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n      <p (click)="gotoEmployeeList(site)" text-left class="fnt-wt" text-capitalize>{{site.name}}</p>\n\n    </ion-item>\n  </ion-list>\n\n  <ion-infinite-scroll *ngIf="page<totalPages"  (ionInfinite)="doInfinite($event)">\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n  </ion-infinite-scroll>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site-list/site-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_9__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_8__service_siteService__["a" /* SiteService */]])
    ], SiteListPage);
    return SiteListPage;
}());

//# sourceMappingURL=site-list.js.map

/***/ }),

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeSiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_employeeService__ = __webpack_require__(51);
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
    function EmployeeSiteListPage(navCtrl, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, attendanceService, siteService, employeeService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.attendanceService = attendanceService;
        this.siteService = siteService;
        this.employeeService = employeeService;
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
    EmployeeSiteListPage.prototype.showLoader = function (msg) {
        this.loader = this.loadingCtrl.create({
            content: msg
        });
        this.loader.present();
    };
    EmployeeSiteListPage.prototype.closeLoader = function () {
        this.loader.dismiss();
    };
    EmployeeSiteListPage.prototype.getAttendances = function (site) {
        var _this = this;
        this.attendanceService.getSiteAttendances(site.id).subscribe(function (response) {
            console.log(response.json());
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__["a" /* AttendanceListPage */], { 'attendances': response.json() });
        });
    };
    EmployeeSiteListPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    EmployeeSiteListPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.siteService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.siteList = response.json();
            _this.userGroup = window.localStorage.getItem('userGroup');
            _this.employeeId = window.localStorage.getItem('employeeId');
            _this.employeeFullName = window.localStorage.getItem('employeeFullName');
            _this.employeeEmpId = window.localStorage.getItem('employeeEmpId');
            var employeeDetails = JSON.parse(window.localStorage.getItem('employeeDetails'));
            _this.employee = employeeDetails.employee;
            console.log("Employee details from localstorage");
            console.log(_this.employee.userId);
            _this.attendanceService.getAttendances(_this.employeeId).subscribe(function (response) {
                console.log(response.json());
                var result = response.json();
                if (result[0]) {
                    console.log("already checked in ");
                    _this.checkedIn = true;
                    _this.attendanceId = result[0].id;
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
            // let loader = this.loadingCtrl.create({
            //   content:''
            // });
            // loader.present();
            var employeeName = _this.employeeFullName + _this.employeeEmpId;
            if (attendanceMode == 'enroll') {
                _this.showLoader('Enrolling Face');
                _this.authService.enrollFace(employeeName, imageData).subscribe(function (response) {
                    console.log("Face verification response");
                    console.log(response.json());
                    var verificationResponse = response.json();
                    _this.employee.imageData = imageData;
                    _this.employeeService.markEnrolled(_this.employee).subscribe(function (response) {
                        console.log("face marked to database");
                        _this.closeLoader();
                        var msg = 'Face enrolled Successfully';
                        _this.showSuccessToast(msg);
                    }, function (error) {
                        _this.closeLoader();
                        console.log("Error in enrolling to server");
                        console.log(error);
                    });
                }, function (error) {
                    _this.closeLoader();
                    console.log("Error");
                    console.log(error);
                });
            }
            else {
                _this.showLoader('getting location');
                var employeeName = _this.employeeFullName + _this.employeeEmpId;
                _this.geolocation.getCurrentPosition().then(function (response) {
                    console.log("Current location");
                    console.log(response);
                    _this.closeLoader();
                    _this.showLoader('verifying Location');
                    _this.lattitude = response.coords.latitude;
                    _this.longitude = response.coords.longitude;
                    _this.attendanceService.checkSiteProximity(siteId, _this.lattitude, _this.longitude).subscribe(function (response) {
                        _this.closeLoader();
                        _this.showLoader('');
                        console.log(response.json());
                        _this.authService.detectFace(employeeName, imageData).subscribe(function (response) {
                            console.log("response in site list");
                            console.log(response.json());
                            var detectResponse = response.json();
                            if (detectResponse.images && detectResponse.images[0].status === 'Complete') {
                                _this.closeLoader();
                                if (attendanceMode == 'checkIn') {
                                    _this.showLoader('Verifying Face');
                                    _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                        console.log("Face verification response");
                                        console.log(response.json());
                                        var verificationResponse = response.json();
                                        if (verificationResponse && verificationResponse.images) {
                                            if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                                console.log(_this.lattitude);
                                                console.log(_this.longitude);
                                                _this.closeLoader();
                                                _this.showLoader('Marking Attendance');
                                                _this.attendanceService.markAttendanceCheckIn(siteId, _this.employeeEmpId, _this.lattitude, _this.longitude, imageData).subscribe(function (response) {
                                                    console.log(response.json());
                                                    _this.closeLoader();
                                                    if (response && response.status === 200) {
                                                        var msg = 'Face Verified and Attendance marked Successfully';
                                                        _this.showSuccessToast(msg);
                                                        window.location.reload();
                                                    }
                                                }, function (error) {
                                                    var msg = 'Attendance Not Marked';
                                                    console.log(error);
                                                    _this.showSuccessToast(msg);
                                                    _this.closeLoader();
                                                });
                                            }
                                        }
                                        else {
                                            _this.closeLoader();
                                            var msg = "Unable to verify face, please try again";
                                            _this.showSuccessToast(msg);
                                        }
                                    }, function (error) {
                                        _this.closeLoader();
                                        var msg = "Unable to verify face, please try again";
                                        _this.showSuccessToast(msg);
                                    });
                                }
                                else {
                                    _this.showLoader('Verifying Face');
                                    _this.authService.verifyUser(employeeName, imageData).subscribe(function (response) {
                                        console.log("Face verification response");
                                        console.log(response.json());
                                        var verificationResponse = response.json();
                                        if (verificationResponse && verificationResponse.images) {
                                            if (verificationResponse.images[0].transaction.confidence >= 0.75) {
                                                console.log(_this.lattitude);
                                                console.log(_this.longitude);
                                                _this.closeLoader();
                                                _this.showLoader('Marking Attendance');
                                                _this.attendanceService.markAttendanceCheckOut(siteId, _this.employeeEmpId, _this.lattitude, _this.longitude, imageData, _this.attendanceId).subscribe(function (response) {
                                                    console.log(response.json());
                                                    _this.closeLoader();
                                                    if (response && response.status === 200) {
                                                        var msg = 'Face Verified and Attendance marked Successfully';
                                                        _this.showSuccessToast(msg);
                                                        window.location.reload();
                                                    }
                                                }, function (error) {
                                                    var msg = 'Attendance Not Marked';
                                                    console.log(error);
                                                    _this.showSuccessToast(msg);
                                                    _this.closeLoader();
                                                });
                                            }
                                        }
                                        else {
                                            _this.closeLoader();
                                            var msg = "Unable to verify face, please try again";
                                            _this.showSuccessToast(msg);
                                        }
                                    }, function (error) {
                                        _this.closeLoader();
                                        var msg = "Unable to verify face, please try again";
                                        _this.showSuccessToast(msg);
                                    });
                                }
                            }
                            else {
                                console.log("error in detecting face");
                                _this.closeLoader();
                                var msg = "Face not Detected, please try again";
                                _this.showSuccessToast(msg);
                            }
                        }, function (error) {
                            console.log("errors");
                            console.log(error.json());
                            if (error.json().status == "false") {
                                var msg = "You are currently not at the site location";
                                _this.showSuccessToast(msg);
                                _this.closeLoader();
                            }
                        });
                    }, function (error) {
                        console.log("errors");
                        console.log("errors");
                        console.log(error.json());
                        if (error.json().status === "false") {
                            var msg = "You are currently not at the site location";
                            _this.showSuccessToast(msg);
                            _this.closeLoader();
                        }
                        else {
                            var msg = "You are currently not at the site location";
                            _this.showSuccessToast(msg);
                            _this.closeLoader();
                        }
                    });
                }).catch(function (error) {
                    console.log("Location error");
                    _this.lattitude = 0;
                    _this.longitude = 0;
                    var msg = "Unable to get location";
                    _this.showSuccessToast(msg);
                    _this.closeLoader();
                });
            }
            // this.navCtrl.push(AttendanceViewPage,imageData)
        }, function (err) {
            console.log("Location error");
            _this.lattitude = 0;
            _this.longitude = 0;
            var msg = "Unable to get location";
            _this.showSuccessToast(msg);
        });
    };
    EmployeeSiteListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site-employee-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site-employeeList/site-employeeList.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary" >\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Select Site</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-list class="emp-list">\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border emp">\n      <p text-left class="fnt-wt" text-capitalize>\n        {{site.name}}\n          <span style="float: right">\n            <button ion-button  (click)="viewCamera(site.id,\'enroll\')"  >Enroll</button>\n            <span *ngIf="employee.faceAuthorised">\n              <button ion-button color="orange" (click)="viewCamera(site.id,\'checkIn\')" *ngIf="!checkedIn" >Check - In</button>\n              <button ion-button color="orange" (click)="viewCamera(site.id,\'checkOut\')" *ngIf="checkedIn">Check - Out</button>\n            </span>\n          </span>\n      </p>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site-employeeList/site-employeeList.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */],
            __WEBPACK_IMPORTED_MODULE_8__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_9__service_employeeService__["a" /* EmployeeService */]])
    ], EmployeeSiteListPage);
    return EmployeeSiteListPage;
}());

//# sourceMappingURL=site-employeeList.js.map

/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return componentService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__ = __webpack_require__(99);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var componentService = (function () {
    function componentService(loadingCtrl, toast, toastCtrl) {
        this.loadingCtrl = loadingCtrl;
        this.toast = toast;
        this.toastCtrl = toastCtrl;
    }
    // Loader
    componentService.prototype.showLoader = function (msg) {
        this.loader = this.loadingCtrl.create({
            content: msg
        });
        this.loader.present();
    };
    componentService.prototype.closeLoader = function () {
        this.loader.dismiss();
    };
    componentService.prototype.closeAll = function () {
        this.loader.dismissAll();
    };
    componentService.prototype.showToastMessage = function (msg, align) {
        this.toast.show(msg, '3000', align).subscribe(function (toast) {
            console.log(toast);
        });
    };
    componentService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_3__ionic_native_toast__["a" /* Toast */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["ToastController"]])
    ], componentService);
    return componentService;
}());

//# sourceMappingURL=componentService.js.map

/***/ }),

/***/ 198:
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
webpackEmptyAsyncContext.id = 198;

/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/attendance-list/attendance-list.module": [
		862,
		4
	],
	"../pages/attendance-view/attendance-view.module": [
		863,
		3
	],
	"../pages/login/login.module": [
		864,
		2
	],
	"../pages/site-employeeList/site-employeeList.module": [
		865,
		1
	],
	"../pages/site-list/site-list.module": [
		866,
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
webpackAsyncContext.id = 243;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var SiteService = (function () {
    function SiteService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
    }
    SiteService.prototype.searchSite = function () {
        return this.http.get(this.config.Url + 'api/site').map(function (response) {
            return response;
        });
    };
    SiteService.prototype.findSitesByProject = function (projectId) {
        return this.http.get(this.config.Url + 'api/project/' + projectId + '/sites').map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    SiteService.prototype.searchProjects = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/project/search', searchCriteria).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    SiteService.prototype.getAllProjects = function () {
        return this.http.get(this.config.Url + 'api/project/').map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    SiteService.prototype.findSites = function (projectId) {
        return this.http.get(this.config.Url + 'api/project/' + projectId + '/sites').map(function (response) {
            return response;
        });
    };
    SiteService.prototype.searchSiteEmployee = function (siteId) {
        return this.http.get(this.config.Url + 'api/employee/site/' + siteId).map(function (response) {
            return response;
        });
    };
    SiteService.prototype.getSites = function (employeeId) {
        return this.http.get(this.config.Url + 'api/site/employee/' + employeeId).map(function (response) {
            console.log(response);
            return response;
        });
    };
    SiteService.prototype.createSite = function (site) {
        return this.http.post(this.config.Url + 'api/site', site).map(function (response) {
            console.log(response);
            return response;
        });
    };
    SiteService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], SiteService);
    return SiteService;
}());

//# sourceMappingURL=siteService.js.map

/***/ }),

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_employeeService__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__rate_card_create_rate_card__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__jobs_add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__employee_list_create_employee__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__attendance_attendance__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__jobs_completeJob__ = __webpack_require__(156);
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
    function DashboardPage(renderer, myService, loadingCtrl, navCtrl, component, authService, modalCtrl, datePickerProvider, siteService, employeeService, jobService, events) {
        var _this = this;
        this.renderer = renderer;
        this.myService = myService;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.component = component;
        this.authService = authService;
        this.modalCtrl = modalCtrl;
        this.datePickerProvider = datePickerProvider;
        this.siteService = siteService;
        this.employeeService = employeeService;
        this.jobService = jobService;
        this.events = events;
        this.spinner = true;
        this.empSpinner = false;
        this.events.subscribe('userType', function (type) {
            console.log("User type event");
            console.log(type);
            _this.userType = type;
        });
        this.categories = 'overdue';
        this.selectDate = new Date();
        this.searchCriteria = {};
        /* this.categories = [
           'overdue','upcoming','completed'
           ];
           */
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
        var _this = this;
        // demo.initFullCalendar();
        this.siteService.searchSite().subscribe(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
        this.employeeService.getAllEmployees().subscribe(function (response) {
            console.log('ionViewDidLoad Employee list:');
            console.log(response);
            _this.employee = response;
            _this.empSpinner = false;
            _this.component.closeLoader();
        }, function (error) {
            console.log('ionViewDidLoad SitePage:' + error);
            _this.component.closeLoader();
        });
        this.siteService.searchSite().subscribe(function (response) {
            console.log('ionViewDidLoad SitePage:');
            console.log(response.json());
            _this.sites = response.json();
            _this.spinner = false;
            _this.empSpinner = true;
            _this.component.closeLoader();
        }, function (error) {
            console.log('ionViewDidLoad SitePage:' + error);
            _this.component.closeLoader();
        });
        this.searchCriteria = {
            checkInDateTimeFrom: new Date()
        };
        this.searchJobs(this.searchCriteria);
    };
    DashboardPage.prototype.searchJobs = function (searchCriteria) {
        var _this = this;
        this.component.showLoader('Getting Jobs');
        searchCriteria.CheckInDateTimeFrom = new Date(searchCriteria.checkInDateTimeFrom);
        this.jobService.getJobs(searchCriteria).subscribe(function (response) {
            console.log("Jobs from search criteria");
            console.log(response);
            _this.allJobs = response;
            _this.component.closeLoader();
        });
    };
    DashboardPage.prototype.getAllJobs = function (sDate) {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        console.log("selected date");
        console.log(sDate);
        var currDate = new Date(sDate);
        var search = { checkInDateTimeFrom: currDate };
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("All jobs of current user");
            console.log(response);
            _this.allJobs = response;
            _this.component.closeLoader();
        });
    };
    DashboardPage.prototype.first = function (emp) {
        this.firstLetter = emp.charAt(0);
    };
    DashboardPage.prototype.fabClick = function (fab) {
        if (fab == 'ratecard') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__rate_card_create_rate_card__["a" /* CreateRateCardPage */]);
        }
        else if (fab == 'job') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__jobs_add_job__["a" /* CreateJobPage */]);
        }
        else if (fab == 'quotation') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__quotation_create_quotation__["a" /* CreateQuotationPage */]);
        }
        else if (fab == 'employee') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__employee_list_create_employee__["a" /* CreateEmployeePage */]);
        }
        else if (fab == 'attendance') {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__attendance_attendance__["a" /* AttendancePage */]);
        }
    };
    DashboardPage.prototype.showCalendar = function () {
        var _this = this;
        var dateSelected = this.datePickerProvider.showCalendar(this.modalCtrl);
        dateSelected.subscribe(function (date) {
            // this.selectDate=date;
            _this.searchCriteria.checkInDateTimeFrom = date;
            // this.getAllJobs(this.selectDate)
            _this.searchJobs(_this.searchCriteria);
            console.log("first date picker: date selected is", date);
        });
    };
    DashboardPage.prototype.selectEmployee = function (emp) {
        console.log("Selected Employee");
        console.log(emp.id + " " + emp.name);
        this.searchCriteria = {
            employeeId: emp.id
        };
        this.searchJobs(this.searchCriteria);
    };
    DashboardPage.prototype.activeSite = function (id) {
        var _this = this;
        // var search={siteId:id};
        console.log("Selected Site Id");
        console.log(id);
        this.selectSite = true;
        this.searchCriteria = {
            siteId: id
        };
        this.searchJobs(this.searchCriteria);
        this.empSpinner = true;
        this.siteService.searchSiteEmployee(id).subscribe(function (response) {
            console.log(response.json());
            if (response.json().length !== 0) {
                _this.employee = response.json();
                _this.empSpinner = false;
                _this.empSelect = false;
                console.log("Spinner:" + _this.empSpinner);
                console.log(_this.employee);
            }
            else {
                _this.empSelect = true;
                _this.empSpinner = false;
                _this.employee = [];
            }
        }, function (error) {
            console.log(error);
            console.log(_this.employee);
        });
    };
    DashboardPage.prototype.compeleteJob = function (job) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__jobs_completeJob__["a" /* CompleteJobPage */], { job: job });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('date'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], DashboardPage.prototype, "MyCalendar", void 0);
    DashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-dashboard',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/dashboard/dashboard.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Dashboard</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n    <ion-fab right bottom>\n        <button ion-fab color="dark">\n            <ion-icon name="md-add" class="clr-orange"></ion-icon>\n        </button>\n        <ion-fab-list side="top" fab-list-margin >\n            <ion-label color="dark" class="margin0" *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'">Quotation</ion-label>\n            <button ion-fab color="primary" *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'" (click)="fabClick(\'quotation\')">\n                <i class="material-icons clr-blk">receipt</i>\n            </button>\n            <ion-label color="dark"  class="margin0">Job</ion-label>\n            <button ion-fab color="primary" (click)="fabClick(\'job\')">\n                <i class="material-icons clr-blk">description</i>\n            </button>\n\n            <ion-label *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'"  color="dark"  class="margin0">Attendance</ion-label>\n            <button *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'"  ion-fab color="primary" (click)="fabClick(\'attendance\')">\n                <i class="material-icons clr-blk">content_paste</i>\n            </button>\n            <ion-label color="dark" *ngIf="userType === \'ADMIN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'" class="margin0">Employee</ion-label>\n            <button ion-fab color="primary" *ngIf="userType === \'ADMIN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'" (click)="fabClick(\'employee\')">\n                <i class="material-icons clr-blk">people</i>\n            </button>\n            <ion-label *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'"   color="dark" class="margin0">Rate Card</ion-label>\n            <button *ngIf="userType === \'ADMIN\' || userType === \'TECHNICIAN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\'"  ion-fab color="primary" (click)="fabClick(\'ratecard\')">\n                <i class="material-icons clr-blk">description</i>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n    <!--\n    <ion-fab right bottom>\n        <button ion-fab color="dark"><ion-icon name="arrow-dropleft"></ion-icon></button>\n        <ion-fab-list side="top">\n            <button ion-fab><i class="material-icons">receipt</i>Add Quotation</button>\n            <button ion-fab><i class="material-icons">description</i>Add</button>\n            <button ion-fab><i class="material-icons">description</i>Add</button>\n        </ion-fab-list>\n    </ion-fab>\n    -->\n    <ion-row class="margin0 padding-top15">\n        <ion-col col-8 class="align-right">\n            <p  text-right class="fnt-18 date-txt" (click)="showCalendar()">\n                <ion-icon ios="ios-calendar" md="md-calendar" class="green fnt-25 padding-right10"></ion-icon>\n                <span class="clr-black">{{selectDate | date:\'d\' }}</span>\n                <span class="clr-orange">{{selectDate | date:\'MMM\' }}</span>\n                <span class="clr-black">{{selectDate | date:\'y\' }}</span>\n            </p>\n        </ion-col>\n        <ion-col col-4 class="padding-right5 align-right">\n            <!--<p text-right class="fnt-18" (click)="showCalendar()"><ion-icon ios="ios-calendar" md="md-calendar" class="green fnt-25 padding-right10"></ion-icon></p>-->\n        </ion-col>\n    </ion-row>\n\n <!--\n  <div class="wrapper">\n    <ion-toolbar>\n      <ion-segment  color="secondary">\n        <ion-segment-button value="camera">\n          <ion-icon name="camera"></ion-icon>\n        </ion-segment-button>\n      </ion-segment>\n    </ion-toolbar>\n-->\n    <!--\nTip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\nTip 2: you can also add an image using data-image tag\n-->\n\n\n\n\n\n    <!--\n    <ion-row >\n        <ion-col col-6 class="margin-auto">\n            <div class="form-group label-floating">\n                <ion-select [(ngModel)]="empName" class="select-box" placeholder="Choose Employee">\n                    <ion-option *ngFor="let emp of employee;let i of index" [value]="emp.name">{{emp.name}}</ion-option>\n                </ion-select>\n            </div>\n        </ion-col>\n\n    </ion-row>\n    -->\n\n    <div class="SiteCon">\n        <div text-center>\n            <p class="margin0"><span class="margin-right15">Sites</span><span class="padding-left5" *ngIf="spinner"><ion-spinner name="bubbles"></ion-spinner></span></p>\n        </div>\n        <div class="container-fluid container-scroll hariz-scroll-con">\n\n            <div class="row">\n                <button class="siteBtn" ion-button round color="light"  *ngFor="let site of sites;let i of index" (click)="activeSite(site.id)" [ngClass]="{\'bg-orange\':selectSite}">\n                    <p class="siteName">{{site.name}}</p>\n                </button>\n            </div>\n        </div>\n    </div>\n\n    <div class="EmpCon" style="padding-bottom:10px;">\n\n        <div text-center>\n            <p class="margin0"><span class="margin-right15">Employees</span><span class="padding-left5" *ngIf="empSpinner"><ion-spinner name="bubbles"></ion-spinner></span></p>\n\n        </div>\n        <div class="container-fluid container-scroll hariz-scroll-con">\n            <div *ngIf="empSelect">\n                <p text-center class="margin0 clr-orange">No Employee</p>\n            </div>\n            <div class="row">\n\n            <span *ngFor="let emp of employee;let i of index" class="Nametxt">\n                <!--<ion-avatar item-start *ngIf="emp.enrolled_face" class="emp-round width-round">-->\n                <!--<img  [src]="emp.enrolled_face" >-->\n                <!--</ion-avatar>-->\n                <!--<p *ngIf="!emp.enrolled_face && first(emp.name)"></p>-->\n                <p *ngIf="first(emp.name)"></p>\n                <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round">\n                    <p class="margin-auto"> {{firstLetter}}</p>\n                </ion-avatar>\n                <!--<p text-left>{{emp.name}}</p>-->\n            </span>\n            </div>\n        </div>\n\n    </div>\n\n\n\n\n    <!--\n        <ion-segment [(ngModel)]="cat" class="" color="clr-blue">\n            <div *ngFor="let c of categories">\n                <ion-segment-button [value]="c" (click)="getAllJobs()">\n                    {{c}}\n                </ion-segment-button>\n            </div>\n        </ion-segment>\n     -->\n\n\n\n\n        <ion-segment [(ngModel)]="categories" class="" color="clr-blue">\n            <ion-segment-button value="overdue">\n                Overdue\n            </ion-segment-button>\n            <ion-segment-button value="upcoming">\n                Upcoming\n            </ion-segment-button>\n            <ion-segment-button value="completed">\n                Completed\n            </ion-segment-button>\n        </ion-segment>\n\n    <div class="main-panel" >\n\n      <div class="content margin-top0 padding0">\n        <div class="container-fluid padding0">\n\n          <div class="row margin0">\n            <ion-col col-12 class="margin-auto">\n\n<!--\n                <div [ngSwitch]="cat">\n                    <div *ngFor="let c of categories">\n                            <ion-list *ngSwitchCase="c">\n                                    <div *ngFor="let job of allJobs">\n                                        <div class="card"  *ngIf="(c | uppercase) == job.status" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                                            <div class="card-content padding-bottom0" >\n                                                <ion-row class="margin0">\n                                                    <ion-col col-12 class="padding-right0">\n                                                        <button ion-button icon-left icon-only clear class="pop-icon">\n                                                            <ion-icon name="md-create" class="fnt-12 padding0"></ion-icon>\n                                                        </button>\n                                                    </ion-col>\n                                                </ion-row>\n                                                <ion-row class="margin0">\n                                                    <ion-col col-8 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n                                                    <ion-col col-4 class="padding-right0">\n                                                        <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n                                                            {{job.status}}\n                                                        </p>\n                                                    </ion-col>\n                                                </ion-row>\n                                                <p>{{job.employeeName}}</p>\n                                                <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n                                            </div>\n\n                                            <div class="card-footer">\n                                                <div *ngIf="job.status !=\'COMPLETED\'">\n                                                    <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                                                </div>\n                                                <div *ngIf="job.status ==\'COMPLETED\'">\n                                                    <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n                                                </div>\n                                                <div class="stats align-right">\n\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                            </ion-list>\n                    </div>\n                </div>\n\n                -->\n\n\n\n\n                <div [ngSwitch]="categories">\n                        <ion-list *ngSwitchCase="\'overdue\'">\n                            <ion-refresher (ionRefresh)="doRefresh($event,all)">\n                                <ion-refresher-content></ion-refresher-content>\n                            </ion-refresher>\n                            <div  class="white-bg" *ngFor="let job of allJobs; let i = index" >\n                                <div *ngIf="job.status == \'OVERDUE\'">\n\n                                <div class="padding-left16 padding-top5">\n                                    <ion-row class="margin0">\n\n                                        <ion-col col-2 class="ver-center">\n                                            <button ion-button clear color="primary" class="icon-round"\n                                                    [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                                                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n                                            </button>\n                                        </ion-col>\n                                        <ion-col col-10 class="padding-left5">\n                                            <div class="border-btm padding-bottom5 ln-ght20" text-capitalize (click)="compeleteJob(job)">\n                                                <p text-left class="margin0">{{job.title}}</p>\n                                                <p text-left class="margin0">{{job.employeeName}}</p>\n                                                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n                                            </div>\n                                        </ion-col>\n                                        <!--\n                                        <ion-col col-1>\n                                            <p (click)="open(ItemSliding,Item)">f</p>\n                                        </ion-col>\n                                        -->\n\n                                    </ion-row>\n                                </div>\n\n                                    <ion-item class="item-fnt padding-left0" >\n                                        <!--<div class="padding-left16">-->\n\n                                        <div text-capitalize >\n                                            <ion-row class="margin0">\n                                                <ion-col col-6 class="padding-right5">\n                                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                                    </div>\n                                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                                    </div>\n                                                </ion-col>\n                                                <ion-col col-6>\n                                                    <div *ngIf="job.status ==\'COMPLETED\'">\n                                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                                    </div>\n                                                    <div *ngIf="job.status !=\'COMPLETED\'">\n                                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                                    </div>\n                                                </ion-col>\n                                            </ion-row>\n                                        </div>\n                                        <!--</div>-->\n                                    </ion-item>\n\n                                </div>\n                            </div>\n                        </ion-list>\n\n\n\n                    <ion-list *ngSwitchCase="\'upcoming\'">\n                        <ion-refresher (ionRefresh)="doRefresh($event,all)">\n                            <ion-refresher-content></ion-refresher-content>\n                        </ion-refresher>\n                        <div  class="white-bg" *ngFor="let job of allJobs" >\n                            <div *ngIf="job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\'">\n                            <div class="padding-left16 padding-top5" >\n                                <ion-grid>\n                                <ion-row class="margin0">\n\n                                    <ion-col col-2 class="ver-center">\n                                        <button ion-button clear color="primary" class="icon-round ion-circle-icons"\n                                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n                                        </button>\n                                    </ion-col>\n                                    <ion-col col-9 class="padding-left15">\n                                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize (click)="completeJob(job)">\n                                            <p text-left class="margin0">{{job.title}}</p>\n                                            <p text-left class="margin0">{{job.employeeName}}</p>\n                                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n                                        </div>\n                                    </ion-col>\n\n                                </ion-row>\n                                </ion-grid>\n                            </div>\n\n                            <ion-item class="item-fnt padding-left0" >\n                                <!--<div class="padding-left16">-->\n\n                                <div text-capitalize >\n                                    <ion-row class="margin0">\n                                        <ion-col col-5 class="">\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                        </ion-col>\n                                        <ion-col col-6>\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                        </ion-col>\n                                    </ion-row>\n                                </div>\n                                <!--</div>-->\n                            </ion-item>\n\n                            </div>\n                        </div>\n                    </ion-list>\n\n\n                    <ion-list *ngSwitchCase="\'completed\'">\n                        <ion-refresher (ionRefresh)="doRefresh($event,all)">\n                            <ion-refresher-content></ion-refresher-content>\n                        </ion-refresher>\n                        <div  class="white-bg" *ngFor="let job of allJobs" >\n                            <div *ngIf="job.status ==\'COMPLETED\'">\n                            <div class="padding-left16 padding-top5">\n                                <ion-row class="margin0">\n\n                                    <ion-col col-2 class="ver-center">\n\n                                        <button ion-button clear color="primary" class="icon-round"\n                                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n                                        </button>\n                                    </ion-col>\n                                    <ion-col col-10 class="padding-left5">\n                                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n                                            <p text-left class="margin0">{{job.title}}</p>\n                                            <p text-left class="margin0">{{job.employeeName}}</p>\n                                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n                                        </div>\n                                    </ion-col>\n                                    <!--\n                                    <ion-col col-1>\n                                        <p (click)="open(ItemSliding,Item)">f</p>\n                                    </ion-col>\n                                    -->\n\n                                </ion-row>\n                            </div>\n\n                            <ion-item class="item-fnt padding-left0" >\n                                <!--<div class="padding-left16">-->\n\n                                <div text-capitalize >\n                                    <ion-row class="margin0">\n                                        <ion-col col-6 class="padding-right5">\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                        </ion-col>\n                                        <ion-col col-6>\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                                            </div>\n                                        </ion-col>\n                                    </ion-row>\n                                </div>\n                                <!--</div>-->\n                            </ion-item>\n\n                            </div>\n                        </div>\n                    </ion-list>\n                </div>\n            </ion-col>\n          </div>\n        </div>\n      </div>\n    </div>\n\n</ion-content>\n<!--\n<script type="text/javascript">\n    $(document).ready(function() {\n        demo.initFullCalendar();\n    });\n</script>\n-->`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/dashboard/dashboard.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"],
            __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__["DatePickerProvider"], __WEBPACK_IMPORTED_MODULE_5__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_6__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], DashboardPage);
    return DashboardPage;
}());

//# sourceMappingURL=dashboard.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var QuotationService = (function () {
    function QuotationService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
    }
    QuotationService.prototype.getRateCardTypes = function () {
        return this.http.get(this.config.QuotationServiceUrl + 'api/rateCardTypes').map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    QuotationService.prototype.getRateTypes = function () {
        return this.http.get(this.config.QuotationServiceUrl + 'api/rateCard/types').map(function (response) {
            console.log(response);
            return response;
        });
    };
    QuotationService.prototype.getUOMTypes = function () {
        return this.http.get(this.config.QuotationServiceUrl + 'api/rateCard/uom').map(function (response) {
            console.log(response);
            return response;
        });
    };
    QuotationService.prototype.createRateCard = function (rateCard) {
        return this.http.post(this.config.QuotationServiceUrl + 'api/rateCard/create', rateCard).map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    QuotationService.prototype.getRateCards = function () {
        return this.http.get(this.config.QuotationServiceUrl + 'api/rateCard').map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.getQuotations = function (id) {
        return this.http.get(this.config.QuotationServiceUrl + 'api/quotation/' + id).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.createQuotation = function (quotation) {
        return this.http.post(this.config.QuotationServiceUrl + 'api/quotation/create', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.editQuotation = function (quotation) {
        return this.http.post(this.config.QuotationServiceUrl + 'api/quotation/edit', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.sendQuotation = function (quotation) {
        return this.http.post(this.config.QuotationServiceUrl + 'api/quotation/send', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.approveQuotation = function (quotation) {
        return this.http.post(this.config.QuotationServiceUrl + 'api/quotation/approve', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], QuotationService);
    return QuotationService;
}());

//# sourceMappingURL=quotationService.js.map

/***/ }),

/***/ 40:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var JobService = (function () {
    function JobService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
    }
    JobService.prototype.getTodayJobs = function () {
        return this.http.post(this.config.Url + 'api/jobs/search', { checkInDateTimeFrom: new Date() }).map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    JobService.prototype.getJobs = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/jobs/search', searchCriteria).map(function (response) {
            console.log(response);
            var allJobs = response.json();
            return allJobs.transactions;
        });
    };
    JobService.prototype.createJob = function (job) {
        return this.http.post(this.config.Url + 'api/job', job).map(function (response) {
            return response;
        });
    };
    JobService.prototype.checkOutJob = function (job) {
        return this.http.post(this.config.Url + 'api/employee/out', job).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    JobService.prototype.loadCheckLists = function () {
        return this.http.get(this.config.Url + 'api/checklist').map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    JobService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], JobService);
    return JobService;
}());

//# sourceMappingURL=jobService.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendanceService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var AttendanceService = (function () {
    function AttendanceService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
    }
    AttendanceService.prototype.getSiteAttendances = function (siteId) {
        return this.http.get(this.config.Url + 'api/attendance/site/' + siteId).map(function (response) {
            return response;
        });
    };
    AttendanceService.prototype.markAttendanceCheckIn = function (siteId, empId, lat, long, imageData) {
        return this.http.post(this.config.Url + 'api/attendance', { siteId: siteId, employeeEmpId: empId, latitudeIn: lat, longitudeIn: long, checkInImage: imageData }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    AttendanceService.prototype.markAttendanceCheckOut = function (siteId, empId, lat, long, imageData, attendanceId) {
        return this.http.post(this.config.Url + 'api/attendance/save', { siteId: siteId, employeeEmpId: empId, latitudeOut: lat, longitudeOut: long, checkOutImage: imageData, id: attendanceId }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    AttendanceService.prototype.getAttendances = function (employeeId) {
        return this.http.post(this.config.Url + 'api/attendance/' + employeeId, { employeeId: employeeId }).map((function (response) {
            console.log(response);
            return response;
        }));
    };
    AttendanceService.prototype.getEmployeeAttendances = function (employeeId) {
        return this.http.post(this.config.Url + 'api/attendance/' + employeeId, { employeeId: employeeId }).map((function (response) {
            console.log(response);
            return response;
        }));
    };
    AttendanceService.prototype.getAllAttendances = function () {
        return this.http.get(this.config.Url + 'api/attendance/').map((function (response) {
            console.log(response);
            return response.json();
        }));
    };
    AttendanceService.prototype.searchAttendances = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/attendance/search', searchCriteria).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    AttendanceService.prototype.checkSiteProximity = function (siteId, lat, lng) {
        return this.http.get(this.config.LocationServiceUrl + 'api/site/nearby?' + 'siteId=' + siteId + '&' + 'lat=' + lat + '&lng=' + lng).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            return error;
        });
    };
    AttendanceService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], AttendanceService);
    return AttendanceService;
}());

//# sourceMappingURL=attendanceService.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewJobPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ViewJobPage = (function () {
    function ViewJobPage(navCtrl, navParams, authService, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.jobDetails = this.navParams.get('job');
    }
    ViewJobPage.prototype.ionViewWillEnter = function () {
    };
    ViewJobPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-view-job',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/view-job.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Jobs</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n\n\n    <div class="card" >\n\n                    <div class="card-content padding-bottom0" >\n                        <div>\n                            {{jobDetails.description}}\n                            {{jobDetails.employeeId}}\n                            {{jobDetails.employeeName}}\n                        </div>\n\n                    </div>\n\n                    <div class="card-footer">\n\n                    </div>\n\n\n    </div>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/view-job.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"]])
    ], ViewJobPage);
    return ViewJobPage;
}());

//# sourceMappingURL=view-job.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobPopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var JobPopoverPage = (function () {
    function JobPopoverPage(navCtrl, viewCtrl, popoverCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navParams = navParams;
        this.img = this.navParams.get('i');
        this.index = this.navParams.get('ind');
    }
    JobPopoverPage.prototype.deleteImg = function (index) {
        this.viewCtrl.dismiss(index);
    };
    JobPopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-job-popover',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/job-popover.html"*/`<ion-content>\n\n    <div>\n        <img [src]="img" class="job-img margin-bottom25">\n    </div>\n    <div class="align-center">\n        <button ion-button clear color="danger" (click)="deleteImg(index)" icon-only><ion-icon name="trash"></ion-icon></button>\n    </div>\n\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/jobs/job-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], JobPopoverPage);
    return JobPopoverPage;
}());

//# sourceMappingURL=job-popover.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateQuotationPage2; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quotation_popover__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_siteService__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CreateQuotationPage2 = (function () {
    function CreateQuotationPage2(navCtrl, modalCtrl, navParams, popoverCtrl, evts, authService, alertCtrl, componentService, quotationService, siteService) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.evts = evts;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.componentService = componentService;
        this.quotationService = quotationService;
        this.siteService = siteService;
        this.val = 0;
        this.grandTotal = 0;
        console.log(this.navParams.get('quotationDetails'));
        var quotationDetails = this.navParams.get('quotationDetails');
        this.quotation = this.navParams.get('quotationDetails');
        this.rateCardType = {};
        this.rates = [];
        this.showRateInformation = false;
        this.selectedSite = null;
        console.log(window.localStorage.getItem('employeeUserId'));
        console.log(window.localStorage.getItem('employeeId'));
        console.log(window.localStorage.getItem('employeeFullName'));
        var employeeDetails = JSON.parse(window.localStorage.getItem('employeeDetails'));
        this.sentByUserId = employeeDetails.employee.id;
        this.sentByUserName = employeeDetails.employee.fullName;
    }
    CreateQuotationPage2.prototype.selectSite = function (site) {
        var _this = this;
        this.selectedSite = site;
        this.authService.getClientDetails(site.id).subscribe(function (response) {
            console.log(response);
            _this.sentToUserId = response.id;
            _this.sentToUserName = response.name;
            _this.clientEmailId = response.email;
        });
    };
    CreateQuotationPage2.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.siteService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.allSites = response.json();
        });
        this.getRateCardTypes();
    };
    CreateQuotationPage2.prototype.getSiteEmployees = function (siteId) {
        var _this = this;
        this.siteService.searchSiteEmployee(siteId).subscribe(function (response) {
            console.log(response.json());
            _this.siteEmployees = response.json();
        });
    };
    CreateQuotationPage2.prototype.saveQuotation = function (quotation) {
        console.log(quotation);
        this.quotationService.createQuotation(quotation).subscribe(function (response) {
            console.log(response);
        });
    };
    CreateQuotationPage2.prototype.getRateCardTypes = function () {
        var _this = this;
        this.quotationService.getRateCardTypes().subscribe(function (response) {
            console.log("Rate Card types");
            console.log(_this.rateCardTypes);
            _this.rateCardTypes = response;
        });
    };
    CreateQuotationPage2.prototype.showAdd = function (type) {
        this.showRateInformation = true;
        this.rateCardType = type.title;
        this.uom = type.uom;
    };
    CreateQuotationPage2.prototype.selectUOMType = function (type) {
        var rateCard = {
            type: '',
            uom: '',
            name: '',
            cost: ''
        };
        rateCard.type = type.name;
        rateCard.uom = type.uom;
        // this.quotationDetails.rateCard.push(rateCard);
        // console.log(this.quotationDetails);
    };
    CreateQuotationPage2.prototype.addRates = function (eve) {
        var _this = this;
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_3__quotation_popover__["a" /* QuotationPopoverPage */]);
        popover.present({
            ev: eve
        });
        popover.onDidDismiss(function (data) {
            _this.rates.push(data);
            _this.grandTotal = _this.grandTotal + data.total;
            console.log(_this.rates);
        });
    };
    CreateQuotationPage2.prototype.remove = function (index) {
        console.log(this.grandTotal);
        this.grandTotal = this.grandTotal - this.rates[index].total;
        console.log(this.grandTotal);
        this.rates.pop(index);
    };
    CreateQuotationPage2.prototype.addTotal = function (i, no, cost) {
        this.index = i;
        console.log("add total");
        this.grandTotal = Math.abs(this.grandTotal - this.rates[i].total);
        this.rates[i].total = no * cost;
        console.log(this.rates[i].total);
        console.log(no + " * " + cost);
        console.log(this.grandTotal);
        this.grandTotal = this.grandTotal + this.rates[i].total;
        console.log("add total-------:" + this.grandTotal);
    };
    CreateQuotationPage2.prototype.saveRates = function () {
        var _this = this;
        var quotationDetails = {
            "title": this.quotation.title,
            "description": this.quotation.description,
            "rateCardDetails": this.rates,
            "sentByUserId": this.sentByUserId,
            "sentByUserName": this.sentByUserName,
            "sentToUserId": this.sentToUserId,
            "sentToUserName": this.sentToUserName,
            "createdByUserId": this.sentByUserId,
            "createdByUserName": this.sentByUserName,
            "clientEmailId": this.clientEmailId,
            "siteId": this.selectedSite.id,
            "siteName": this.selectedSite.name,
            "grandTotal": this.grandTotal,
            "isDrafted": true
        };
        this.quotationService.createQuotation(quotationDetails).subscribe(function (response) {
            console.log(response);
            _this.componentService.showToastMessage('Quotation Successfully Drafted', 'bottom');
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__quotation__["a" /* QuotationPage */]);
        }, function (err) {
            _this.componentService.showToastMessage('Error in drafting quotation, your changes cannot be saved!', 'bottom');
        });
        // this.navCtrl.push(CreateQuotationPage3,{rate:this.rates,quotation:this.quotation,site:this.selectedSite})
    };
    CreateQuotationPage2.prototype.sendQuotation = function () {
        var quotationDetails = {
            "title": this.quotation.title,
            "description": this.quotation.description,
            "rateCardDetails": this.rates,
            "sentByUserId": this.sentByUserId,
            "sentByUserName": this.sentByUserName,
            "sentToUserId": this.sentToUserId,
            "sentToUserName": this.sentToUserName,
            "createdByUserId": this.sentByUserId,
            "createdByUserName": this.sentByUserName,
            "clientEmailId": this.clientEmailId,
            "siteId": this.selectedSite.id,
            "siteName": this.selectedSite.name,
            "grandTotal": this.grandTotal,
            "isSubmitted": true
        };
        this.quotationService.editQuotation(quotationDetails).subscribe(function (response) {
            console.log(response);
        });
    };
    CreateQuotationPage2 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-create-quotation-step2',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation-step-2.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Add-Rates</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <ion-fab bottom right>\n        <button mini (click)="addRates($event)"  ion-fab><ion-icon name="add"></ion-icon></button>\n    </ion-fab>\n\n    <ion-col col-10>\n        <div class="card-content white-bg">\n                <div class="form-group label-floating width80 margin-auto padding-bottom3">\n                    <ion-select style="color: black" [(ngModel)]="selectedSite" class="select-box" placeholder="Choose Site">\n                        <ion-option style="color: black;" *ngFor="let site of allSites" [value]="site.name" (ionSelect)="selectSite(site)" >{{site.name}}</ion-option>\n                    </ion-select>\n                </div>\n        </div>\n    </ion-col>\n\n    <div class="card-content white-bg">\n        <div class="table-responsive">\n            <table class="table table-scroll">\n                <thead>\n                <tr>\n                    <th class="text-center">Type</th>\n                    <th class="text-center">Name</th>\n                    <th class="text-center">Rate</th>\n                    <th class="text-center">No</th>\n                    <th class="text-center">Uom</th>\n                    <th class="text-center">Total</th>\n                    <th class="text-center">&nbsp;&nbsp;&nbsp;&nbsp;</th>\n                </tr>\n                </thead>\n                <tbody>\n                <tr *ngFor="let rate of rates;let i = index ">\n                    <td class="text-center">{{rate.type}}</td>\n                    <td class="text-center table-data">{{rate.name}}</td>\n                    <td class="text-center">{{rate.cost}}</td>\n                    <td class="text-center">\n                        <input type="number" class="form-control align-center width15" [(ngModel)]="rate.no" (change)="addTotal(i,rate.no,rate.cost)">\n                    </td>\n                    <td class="text-center">{{rate.uom}}</td>\n                    <td class="text-center">{{rate.total}}</td>\n                    <td class="td-actions text-center">\n                        <i class="material-icons clr-red" (click)="remove(i)">close</i>\n                    </td>\n                </tr>\n                <tr>\n                    <td></td>\n                    <td></td>\n                    <td></td>\n                    <td></td>\n                    <td class="text-center">Grand Total</td>\n                    <td class="text-center">{{grandTotal}}</td>\n                    <td></td>\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n\n</ion-content>\n\n<ion-footer>\n    <ion-toolbar class="align-right" >\n        <button class="btn btn-warning center pull-left"  >\n            Save\n        </button>\n        <button class="btn btn-success center pull-right" (click)="saveRates()">\n            Submit <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </button>\n    </ion-toolbar>\n</ion-footer>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation-step-2.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"], __WEBPACK_IMPORTED_MODULE_5__service_componentService__["a" /* componentService */],
            __WEBPACK_IMPORTED_MODULE_6__service_quotationService__["a" /* QuotationService */], __WEBPACK_IMPORTED_MODULE_7__service_siteService__["a" /* SiteService */]])
    ], CreateQuotationPage2);
    return CreateQuotationPage2;
}());

//# sourceMappingURL=create-quotation-step-2.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendancePopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
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
    function AttendancePopoverPage(navCtrl, popoverCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.navParams = navParams;
        this.img = this.navParams.get('i');
    }
    AttendancePopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-attendance-popover',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance/attendance-popover.html"*/`<ion-content>\n\n    <div>\n        <img [src]="img">\n    </div>\n\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance/attendance-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], AttendancePopoverPage);
    return AttendancePopoverPage;
}());

//# sourceMappingURL=attendance-popover.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_jobService__ = __webpack_require__(40);
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
    function CustomerDetailPage(navCtrl, component, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence, jobService) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
        this.jobService = jobService;
    }
    CustomerDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SiteListPage');
    };
    CustomerDetailPage.prototype.getAllJobs = function () {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        var search = {};
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("All jobs of current user");
            console.log(response);
            _this.jobs = response;
            _this.component.closeLoader();
        });
    };
    CustomerDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-customer-detail',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/customer-detail/customer-detail.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Customer Detail</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <ion-segment [(ngModel)]="categories" class="segmnt margin-auto margin-top5" color="clr-blue">\n    <ion-segment-button value="detail">\n      Detail\n    </ion-segment-button>\n    <ion-segment-button value="jobs">\n      Jobs\n    </ion-segment-button>\n    <ion-segment-button value="quotation">\n      Quotation\n    </ion-segment-button>\n\n  </ion-segment>\n\n\n  <div [ngSwitch]="categories">\n\n        <ion-col col-11 class="margin-auto" *ngSwitchCase="\'detail\'">\n          <div class="card">\n            <div class="card-content">\n              <div class="row">\n                <label class="col-md-4 label-on-left">Name</label>\n                <div class="col-md-8">\n                  <p text-right>Name</p>\n                </div>\n              </div>\n                <div class="row">\n                    <label class="col-md-4 label-on-left">Mobile</label>\n                    <div class="col-md-8">\n                        <p text-right>9003837625</p>\n                    </div>\n                </div>\n                <div class="row">\n                    <label class="col-md-4 label-on-left">Email</label>\n                    <div class="col-md-8">\n                        <p text-right>name@gmail.com</p>\n                    </div>\n                </div>\n            </div>\n          </div>\n        </ion-col>\n\n    <ion-list *ngSwitchCase="\'jobs\'">\n      <div class="card" *ngFor="let job of jobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n        <div class="card-content padding-bottom0" >\n          <ion-row class="margin0">\n            <ion-col col-12 class="padding-right0">\n              <button ion-button icon-left icon-only clear class="pop-icon" (click)="viewJob(job)">\n                <ion-icon name="eye" class="fnt-12 padding0"></ion-icon>\n              </button>\n            </ion-col>\n          </ion-row>\n          <ion-row class="margin0">\n            <ion-col col-8 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n            <ion-col col-4 class="padding-right0">\n              <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n                {{job.status}}\n              </p>\n            </ion-col>\n          </ion-row>\n          <p>{{job.employeeName}}</p>\n          <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n        </div>\n\n        <div class="card-footer">\n          <div *ngIf="job.status !=\'COMPLETED\'">\n            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n          </div>\n          <div *ngIf="job.status ==\'COMPLETED\'">\n            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n          </div>\n          <div class="stats align-right">\n            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n          </div>\n        </div>\n      </div>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'quotation\'">\n      <div class="row padding0 margin0 white-bg">\n        <ion-col col-12 class="padding-top0">\n          <div class="table-responsive table-sales">\n            <table class="table fnt-18">\n              <tbody>\n              <tr (click)="quotationView()">\n                <td>Approved</td>\n                <td class="text-right">\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                </td>\n                <td class="text-right">\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                </td>\n              </tr>\n              <tr (click)="quotationView()">\n                <td>Overdue</td>\n                <td class="text-right">\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                </td>\n                <td class="text-right">\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                </td>\n              </tr>\n              <tr (click)="quotationView()">\n                <td>Requested</td>\n                <td class="text-right">\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                </td>\n                <td class="text-right">\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                </td>\n              </tr>\n              <tr (click)="quotationView()">\n                <td>Archieved</td>\n                <td class="text-right">\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                </td>\n                <td class="text-right">\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                </td>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n        </ion-col>\n      </div>\n    </ion-list>\n\n  </div>\n\n</ion-content>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/customer-detail/customer-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */]])
    ], CustomerDetailPage);
    return CustomerDetailPage;
}());

//# sourceMappingURL=customer-detail.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__quotation_approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__quotation_archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__quotation_draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__quotation_submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__service_quotationService__ = __webpack_require__(35);
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
    function EmployeeDetailPage(navCtrl, myService, component, navParams, authService, camera, loadingCtrl, geolocation, toastCtrl, geoFence, jobService, attendanceService, quotationService) {
        this.navCtrl = navCtrl;
        this.myService = myService;
        this.component = component;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
        this.jobService = jobService;
        this.attendanceService = attendanceService;
        this.quotationService = quotationService;
        this.ref = false;
        this.job = "job";
        this.attendance = "attendance";
        this.count = 0;
        this.empDetail = this.navParams.get('emp');
        this.categories = 'detail';
        this.draftedQuotationsCount = 0;
        this.approvedQuotationsCount = 0;
        this.submittedQuotationsCount = 0;
        this.archivedQuotationsCount = 0;
        this.getQuotations();
        this.draftedQuotations = [];
        this.approvedQuotations = [];
        this.submittedQuotations = [];
        this.archivedQuotations = [];
    }
    EmployeeDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Employee Detail Page');
        console.log(this.empDetail);
    };
    EmployeeDetailPage.prototype.doRefresh = function (refresher, segment) {
        this.ref = true;
        if (segment == "job") {
            this.getJobs(this.ref);
            refresher.complete();
        }
        else if (segment == "attendance") {
            console.log("------------- segment attandance");
            this.getAttendance(this.ref);
            refresher.complete();
        }
    };
    EmployeeDetailPage.prototype.getJobs = function (ref) {
        if (this.jobs) {
            if (ref) {
                this.loadJobs();
            }
            else {
                this.jobs = this.jobs;
            }
        }
        else {
            this.loadJobs();
        }
    };
    EmployeeDetailPage.prototype.loadJobs = function () {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        var search = { empId: this.empDetail.id };
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("Job Refresher");
            console.log(response);
            _this.jobs = response;
            _this.component.closeLoader();
        });
    };
    EmployeeDetailPage.prototype.getAttendance = function (ref) {
        if (this.attendances) {
            if (ref) {
                console.log("------------- segment attandance ref true");
                this.loadAttendance();
            }
            else {
                this.attendances = this.attendances;
            }
        }
        else {
            this.loadAttendance();
        }
    };
    EmployeeDetailPage.prototype.loadAttendance = function () {
        var _this = this;
        this.component.showLoader('Getting Attendance');
        this.attendanceService.getSiteAttendances(this.empDetail.id).subscribe(function (response) {
            console.log("Loader Attendance");
            console.log(response);
            _this.attendances = response.json();
            _this.component.closeLoader();
        });
    };
    EmployeeDetailPage.prototype.getAllJobs = function () {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        var search = { empId: this.empDetail.id };
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("All jobs of current user");
            console.log(response);
            _this.jobs = response;
            _this.component.closeLoader();
        });
    };
    /* Quotation*/
    EmployeeDetailPage.prototype.gotoApprovedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__quotation_approvedQuotations__["a" /* ApprovedQuotationPage */], { 'quotations': this.approvedQuotations });
    };
    EmployeeDetailPage.prototype.gotoArchivedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__quotation_archivedQuotations__["a" /* ArchivedQuotationPage */], { 'quotations': this.archivedQuotations });
    };
    EmployeeDetailPage.prototype.gotoSubmittedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__quotation_submittedQuotations__["a" /* SubmittedQuotationPage */], { 'quotations': this.submittedQuotations });
    };
    EmployeeDetailPage.prototype.gotoDraftedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__quotation_draftedQuotations__["a" /* DraftedQuotationPage */], { 'quotations': this.draftedQuotations });
    };
    EmployeeDetailPage.prototype.getQuotations = function () {
        var _this = this;
        this.quotationService.getQuotations(window.localStorage.getItem('employeeId')).subscribe(function (response) {
            console.log(response);
            _this.quotations = [];
            _this.quotations = response;
            console.log(_this.quotations);
            for (var i = 0; i < _this.quotations.length; i++) {
                if (_this.quotations[i].isDrafted == true) {
                    console.log("drafted");
                    console.log(_this.quotations[i].isDrafted);
                    _this.draftedQuotationsCount++;
                    _this.draftedQuotations.push(_this.quotations[i]);
                }
                else if (_this.quotations[i].isArchived == true) {
                    console.log("archived");
                    console.log(_this.quotations[i].isArchived);
                    _this.archivedQuotations.push(_this.quotations[i]);
                    _this.archivedQuotationsCount++;
                }
                else if (_this.quotations[i].isApproved == true) {
                    console.log("approved");
                    console.log(_this.quotations[i].isApproved);
                    _this.approvedQuotations.push(_this.quotations[i]);
                    _this.approvedQuotationsCount++;
                }
                else if (_this.quotations[i].isSubmitted == true) {
                    console.log("submitted");
                    console.log(_this.quotations[i].isSubmitted);
                    _this.submittedQuotations.push(_this.quotations[i]);
                    _this.submittedQuotationsCount++;
                }
                else {
                    console.log("all false");
                    console.log(_this.quotations[i].isDrafted);
                }
            }
        });
    };
    EmployeeDetailPage.prototype.createQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__quotation_create_quotation__["a" /* CreateQuotationPage */]);
    };
    EmployeeDetailPage.prototype.open = function (itemSlide, item, c) {
        this.count = c;
        if (c == 1) {
            this.count = 0;
            console.log('------------:' + this.count);
            this.close(itemSlide);
        }
        else {
            this.count = 1;
            console.log('------------:' + this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)");
        }
    };
    EmployeeDetailPage.prototype.close = function (item) {
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    };
    EmployeeDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-employee-detail',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/employee-detail.html"*/`<!--\n  Generated template for the SiteListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header no-border>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Employee Detail</ion-title>\n  </ion-navbar>\n\n\n    <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="clr-blue">\n      <ion-segment-button value="detail">\n        Detail\n      </ion-segment-button>\n      <ion-segment-button value="jobs" (click)="getJobs(false)">\n        Jobs\n      </ion-segment-button>\n      <ion-segment-button value="quotation">\n        Quotation\n      </ion-segment-button>\n      <ion-segment-button value="attendance" (click)="getAttendance(false)">\n        Attendance\n      </ion-segment-button>\n    </ion-segment>\n\n\n</ion-header>\n\n<ion-content>\n\n\n\n  <div [ngSwitch]="categories">\n\n    <ion-list *ngSwitchCase="\'detail\'">\n      <ion-row class="margin0 white-bg padding10">\n        <ion-col col-6 class="label-on-left">Employee ID</ion-col>\n        <ion-col col-6>\n          <p text-right>{{empDetail.empId}}</p>\n        </ion-col>\n        <ion-col col-6 class="label-on-left">Name</ion-col>\n        <ion-col col-6>\n          <p text-right>{{empDetail.fullName}}</p>\n        </ion-col>\n        <ion-col col-6 class="label-on-left">Designation</ion-col>\n        <ion-col col-6>\n          <p text-right>{{empDetail.designation}}</p>\n        </ion-col>\n      </ion-row>\n\n      <ion-row class="margin-tp25 white-bg padding10">\n        <ion-col col-6 class="label-on-left">Sites</ion-col>\n        <ion-col col-6>\n          <p *ngFor="let site of empDetail.projectSites" text-right>{{site.name}}</p>\n        </ion-col>\n\n      </ion-row>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'jobs\'" >\n      <ion-refresher (ionRefresh)="doRefresh($event,job)">\n        <ion-refresher-content></ion-refresher-content>\n      </ion-refresher>\n      <div *ngIf="jobs?.length<0">\n        <ion-card>\n          <ion-card-content>\n            No Jobs\n          </ion-card-content>\n        </ion-card>\n      </div>\n      <div  class="white-bg" *ngFor="let job of jobs" >\n        <div class="padding-left16 padding-top5">\n          <ion-row class="margin0">\n\n            <ion-col col-2 class="ver-center">\n              <button ion-button clear color="primary" class="icon-round"\n                      [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n              </button>\n            </ion-col>\n            <ion-col col-8 class="padding-left5">\n              <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n                <p text-left class="margin0">{{job.title}}</p>\n                <p text-left class="margin0">{{job.employeeName}}</p>\n                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n              </div>\n            </ion-col>\n            <ion-col col-2 class="padding-left0 ver-center">\n              <div class="padding-bottom5">\n                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n                  <i class="material-icons">more_horiz</i>\n                </button>\n              </div>\n            </ion-col>\n            <!--\n            <ion-col col-1>\n                <p (click)="open(ItemSliding,Item)">f</p>\n            </ion-col>\n            -->\n\n          </ion-row>\n        </div>\n        <ion-item-sliding #slidingItem>\n\n          <ion-item #item class="item-fnt padding-left0" >\n            <!--<div class="padding-left16">-->\n\n            <div text-capitalize >\n              <ion-row class="margin0">\n                <ion-col col-6 class="padding-right5">\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                </ion-col>\n                <ion-col col-6>\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                </ion-col>\n              </ion-row>\n            </div>\n            <!--</div>-->\n          </ion-item>\n\n          <ion-item-options (click)="close(slidingItem)">\n            <div>\n              <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n            </div>\n          </ion-item-options>\n        </ion-item-sliding>\n\n      </div>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n      <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-orange">\n              <ion-icon name="mail" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-blue">\n              <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-green">\n              <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Approved</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-red">\n              <i class="material-icons">archive</i>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'attendance\'">\n      <ion-refresher (ionRefresh)="doRefresh($event,attendance)">\n        <ion-refresher-content></ion-refresher-content>\n      </ion-refresher>\n\n      <ion-row class="margin0 white-bg padding10 margin-bottom25 width98 margin-side-auto" *ngFor="let a of attendances">\n        <ion-col col-12 *ngIf="!attendances">\n          <p>No Records</p>\n        </ion-col>\n        <ion-col col-6 class="label-on-left">Name</ion-col>\n        <ion-col col-6>\n          <p text-left class="margin0">{{a.employeeFullName}}</p>\n        </ion-col>\n        <ion-col col-6 class="label-on-left">Site</ion-col>\n        <ion-col col-6>\n          <p text-left class="margin0">{{a.siteName}}</p>\n        </ion-col>\n        <ion-col col-6>\n          <p text-left class="margin0" class="display-inline">{{a.checkInTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n        </ion-col>\n        <ion-col col-6>\n          <p text-right class="margin0" class="display-inline">{{a.checkOutTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n        </ion-col>\n        <ion-col col-6 class="align-center">\n          <ion-item no-lines class="item-label">\n            <ion-avatar *ngIf="a.checkInImage">\n              <img  [src]="a.checkInImage" >\n            </ion-avatar>\n            <ion-avatar *ngIf="!a.checkInImage">\n              <img  src="img/user.png" width="10%">\n            </ion-avatar>\n          </ion-item>\n        </ion-col>\n        <ion-col col-6 class="align-center">\n          <ion-item no-lines class="item-label">\n            <ion-avatar *ngIf="a.checkOutImage">\n              <img  [src]="a.checkOutImage" >\n            </ion-avatar>\n            <ion-avatar *ngIf="!a.checkOutImage">\n              <img  src="img/user.png" >\n            </ion-avatar>\n          </ion-item>\n        </ion-col>\n      </ion-row>\n    </ion-list>\n  </div>\n\n</ion-content>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/employee-list/employee-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_8__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_14__service_quotationService__["a" /* QuotationService */]])
    ], EmployeeDetailPage);
    return EmployeeDetailPage;
}());

//# sourceMappingURL=employee-detail.js.map

/***/ }),

/***/ 508:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SitePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__site_view__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_siteService__ = __webpack_require__(30);
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
    function SitePage(navCtrl, myService, component, siteService) {
        this.navCtrl = navCtrl;
        this.myService = myService;
        this.component = component;
        this.siteService = siteService;
    }
    SitePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.employeeId = window.localStorage.getItem('employeeId');
        console.log('ionViewDidLoad SitePage');
        this.component.showLoader('Getting All Sites');
        this.siteService.searchSite().subscribe(function (response) {
            console.log('ionViewDidLoad SitePage:');
            console.log(response.json());
            _this.sites = response.json();
            _this.component.closeLoader();
        }, function (error) {
            console.log('ionViewDidLoad SitePage:' + error);
        });
    };
    SitePage.prototype.viewSite = function (site) {
        console.log('ionViewDidLoad site method:');
        console.log(site);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__site_view__["a" /* SiteViewPage */], { site: site });
    };
    SitePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site/site.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Site List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-item *ngFor="let site of sites;let i of index" class="bottom-border emp" (click)="viewSite(site)">\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n      <p text-left  class="fnt-wt" text-capitalize>{{site.name}}</p>\n    </ion-item>\n  </ion-list>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site/site.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_5__service_siteService__["a" /* SiteService */]])
    ], SitePage);
    return SitePage;
}());

//# sourceMappingURL=site.js.map

/***/ }),

/***/ 509:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_employeeService__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__quotation_submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__quotation_draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__quotation_archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__quotation_approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_siteService__ = __webpack_require__(30);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var SiteViewPage = (function () {
    function SiteViewPage(navCtrl, component, employeeService, navParams, siteService, myService, authService, toastCtrl, jobService, attendanceService, quotationService, events) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.component = component;
        this.employeeService = employeeService;
        this.navParams = navParams;
        this.siteService = siteService;
        this.myService = myService;
        this.authService = authService;
        this.toastCtrl = toastCtrl;
        this.jobService = jobService;
        this.attendanceService = attendanceService;
        this.quotationService = quotationService;
        this.events = events;
        this.ref = false;
        this.job = "job";
        this.employ = "employee";
        this.count = 0;
        this.categories = 'detail';
        this.siteDetail = this.navParams.get('site');
        console.log('ionViewDidLoad SiteViewPage');
        console.log(this.siteDetail.name);
        this.isAdmin = true;
        this.draftedQuotationsCount = 0;
        this.approvedQuotationsCount = 0;
        this.submittedQuotationsCount = 0;
        this.archivedQuotationsCount = 0;
        this.getQuotations();
        this.draftedQuotations = [];
        this.approvedQuotations = [];
        this.submittedQuotations = [];
        this.archivedQuotations = [];
        this.loadEmployee();
        this.events.subscribe('userType', function (type) {
            console.log("User type event");
            console.log(type);
            _this.userType = type;
        });
    }
    SiteViewPage.prototype.ionViewDidLoad = function () {
    };
    SiteViewPage.prototype.showToast = function (message) {
        this.component.showToastMessage(message, 'bottom');
    };
    SiteViewPage.prototype.doRefresh = function (refresher, segment) {
        this.ref = true;
        if (segment == "job") {
            this.getJobs(this.ref);
            refresher.complete();
        }
        else if (segment == "employee") {
            console.log("------------- segment Employee");
            this.getEmployee(this.ref);
            refresher.complete();
        }
    };
    SiteViewPage.prototype.getJobs = function (ref) {
        if (this.jobs) {
            if (ref) {
                this.loadJobs();
            }
            else {
                this.jobs = this.jobs;
            }
        }
        else {
            this.loadJobs();
        }
    };
    SiteViewPage.prototype.loadJobs = function () {
        var _this = this;
        this.component.showLoader('Getting All Jobs');
        var search = { siteId: this.siteDetail.id };
        this.jobService.getJobs(search).subscribe(function (response) {
            console.log("Job Refresher");
            console.log(response);
            _this.jobs = response;
            _this.component.closeLoader();
        });
    };
    SiteViewPage.prototype.getEmployee = function (ref) {
        if (this.employee) {
            if (ref) {
                console.log("------------- segment employee ref true");
                this.loadEmployee();
            }
            else {
                this.employee = this.employee;
            }
        }
        else {
            this.loadEmployee();
        }
    };
    SiteViewPage.prototype.loadEmployee = function () {
        var _this = this;
        this.component.showLoader('Getting Employee');
        // var search={siteId:this.siteDetail.id};
        //TODO
        //Add Search criteria to attendance
        // this.employeeService.getAllEmployees().subscribe(
        //     response=>{
        //       console.log('Loader Employee');
        //       console.log(response);
        //       this.employee=response;
        //       this.component.closeLoader();
        //     },
        //     error=>{
        //       console.log(error);
        //     }
        // )
        this.siteService.searchSiteEmployee(this.siteDetail.id).subscribe(function (response) {
            console.log(response.json());
            if (response.json().length !== 0) {
                _this.employee = response.json();
                console.log("total Employees");
                console.log(_this.employee.length);
                console.log(_this.employee);
                if (_this.employee.length > 1) {
                    _this.isAdmin = true;
                }
                else {
                    _this.isAdmin = false;
                }
                _this.component.closeLoader();
            }
            else {
                _this.employee = [];
                _this.component.closeLoader();
            }
        }, function (error) {
            console.log(error);
            console.log(_this.employee);
        });
    };
    SiteViewPage.prototype.first = function (emp) {
        this.firstLetter = emp.charAt(0);
    };
    /* Quotation */
    SiteViewPage.prototype.gotoApprovedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__quotation_approvedQuotations__["a" /* ApprovedQuotationPage */], { 'quotations': this.approvedQuotations });
    };
    SiteViewPage.prototype.gotoArchivedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__quotation_archivedQuotations__["a" /* ArchivedQuotationPage */], { 'quotations': this.archivedQuotations });
    };
    SiteViewPage.prototype.gotoSubmittedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__quotation_submittedQuotations__["a" /* SubmittedQuotationPage */], { 'quotations': this.submittedQuotations });
    };
    SiteViewPage.prototype.gotoDraftedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__quotation_draftedQuotations__["a" /* DraftedQuotationPage */], { 'quotations': this.draftedQuotations });
    };
    SiteViewPage.prototype.getQuotations = function () {
        var _this = this;
        this.quotationService.getQuotations(window.localStorage.getItem('employeeId')).subscribe(function (response) {
            console.log(response);
            _this.quotations = [];
            _this.quotations = response;
            console.log(_this.quotations);
            for (var i = 0; i < _this.quotations.length; i++) {
                if (_this.quotations[i].isDrafted == true) {
                    console.log("drafted");
                    console.log(_this.quotations[i].isDrafted);
                    _this.draftedQuotationsCount++;
                    _this.draftedQuotations.push(_this.quotations[i]);
                }
                else if (_this.quotations[i].isArchived == true) {
                    console.log("archived");
                    console.log(_this.quotations[i].isArchived);
                    _this.archivedQuotations.push(_this.quotations[i]);
                    _this.archivedQuotationsCount++;
                }
                else if (_this.quotations[i].isApproved == true) {
                    console.log("approved");
                    console.log(_this.quotations[i].isApproved);
                    _this.approvedQuotations.push(_this.quotations[i]);
                    _this.approvedQuotationsCount++;
                }
                else if (_this.quotations[i].isSubmitted == true) {
                    console.log("submitted");
                    console.log(_this.quotations[i].isSubmitted);
                    _this.submittedQuotations.push(_this.quotations[i]);
                    _this.submittedQuotationsCount++;
                }
                else {
                    console.log("all false");
                    console.log(_this.quotations[i].isDrafted);
                }
            }
        });
    };
    SiteViewPage.prototype.createQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__quotation_create_quotation__["a" /* CreateQuotationPage */]);
    };
    SiteViewPage.prototype.open = function (itemSlide, item, c) {
        this.count = c;
        if (c == 1) {
            this.count = 0;
            console.log('------------:' + this.count);
            this.close(itemSlide);
        }
        else {
            this.count = 1;
            console.log('------------:' + this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)");
        }
    };
    SiteViewPage.prototype.close = function (item) {
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    };
    SiteViewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-site-view',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site/site-view.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{siteDetail.name}}</ion-title>\n  </ion-navbar>\n\n      <!--<ion-scroll scrollX="true" style="width:355px;height:50px">-->\n    <ion-segment [(ngModel)]="categories" color="clr-blue" class="segmnt margin-auto">\n        <ion-segment-button value="detail">\n            Detail\n        </ion-segment-button>\n        <ion-segment-button value="jobs" (click)="getJobs(false)">\n            Jobs\n        </ion-segment-button>\n        <ion-segment-button value="quotation">\n            Quotation\n        </ion-segment-button>\n        <ion-segment-button value="employee" (click)="getEmployee(false)" *ngIf="userType === \'ADMIN\' || userType === \'FACILITYMANAGER\' || userType === \'SUPERVISOR\' || userType === \'CLIENT\'">\n            Employee\n        </ion-segment-button>\n    </ion-segment>\n      <!--</ion-scroll>-->\n\n\n</ion-header>\n\n<ion-content>\n\n  <div [ngSwitch]="categories">\n    <ion-list *ngSwitchCase="\'detail\'">\n          <ion-row class="margin0 white-bg padding10">\n            <ion-col col-6 class="label-on-left">Site Name</ion-col>\n            <ion-col col-6>\n              <p text-right>{{siteDetail.name}}</p>\n            </ion-col>\n            <ion-col col-6 class="label-on-left">Client Name</ion-col>\n            <ion-col col-6>\n              <p text-right>{{siteDetail.projectName}}</p>\n            </ion-col>\n            <ion-col col-6 class="label-on-left">Address</ion-col>\n            <ion-col col-6>\n              <p text-right>{{siteDetail.address}}</p>\n            </ion-col>\n            <ion-col col-6 class="label-on-left">Address Co-ordinates</ion-col>\n            <ion-col col-6>\n              <p text-right>{{siteDetail.addressLat}},{{siteDetail.addressLng}}</p>\n            </ion-col>\n          </ion-row>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'jobs\'" class="align-center">\n      <ion-refresher (ionRefresh)="doRefresh($event,job)">\n        <ion-refresher-content></ion-refresher-content>\n      </ion-refresher>\n      <div  class="white-bg" *ngFor="let job of jobs" >\n        <div class="padding-left16 padding-top5">\n          <ion-row class="margin0">\n\n            <ion-col col-2 class="ver-center">\n              <button ion-button clear color="primary" class="icon-round"\n                      [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n              </button>\n            </ion-col>\n            <ion-col col-8 class="padding-left5">\n              <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n                <p text-left class="margin0">{{job.title}}</p>\n                <p text-left class="margin0">{{job.employeeName}}</p>\n                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n              </div>\n            </ion-col>\n            <ion-col col-2 class="padding-left0 ver-center">\n              <div class="padding-bottom5">\n                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n                  <i class="material-icons">more_horiz</i>\n                </button>\n              </div>\n            </ion-col>\n            <!--\n            <ion-col col-1>\n                <p (click)="open(ItemSliding,Item)">f</p>\n            </ion-col>\n            -->\n\n          </ion-row>\n        </div>\n        <ion-item-sliding #slidingItem>\n\n          <ion-item #item class="item-fnt padding-left0" >\n            <!--<div class="padding-left16">-->\n\n            <div text-capitalize >\n              <ion-row class="margin0">\n                <ion-col col-6 class="padding-right5">\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                </ion-col>\n                <ion-col col-6>\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n                  </div>\n                </ion-col>\n              </ion-row>\n            </div>\n            <!--</div>-->\n          </ion-item>\n\n          <ion-item-options (click)="close(slidingItem)">\n            <div>\n              <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n            </div>\n            <div>\n              <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n            </div>\n          </ion-item-options>\n        </ion-item-sliding>\n\n      </div>\n\n    </ion-list>\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n      <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-orange">\n              <ion-icon name="mail" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-blue">\n              <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-green">\n              <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Approved</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n            <button ion-button clear color="primary" class="q-round icon-round-red">\n              <i class="material-icons">archive</i>\n            </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n          <div>\n            <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n          </div>\n          <div>\n            <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n          </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n      </ion-row>\n    </ion-list>\n    <ion-list *ngSwitchCase="\'employee\'">\n      <ion-refresher (ionRefresh)="doRefresh($event,employee)">\n        <ion-refresher-content></ion-refresher-content>\n      </ion-refresher>\n\n        <ion-item *ngFor="let emp of employee;let i of index" class="bottom-border emp" >\n            <ion-avatar item-start *ngIf="emp.enrolled_face">\n                <img  [src]="emp.enrolled_face" >\n            </ion-avatar>\n            <p *ngIf="!emp.enrolled_face && first(emp.name)"></p>\n            <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round">\n                <p class="margin-auto">{{firstLetter}}</p>\n            </ion-avatar>\n            <p text-left class="fnt-wt">{{emp.name}}</p>\n        </ion-item>\n    </ion-list>\n\n  </div>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/site/site-view.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_6__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_13__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_4__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_5__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_12__service_quotationService__["a" /* QuotationService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], SiteViewPage);
    return SiteViewPage;
}());

//# sourceMappingURL=site-view.js.map

/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var EmployeeService = (function () {
    function EmployeeService(http, https, loadingCtrl, config) {
        this.http = http;
        this.https = https;
        this.loadingCtrl = loadingCtrl;
        this.config = config;
    }
    EmployeeService.prototype.getAllEmployees = function () {
        return this.http.get(this.config.Url + 'api/employee').map(function (response) {
            return response.json();
        });
    };
    EmployeeService.prototype.searchEmployees = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/employee/search', searchCriteria).map(function (response) {
            return response.json();
        });
    };
    EmployeeService.prototype.getAllDesignations = function () {
        return this.http.get(this.config.Url + 'api/designation').map(function (response) {
            return response.json();
        });
    };
    EmployeeService.prototype.markEnrolled = function (employee) {
        return this.http.post(this.config.Url + 'api/employee/enroll', { id: employee.id, enrolled_face: employee.imageData }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    EmployeeService.prototype.createEmployee = function (employee) {
        return this.http.post(this.config.Url + 'api/employee', employee).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    EmployeeService.prototype.getUserRole = function (employeeId) {
        return this.http.get(this.config.Url + 'api/userRole/' + employeeId).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    EmployeeService.prototype.getUser = function (employeeId) {
        return this.http.get(this.config.Url + 'api/users/' + employeeId).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    EmployeeService.prototype.getUserRolePermissions = function (searchCriteria) {
        return this.http.post(this.config.Url + 'api/userRolePermission/search', searchCriteria).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    EmployeeService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
        __param(3, Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Inject"])(__WEBPACK_IMPORTED_MODULE_5__app_config__["b" /* MY_CONFIG_TOKEN */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_0__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["LoadingController"], Object])
    ], EmployeeService);
    return EmployeeService;
}());

//# sourceMappingURL=employeeService.js.map

/***/ }),

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RateCardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__create_rate_card__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_quotationService__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var RateCardPage = (function () {
    function RateCardPage(navCtrl, component, authService, loadingCtrl, quotationService) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.quotationService = quotationService;
    }
    RateCardPage.prototype.ionViewDidLoad = function () {
    };
    RateCardPage.prototype.createRate = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__create_rate_card__["a" /* CreateRateCardPage */]);
    };
    RateCardPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.quotationService.getRateCards().subscribe(function (response) {
            console.log(response);
            _this.rateCards = response;
        });
    };
    RateCardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-rate-card',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/rate-card/rate-card.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Rate Cards</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n    <ion-fab bottom right>\n        <button mini (click)="createRate()"  ion-fab><ion-icon name="add"></ion-icon></button>\n    </ion-fab>\n\n    <ion-list>\n        <ion-item *ngFor="let rate of rateCards">\n            <p text-left style="color: #2e2e2e">{{rate.title}} - {{rate.cost}} - {{rate.uom}}</p>\n        </ion-item>\n    </ion-list>\n\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/rate-card/rate-card.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__service_quotationService__["a" /* QuotationService */]])
    ], RateCardPage);
    return RateCardPage;
}());

//# sourceMappingURL=rate-card.js.map

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IonSimpleWizard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ion_simple_wizard_animations__ = __webpack_require__(513);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/*import { Keyboard } from '@ionic-native/keyboard';*/


var IonSimpleWizard = (function () {
    function IonSimpleWizard(evts) {
        this.evts = evts;
        this.finishIcon = 'send'; //Default
        this.showSteps = true; //Default
        this.step = 1; //Default
        this.finish = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.stepChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.steps = 0; //Innitial
        this.hideWizard = false; //Default
        this.stepCondition = true; //Default
    }
    IonSimpleWizard.prototype.ngOnInit = function () {
        /**
         * Hide the wizard buttons when the keyboard is open
         */
        /*this.keyboard.onKeyboardShow().subscribe(() => {
          this.hideWizard = true;
        });
        this.keyboard.onKeyboardHide().subscribe(() => {
          this.hideWizard = false;
        })*/
    };
    /**
     * @return {number} New Steps
     */
    IonSimpleWizard.prototype.addStep = function () {
        var newSteps = this.steps + 1;
        this.steps = newSteps;
        return newSteps;
    };
    /**
     * @return {boolean} true if is the final step
     */
    IonSimpleWizard.prototype.isOnFinalStep = function () {
        return this.step === this.steps;
    };
    /**
     * @return {boolean} the current step condition
     */
    IonSimpleWizard.prototype.getCondition = function () {
        return this.stepCondition;
    };
    /**
     * @return {boolean} true if the the step is the first
     */
    IonSimpleWizard.prototype.isOnFirstStep = function () {
        return this.step === 1;
    };
    /**
     * @method back button event and emit Event Called 'step:back'
     */
    IonSimpleWizard.prototype.back = function () {
        this.stepChange.emit(this.step - 1);
        this.evts.publish('step:back');
    };
    /**
     * @method next button event and emit  Event Called 'step:next'
     */
    IonSimpleWizard.prototype.next = function () {
        this.stepChange.emit(this.step + 1);
        this.evts.publish('step:next');
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], IonSimpleWizard.prototype, "finishIcon", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], IonSimpleWizard.prototype, "showSteps", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], IonSimpleWizard.prototype, "step", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], IonSimpleWizard.prototype, "finish", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
        __metadata("design:type", Object)
    ], IonSimpleWizard.prototype, "stepChange", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], IonSimpleWizard.prototype, "stepCondition", void 0);
    IonSimpleWizard = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ion-simple-wizard',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/ion-simple-wizard/ion-simple-wizard.component.html"*/`<ng-content></ng-content>\n<ion-footer [hidden]="hideWizard">\n  <div class="ion-wizard-footer">\n    <!--Back Button-->\n    <ion-fab [@btnState] *ngIf="!isOnFirstStep()" left bottom>\n      <button ion-fab (click)="back()">\n        <ion-icon name="arrow-round-back"></ion-icon>\n      </button>\n    </ion-fab>\n    <!--Steps count-->   \n    <ion-badge *ngIf="showSteps">{{step}} / {{steps}}</ion-badge>\n    <!--Next Button-->\n    <ion-fab [@btnState] *ngIf="(!isOnFinalStep() && getCondition())" right bottom>\n      <button ion-fab (click)="next()">\n        <ion-icon name="arrow-round-forward"></ion-icon>\n      </button>\n    </ion-fab>\n    <!--Finish Button-->\n    <ion-fab [@btnState] *ngIf="(isOnFinalStep() && getCondition())" right bottom>\n      <button ion-fab (click)="finish.emit(step + 1)">\n        <ion-icon [name]="finishIcon"></ion-icon>\n      </button>\n    </ion-fab>\n  </div>\n</ion-footer>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/ion-simple-wizard/ion-simple-wizard.component.html"*/,
            animations: __WEBPACK_IMPORTED_MODULE_2__ion_simple_wizard_animations__["a" /* WizardAnimations */].btnRotate
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], IonSimpleWizard);
    return IonSimpleWizard;
}());

//# sourceMappingURL=ion-simple-wizard.component.js.map

/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WizardAnimations; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var WizardAnimations = (function () {
    function WizardAnimations() {
    }
    //Buttons Animations
    WizardAnimations.btnZoom = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('btnState', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'scale(0)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'scale(1)' }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms ease-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'scale(0)' }))
            ])
        ])
    ];
    WizardAnimations.btn_none = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('btnState', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'relative', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ display: 'none', position: 'relative', top: 0 }))
        ])
    ];
    WizardAnimations.btnflipY = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('btnState', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms 200ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, 90deg)', opacity: '0', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, -20deg)', offset: 0.4 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, 10deg)', opacity: '1', offset: 0.6 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, -5deg)', opacity: '1', offset: 0.8 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px)', opacity: '1', offset: 1 })
                ]))
            ]), Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('100ms 400ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px)', opacity: '1', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, -20deg)', opacity: '1', offset: 0.3 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(100px) rotate3d(0, 1, 0, 90deg)', opacity: '0', offset: 1 })
                ]))
            ])
        ])
    ];
    WizardAnimations.btnRotate = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('btnState', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms 200ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'rotate3d(0, 0, 1, -200deg)', opacity: '0', transformOrigin: 'center', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'none', opacity: '1', transformOrigin: 'center', offset: 1 })
                ]))
            ]), Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(400, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'none', opacity: '1', transformOrigin: 'center', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'rotate3d(0, 0, 1, 200deg)', opacity: '0', transformOrigin: 'center', offset: 1 })
                ]))
            ])
        ])
    ];
    //Steps Animations
    WizardAnimations.carruselRight = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible', opacity: 0, transform: 'translateX(-100%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'translateX(0%)' }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'translateX(0%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'translateX(100%)' }))
            ])
        ])
    ];
    WizardAnimations.zoom = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible', opacity: 0, transform: 'scale(0)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('300ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'scale(1)', top: 0 }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('300ms ease-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'scale(0)', top: 0 }))
            ])
        ])
    ];
    WizardAnimations.none = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'relative', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ display: 'none', position: 'relative', top: 0 }))
        ])
    ];
    WizardAnimations.carruselLeft = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible', opacity: 0, transform: 'translateX(100%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'translateX(0%)' }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'translateX(0%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'translateX(-100%)' }))
            ])
        ])
    ];
    WizardAnimations.carruselBottom = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible', opacity: 0, transform: 'translateY(-100%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'translateY(0%)' }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'translateY(0%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'translateY(100%)' }))
            ])
        ])
    ];
    WizardAnimations.carruselTop = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible', opacity: 0, transform: 'translateY(100%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1, transform: 'translateY(0%)' }))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'translateY(0%)' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('500ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0, transform: 'translateY(-100%)' }))
            ])
        ])
    ];
    WizardAnimations.flipY = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: '0', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', offset: 0.4 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)', opacity: '0.5', offset: 0.6 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)', opacity: '1', offset: 0.8 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px)', opacity: '1', offset: 1 })
                ]))
            ]), Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms ease-in-out', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px)', opacity: '1', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)', opacity: '0.5', offset: 0.3 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)', opacity: '0', offset: 1 })
                ]))
            ])
        ])
    ];
    WizardAnimations.flipX = [
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('WizardAnimations', [
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('enter', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ position: 'absolute', top: 0, width: '100%' })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('leave', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'hidden', position: 'absolute', top: 0 })),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>enter', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms 200ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: '0', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', offset: 0.4 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)', opacity: '0.5', offset: 0.6 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)', opacity: '1', offset: 0.8 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px)', opacity: '1', offset: 1 })
                ]))
            ]),
            Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('*=>leave', [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ visibility: 'visible' }),
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('400ms 200ms ease-in', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["keyframes"])([
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px)', opacity: '1', offset: 0 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', opacity: '0.5', offset: 0.3 }),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', opacity: '0', offset: 1 })
                ]))
            ])
        ])
    ];
    return WizardAnimations;
}());

//# sourceMappingURL=ion-simple-wizard-animations.js.map

/***/ }),

/***/ 515:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendanceViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(37);
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
            selector: 'page-attendance-view',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance-view/attendance-view.html"*/`<!--\n  Generated template for the AttendanceViewPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>attendance-view</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div class="align-center">\n    <img *ngIf="img" [src]="domSanitizer.bypassSecurityTrustUrl(img)" width="80%" height="70%" class="margin-auto">\n  </div>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance-view/attendance-view.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]])
    ], AttendanceViewPage);
    return AttendanceViewPage;
}());

//# sourceMappingURL=attendance-view.js.map

/***/ }),

/***/ 516:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(517);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(521);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 521:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_Interceptor_HttpClient__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(852);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(853);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_list_list__ = __webpack_require__(854);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_attendance_view_attendance_view__ = __webpack_require__(515);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_login_login__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_site_list_site_list__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_employee_employee_list__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_storage__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_site_employeeList_site_employeeList__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_dashboard_dashboard__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_tabs_tabs__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_site_site__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_jobs_jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_reports_reports__ = __webpack_require__(855);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_logout_logout__ = __webpack_require__(856);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_quotation_quotation_popover__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_quotation_quotation_view__ = __webpack_require__(857);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_attendance_attendance__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_attendance_attendance_popover__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_customer_detail_customer_detail__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_jobs_view_job__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_employee_list_employee_list__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_rate_card_rate_card__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_rate_card_create_rate_card__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_employee_list_employee_detail__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_site_site_view__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_jobs_add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_ion_simple_wizard_ion_simple_wizard_component__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_ion_simple_wizard_ion_simple_wizard_step_component__ = __webpack_require__(858);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__angular_platform_browser_animations__ = __webpack_require__(859);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_jobs_completeJob__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_quotation_create_quotation_step_2__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_quotation_create_quotation_step_3__ = __webpack_require__(861);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_quotation_approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_quotation_draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_quotation_submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_quotation_archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_quotation_viewQuotation__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__pages_employee_list_create_employee__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__ionic_native_onesignal__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__ionic_native_toast__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_service_app_config__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__pages_service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__pages_service_employeeService__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__pages_service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__pages_service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__pages_service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__pages_jobs_job_popover__ = __webpack_require__(462);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























































// import {GoogleMaps} from "@ionic-native/google-maps";








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
                __WEBPACK_IMPORTED_MODULE_30__pages_quotation_quotation_view__["a" /* QuotationViewPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_quotation_create_quotation__["a" /* CreateQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_quotation_create_quotation_step_2__["a" /* CreateQuotationPage2 */],
                __WEBPACK_IMPORTED_MODULE_49__pages_quotation_approvedQuotations__["a" /* ApprovedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_quotation_draftedQuotations__["a" /* DraftedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_quotation_submittedQuotations__["a" /* SubmittedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_quotation_archivedQuotations__["a" /* ArchivedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_quotation_viewQuotation__["a" /* ViewQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_attendance_attendance__["a" /* AttendancePage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_attendance_attendance_popover__["a" /* AttendancePopoverPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_employee_list_employee_detail__["a" /* EmployeeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_customer_detail_customer_detail__["a" /* CustomerDetailPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_site_site_view__["a" /* SiteViewPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_jobs_view_job__["a" /* ViewJobPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_employee_list_employee_list__["a" /* EmployeeListPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_rate_card_rate_card__["a" /* RateCardPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_rate_card_create_rate_card__["a" /* CreateRateCardPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_jobs_add_job__["a" /* CreateJobPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_jobs_completeJob__["a" /* CompleteJobPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_ion_simple_wizard_ion_simple_wizard_step_component__["a" /* IonSimpleWizardStep */],
                __WEBPACK_IMPORTED_MODULE_43__pages_ion_simple_wizard_ion_simple_wizard_component__["a" /* IonSimpleWizard */],
                __WEBPACK_IMPORTED_MODULE_48__pages_quotation_create_quotation_step_3__["a" /* CreateQuotationPage3 */],
                __WEBPACK_IMPORTED_MODULE_54__pages_employee_list_create_employee__["a" /* CreateEmployeePage */],
                __WEBPACK_IMPORTED_MODULE_63__pages_jobs_job_popover__["a" /* JobPopoverPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__["DatePickerModule"],
                __WEBPACK_IMPORTED_MODULE_45__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
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
                __WEBPACK_IMPORTED_MODULE_30__pages_quotation_quotation_view__["a" /* QuotationViewPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_quotation_create_quotation__["a" /* CreateQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_quotation_create_quotation_step_2__["a" /* CreateQuotationPage2 */],
                __WEBPACK_IMPORTED_MODULE_49__pages_quotation_approvedQuotations__["a" /* ApprovedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_50__pages_quotation_draftedQuotations__["a" /* DraftedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_quotation_submittedQuotations__["a" /* SubmittedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_quotation_archivedQuotations__["a" /* ArchivedQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_quotation_viewQuotation__["a" /* ViewQuotationPage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_attendance_attendance__["a" /* AttendancePage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_attendance_attendance_popover__["a" /* AttendancePopoverPage */],
                __WEBPACK_IMPORTED_MODULE_40__pages_employee_list_employee_detail__["a" /* EmployeeDetailPage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_customer_detail_customer_detail__["a" /* CustomerDetailPage */],
                __WEBPACK_IMPORTED_MODULE_41__pages_site_site_view__["a" /* SiteViewPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_jobs_view_job__["a" /* ViewJobPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_employee_list_employee_list__["a" /* EmployeeListPage */],
                __WEBPACK_IMPORTED_MODULE_38__pages_rate_card_rate_card__["a" /* RateCardPage */],
                __WEBPACK_IMPORTED_MODULE_39__pages_rate_card_create_rate_card__["a" /* CreateRateCardPage */],
                __WEBPACK_IMPORTED_MODULE_42__pages_jobs_add_job__["a" /* CreateJobPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_jobs_completeJob__["a" /* CompleteJobPage */],
                __WEBPACK_IMPORTED_MODULE_44__pages_ion_simple_wizard_ion_simple_wizard_step_component__["a" /* IonSimpleWizardStep */],
                __WEBPACK_IMPORTED_MODULE_43__pages_ion_simple_wizard_ion_simple_wizard_component__["a" /* IonSimpleWizard */],
                __WEBPACK_IMPORTED_MODULE_48__pages_quotation_create_quotation_step_3__["a" /* CreateQuotationPage3 */],
                __WEBPACK_IMPORTED_MODULE_54__pages_employee_list_create_employee__["a" /* CreateEmployeePage */],
                __WEBPACK_IMPORTED_MODULE_63__pages_jobs_job_popover__["a" /* JobPopoverPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_58__pages_service_attendanceService__["a" /* AttendanceService */],
                __WEBPACK_IMPORTED_MODULE_59__pages_service_employeeService__["a" /* EmployeeService */],
                __WEBPACK_IMPORTED_MODULE_60__pages_service_jobService__["a" /* JobService */],
                __WEBPACK_IMPORTED_MODULE_61__pages_service_quotationService__["a" /* QuotationService */],
                __WEBPACK_IMPORTED_MODULE_62__pages_service_siteService__["a" /* SiteService */],
                __WEBPACK_IMPORTED_MODULE_16__pages_service_authService__["a" /* authService */],
                __WEBPACK_IMPORTED_MODULE_4__pages_Interceptor_HttpClient__["a" /* HttpClient */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_geofence__["a" /* Geofence */],
                // GoogleMaps,
                __WEBPACK_IMPORTED_MODULE_56__ionic_native_toast__["a" /* Toast */],
                __WEBPACK_IMPORTED_MODULE_55__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_37__pages_service_componentService__["a" /* componentService */],
                __WEBPACK_IMPORTED_MODULE_55__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_56__ionic_native_toast__["a" /* Toast */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["IonicErrorHandler"] },
                { provide: __WEBPACK_IMPORTED_MODULE_57__pages_service_app_config__["b" /* MY_CONFIG_TOKEN */], useValue: __WEBPACK_IMPORTED_MODULE_57__pages_service_app_config__["a" /* AppConfig */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
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

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MY_CONFIG_TOKEN; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var AppConfig = {
    // Url: "http://192.168.1.4:8088/",
    // NodeUrl: "http://192.168.1.4:8000/",
    Url: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/",
    QuotationServiceUrl: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8001/",
    LocationServiceUrl: "http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8000/"
};
var MY_CONFIG_TOKEN = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('config');
//# sourceMappingURL=app-config.js.map

/***/ }),

/***/ 75:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_quotation_step_2__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_siteService__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_quotationService__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CreateQuotationPage = (function () {
    function CreateQuotationPage(navCtrl, popoverCtrl, evts, authService, alertCtrl, siteService, quotationService) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.evts = evts;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.siteService = siteService;
        this.quotationService = quotationService;
        this.quotationDetails = {
            title: '',
            description: '',
            rateCard: [
                {
                    type: '',
                    uom: '',
                    name: '',
                    cost: ''
                }
            ]
        };
        this.rateCardType = {};
        this.showRateInformation = false;
        this.selectedSite = null;
        console.log(window.localStorage.getItem('employeeUserId'));
        console.log(window.localStorage.getItem('employeeId'));
        console.log(window.localStorage.getItem('employeeFullName'));
    }
    CreateQuotationPage.prototype.setFormValidation = function (id) {
        id.validate({
            errorPlacement: function (error, element) {
                element.closest('div').addClass('has-error');
            }
        });
    };
    CreateQuotationPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.siteService.searchSite().subscribe(function (response) {
            console.log(response.json());
            _this.allSites = response.json();
        });
        this.getRateCardTypes();
    };
    CreateQuotationPage.prototype.ionViewDidEnter = function () {
        console.log(document.getElementById('LoginValidation'));
        this.setFormValidation(document.getElementById('LoginValidation'));
    };
    CreateQuotationPage.prototype.getSiteEmployees = function (siteId) {
        var _this = this;
        this.siteService.searchSiteEmployee(siteId).subscribe(function (response) {
            console.log(response.json());
            _this.siteEmployees = response.json();
        });
    };
    CreateQuotationPage.prototype.saveQuotation = function (title, description) {
        if (title) {
            var quotation = {
                "title": this.title,
                "description": this.description
            };
            console.log(quotation);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__create_quotation_step_2__["a" /* CreateQuotationPage2 */], { quotationDetails: quotation });
        }
        else {
            this.eMsg = "title";
        }
    };
    CreateQuotationPage.prototype.getRateCardTypes = function () {
        var _this = this;
        this.quotationService.getRateCardTypes().subscribe(function (response) {
            console.log("Rate Card types");
            console.log(_this.rateCardTypes);
            _this.rateCardTypes = response;
        });
    };
    CreateQuotationPage.prototype.showAdd = function (type) {
        this.showRateInformation = true;
        this.rateCardType = type.title;
        this.uom = type.uom;
    };
    CreateQuotationPage.prototype.selectUOMType = function (type) {
        var rateCard = {
            type: '',
            uom: '',
            name: '',
            cost: ''
        };
        rateCard.type = type.name;
        rateCard.uom = type.uom;
        this.quotationDetails.rateCard.push(rateCard);
        console.log(this.quotationDetails);
    };
    CreateQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-create-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Add-Quotation</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n            <div class="row">\n                <div class="col-md-10">\n                    <form id="LoginValidation">\n                    <div class="card">\n                        <div class="card-content">\n                            <ion-row padding>\n                                    <ion-col col-12>\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n                                            <label class="control-label">Title</label>\n                                            <input class="form-control" type="text" [(ngModel)]="title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n                                            <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n                                            </div>\n\n                                            <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n                                            </div>\n                                        </div>\n\n                                    </ion-col>\n\n                                    <ion-col col-12>\n                                        <div class="form-group label-floating">\n                                            <label class="control-label">Description</label>\n                                            <input type="text" class="form-control" [(ngModel)]="description" name="description" required="true">\n                                        </div>\n                                    </ion-col>\n\n                            </ion-row>\n                        </div>\n                    </div>\n                    </form>\n                </div>\n            </div>\n</ion-content>\n\n<ion-footer>\n    <ion-toolbar class="align-center" >\n        <button class="btn btn-warning center margin-auto" type="submit" (click)="saveQuotation(title,description)">\n            Next<ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </button>\n    </ion-toolbar>\n</ion-footer>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"],
            __WEBPACK_IMPORTED_MODULE_4__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_5__service_quotationService__["a" /* QuotationService */]])
    ], CreateQuotationPage);
    return CreateQuotationPage;
}());

//# sourceMappingURL=create-quotation.js.map

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quotation_popover__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_quotationService__ = __webpack_require__(35);
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
    function QuotationPage(navCtrl, popoverCtrl, authService, quotationService, events) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.quotationService = quotationService;
        this.events = events;
        this.draftedQuotationsCount = 0;
        this.approvedQuotationsCount = 0;
        this.submittedQuotationsCount = 0;
        this.archivedQuotationsCount = 0;
        this.getQuotations();
        this.draftedQuotations = [];
        this.approvedQuotations = [];
        this.submittedQuotations = [];
        this.archivedQuotations = [];
        this.events.subscribe('permissions:set', function (permission) {
            console.log("Event permissions");
            console.log(permission);
        });
    }
    QuotationPage_1 = QuotationPage;
    QuotationPage.prototype.presentPopover = function (myEvent) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_2__quotation_popover__["a" /* QuotationPopoverPage */]);
        popover.present({
            ev: myEvent
        });
    };
    QuotationPage.prototype.quotationView = function () {
        this.navCtrl.setRoot(QuotationPage_1);
    };
    QuotationPage.prototype.gotoApprovedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__approvedQuotations__["a" /* ApprovedQuotationPage */], { 'quotations': this.approvedQuotations });
    };
    QuotationPage.prototype.gotoArchivedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__archivedQuotations__["a" /* ArchivedQuotationPage */], { 'quotations': this.archivedQuotations });
    };
    QuotationPage.prototype.gotoSubmittedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__submittedQuotations__["a" /* SubmittedQuotationPage */], { 'quotations': this.submittedQuotations });
    };
    QuotationPage.prototype.gotoDraftedQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__draftedQuotations__["a" /* DraftedQuotationPage */], { 'quotations': this.draftedQuotations });
    };
    QuotationPage.prototype.getQuotations = function () {
        var _this = this;
        this.quotationService.getQuotations(window.localStorage.getItem('employeeId')).subscribe(function (response) {
            console.log(response);
            _this.quotations = [];
            _this.quotations = response;
            console.log(_this.quotations);
            for (var i = 0; i < _this.quotations.length; i++) {
                if (_this.quotations[i].isDrafted == true) {
                    console.log("drafted");
                    console.log(_this.quotations[i].isDrafted);
                    _this.draftedQuotationsCount++;
                    _this.draftedQuotations.push(_this.quotations[i]);
                }
                else if (_this.quotations[i].isArchived == true) {
                    console.log("archived");
                    console.log(_this.quotations[i].isArchived);
                    _this.archivedQuotations.push(_this.quotations[i]);
                    _this.archivedQuotationsCount++;
                }
                else if (_this.quotations[i].isApproved == true) {
                    console.log("approved");
                    console.log(_this.quotations[i].isApproved);
                    _this.approvedQuotations.push(_this.quotations[i]);
                    _this.approvedQuotationsCount++;
                }
                else if (_this.quotations[i].isSubmitted == true) {
                    console.log("submitted");
                    console.log(_this.quotations[i].isSubmitted);
                    _this.submittedQuotations.push(_this.quotations[i]);
                    _this.submittedQuotationsCount++;
                }
                else {
                    console.log("all false");
                    console.log(_this.quotations[i].isDrafted);
                }
            }
        });
    };
    QuotationPage.prototype.createQuotation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__create_quotation__["a" /* CreateQuotationPage */]);
    };
    QuotationPage = QuotationPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Quotation</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-fab bottom right>\n    <button (click)="createQuotation()" ion-fab color="dark"><ion-icon name="add" class="clr-orange"></ion-icon></button>\n  </ion-fab>\n\n  <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n        <ion-col col-2 class="ver-center">\n          <div class="q-round ver-center">\n                <button ion-button clear color="primary" class="q-round icon-round-orange">\n                  <ion-icon name="mail" class="fnt-24"></ion-icon>\n                </button>\n          </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n                <div>\n                  <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n                </div>\n                <div>\n                  <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n                </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n                <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n    </ion-row>\n    <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n        <ion-col col-2 class="ver-center">\n            <div class="q-round ver-center">\n                <button ion-button clear color="primary" class="q-round icon-round-blue">\n                    <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n                </button>\n            </div>\n        </ion-col>\n        <ion-col col-9 class="padding-left10">\n            <div>\n                <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n            </div>\n            <div>\n                <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n            </div>\n        </ion-col>\n        <ion-col col-1 class="ver-center">\n            <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n        </ion-col>\n    </ion-row>\n  <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n    <ion-col col-2 class="ver-center">\n      <div class="q-round ver-center">\n        <button ion-button clear color="primary" class="q-round icon-round-green">\n          <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n        </button>\n      </div>\n    </ion-col>\n    <ion-col col-9 class="padding-left10">\n      <div>\n        <p text-left class="fnt-18 margin-bottom5">Approved</p>\n      </div>\n      <div>\n        <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n      </div>\n    </ion-col>\n    <ion-col col-1 class="ver-center">\n      <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n    </ion-col>\n  </ion-row>\n  <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n    <ion-col col-2 class="ver-center">\n      <div class="q-round ver-center">\n        <button ion-button clear color="primary" class="q-round icon-round-red">\n            <i class="material-icons">archive</i>\n        </button>\n      </div>\n    </ion-col>\n    <ion-col col-9 class="padding-left10">\n      <div>\n        <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n      </div>\n      <div>\n        <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n      </div>\n    </ion-col>\n    <ion-col col-1 class="ver-center">\n      <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n    </ion-col>\n  </ion-row>\n\n\n\n\n<!--\n            <ion-col col-12 class="padding-top0">\n\n              <div class="table-responsive table-sales">\n\n                <table class="table fnt-18">\n                  <tbody>\n                  <tr (click)="gotoDraftedQuotation()">\n                    <td>Drafted</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>{{draftedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr (click)="gotoSubmittedQuotation()">\n                    <td>Submitted</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>{{submittedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr (click)="gotoApprovedQuotation()">\n                    <td>Approved</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>{{approvedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr (click)="gotoArchivedQuotation()">\n                    <td>Archieved</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>{{archivedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  </tbody>\n                </table>\n              </div>\n            </ion-col>\n-->\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_4__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_9__service_quotationService__["a" /* QuotationService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], QuotationPage);
    return QuotationPage;
    var QuotationPage_1;
}());

//# sourceMappingURL=quotation.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ViewQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_quotationService__ = __webpack_require__(35);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ViewQuotationPage = (function () {
    function ViewQuotationPage(navCtrl, popoverCtrl, authService, navParams, componentService, quotationService) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.navParams = navParams;
        this.componentService = componentService;
        this.quotationService = quotationService;
        this.quotation = this.navParams.get('quotationDetails');
        console.log(this.quotation);
    }
    ViewQuotationPage.prototype.sendQuotation = function (quotation) {
        var _this = this;
        this.quotationService.sendQuotation(quotation).subscribe(function (response) {
            console.log(response);
            _this.componentService.showToastMessage('Quotation Sent Successfully', 'bottom');
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__quotation__["a" /* QuotationPage */]);
        }, function (err) {
            console.log("Unable to send quotation, please try again later");
            _this.componentService.showToastMessage('Error in sending Quotation, Please try again later', 'bottom');
        });
    };
    ViewQuotationPage.prototype.approveQuotation = function (quotation) {
        var _this = this;
        this.quotationService.approveQuotation(this.quotation).subscribe(function (response) {
            console.log(response);
            _this.componentService.showToastMessage('Quotation Approved', 'bottom');
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__quotation__["a" /* QuotationPage */]);
        }, function (err) {
            console.log("Unable to send quotation");
            console.log(err);
            _this.componentService.showToastMessage('Error in sending Quotation, please try again later', 'bottom');
        });
    };
    ViewQuotationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-view-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/viewQuotation.html"*/`<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Quotation </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <!--<ion-fab bottom right>-->\n        <!--<button mini  ion-fab><ion-icon name="ios-create"></ion-icon></button>-->\n    <!--</ion-fab>-->\n    <ion-row class="margin0 white-bg padding10">\n        <!--<ion-col col-6 class="label-on-left">Quotation Id</ion-col>-->\n        <!--<ion-col col-6>-->\n        <!--<p text-right>{{quotation.id}}</p>-->\n        <!--</ion-col>-->\n        <ion-col col-6 class="label-on-left">Title</ion-col>\n        <ion-col col-6 *ngIf="quotation.title">\n            <p text-right>{{quotation.title}}</p>\n        </ion-col>\n        <ion-col col-6 class="label-on-left">Description</ion-col>\n        <ion-col col-6 *ngIf="quotation.description">\n            <p text-right>{{quotation.description}}</p>\n        </ion-col>\n\n    </ion-row>\n    <div class="card-content white-bg">\n        <div class="table-responsive">\n            <table class="table table-scroll">\n                <thead>\n                <tr>\n                    <th class="text-center">Type</th>\n                    <th class="text-center">Name</th>\n                    <th class="text-center">Rate</th>\n                    <th class="text-center">No</th>\n                    <th class="text-center">Uom</th>\n                    <th class="text-center">Total</th>\n                    <th class="text-center">&nbsp;&nbsp;&nbsp;&nbsp;</th>\n                </tr>\n                </thead>\n                <tbody *ngIf="quotation.rateCardDetails.length>0">\n                <tr *ngFor="let rate of quotation.rateCardDetails;let i = index ">\n                    <td class="text-center">{{rate.type}}</td>\n                    <td class="text-center table-data padding-left0 padding-right0">{{rate.name}}</td>\n                    <td class="text-center">{{rate.cost}}</td>\n                    <td class="text-center">\n                        <!--<input type="number" class="form-control align-center width15" [(ngModel)]="rate.no" (change)="addTotal(i,rate.no,rate.cost)">-->\n                        {{rate.no}}\n                    </td>\n                    <td class="text-center">{{rate.uom}}</td>\n                    <td class="text-center">{{rate.total}}</td>\n                    <!--<td class="td-actions text-center">-->\n                    <!--<i class="material-icons clr-red" (click)="remove(i)">close</i>-->\n                    <!--</td>-->\n                </tr>\n                <tr>\n                    <td></td>\n                    <td></td>\n                    <td></td>\n                    <td></td>\n                    <td class="text-center">Grand Total</td>\n                    <td class="text-center">{{quotation.grandTotal}}</td>\n                    <td></td>\n                </tr>\n                </tbody>\n                <tbody *ngIf="quotation.title.length<0">\n                <div class="card">\n                    <td>No rates added</td>\n                </div>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</ion-content>\n\n<ion-footer >\n    <ion-toolbar class="align-right" >\n\n        <button *ngIf="!quotation.isSubmitted" class="btn btn-success center pull-right" (click)="sendQuotation(quotation)">\n            Send Quotation &nbsp; <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </button>\n        <button *ngIf="quotation.isSubmitted" class="btn btn-success center pull-right" (click)="approveQuotation(quotation)">\n            Approve Quotation &nbsp; <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </button>\n\n    </ion-toolbar>\n</ion-footer>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/viewQuotation.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_5__service_quotationService__["a" /* QuotationService */]])
    ], ViewQuotationPage);
    return ViewQuotationPage;
}());

//# sourceMappingURL=viewQuotation.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendanceListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
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
            selector: 'page-attendance-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance-list/attendance-list.html"*/`<!--\n  Generated template for the AttendanceListPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar color="primary" >\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Attendance</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n  <ion-list>\n    <ion-item *ngFor="let a of attendances" class="bottom-border">\n      <ion-row>\n      <!--<ion-col col-2 >-->\n        <!--&lt;!&ndash;<ion-icon name="calendar" class="fnt-30 margin9 icon-color"></ion-icon>&ndash;&gt;-->\n      <!--</ion-col>-->\n      <ion-col col-10>\n        <p>Site Name - {{a.siteName}}</p>\n        <p>Employee - {{a.employeeFullName}}</p>\n        <p><b>Checkin Time</b>{{a.checkInTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n        <p><b>Checkout Time</b>{{a.checkOutTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n      </ion-col>\n      </ion-row>\n      <ion-row *ngIf="!a">\n        No Attendance Records Found\n      </ion-row>\n    </ion-item>\n  </ion-list>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/attendance-list/attendance-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */]])
    ], AttendanceListPage);
    return AttendanceListPage;
}());

//# sourceMappingURL=attendance-list.js.map

/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 342,
	"./af.js": 342,
	"./ar": 343,
	"./ar-dz": 344,
	"./ar-dz.js": 344,
	"./ar-kw": 345,
	"./ar-kw.js": 345,
	"./ar-ly": 346,
	"./ar-ly.js": 346,
	"./ar-ma": 347,
	"./ar-ma.js": 347,
	"./ar-sa": 348,
	"./ar-sa.js": 348,
	"./ar-tn": 349,
	"./ar-tn.js": 349,
	"./ar.js": 343,
	"./az": 350,
	"./az.js": 350,
	"./be": 351,
	"./be.js": 351,
	"./bg": 352,
	"./bg.js": 352,
	"./bm": 353,
	"./bm.js": 353,
	"./bn": 354,
	"./bn.js": 354,
	"./bo": 355,
	"./bo.js": 355,
	"./br": 356,
	"./br.js": 356,
	"./bs": 357,
	"./bs.js": 357,
	"./ca": 358,
	"./ca.js": 358,
	"./cs": 359,
	"./cs.js": 359,
	"./cv": 360,
	"./cv.js": 360,
	"./cy": 361,
	"./cy.js": 361,
	"./da": 362,
	"./da.js": 362,
	"./de": 363,
	"./de-at": 364,
	"./de-at.js": 364,
	"./de-ch": 365,
	"./de-ch.js": 365,
	"./de.js": 363,
	"./dv": 366,
	"./dv.js": 366,
	"./el": 367,
	"./el.js": 367,
	"./en-au": 368,
	"./en-au.js": 368,
	"./en-ca": 369,
	"./en-ca.js": 369,
	"./en-gb": 370,
	"./en-gb.js": 370,
	"./en-ie": 371,
	"./en-ie.js": 371,
	"./en-nz": 372,
	"./en-nz.js": 372,
	"./eo": 373,
	"./eo.js": 373,
	"./es": 374,
	"./es-do": 375,
	"./es-do.js": 375,
	"./es-us": 376,
	"./es-us.js": 376,
	"./es.js": 374,
	"./et": 377,
	"./et.js": 377,
	"./eu": 378,
	"./eu.js": 378,
	"./fa": 379,
	"./fa.js": 379,
	"./fi": 380,
	"./fi.js": 380,
	"./fo": 381,
	"./fo.js": 381,
	"./fr": 382,
	"./fr-ca": 383,
	"./fr-ca.js": 383,
	"./fr-ch": 384,
	"./fr-ch.js": 384,
	"./fr.js": 382,
	"./fy": 385,
	"./fy.js": 385,
	"./gd": 386,
	"./gd.js": 386,
	"./gl": 387,
	"./gl.js": 387,
	"./gom-latn": 388,
	"./gom-latn.js": 388,
	"./gu": 389,
	"./gu.js": 389,
	"./he": 390,
	"./he.js": 390,
	"./hi": 391,
	"./hi.js": 391,
	"./hr": 392,
	"./hr.js": 392,
	"./hu": 393,
	"./hu.js": 393,
	"./hy-am": 394,
	"./hy-am.js": 394,
	"./id": 395,
	"./id.js": 395,
	"./is": 396,
	"./is.js": 396,
	"./it": 397,
	"./it.js": 397,
	"./ja": 398,
	"./ja.js": 398,
	"./jv": 399,
	"./jv.js": 399,
	"./ka": 400,
	"./ka.js": 400,
	"./kk": 401,
	"./kk.js": 401,
	"./km": 402,
	"./km.js": 402,
	"./kn": 403,
	"./kn.js": 403,
	"./ko": 404,
	"./ko.js": 404,
	"./ky": 405,
	"./ky.js": 405,
	"./lb": 406,
	"./lb.js": 406,
	"./lo": 407,
	"./lo.js": 407,
	"./lt": 408,
	"./lt.js": 408,
	"./lv": 409,
	"./lv.js": 409,
	"./me": 410,
	"./me.js": 410,
	"./mi": 411,
	"./mi.js": 411,
	"./mk": 412,
	"./mk.js": 412,
	"./ml": 413,
	"./ml.js": 413,
	"./mr": 414,
	"./mr.js": 414,
	"./ms": 415,
	"./ms-my": 416,
	"./ms-my.js": 416,
	"./ms.js": 415,
	"./mt": 417,
	"./mt.js": 417,
	"./my": 418,
	"./my.js": 418,
	"./nb": 419,
	"./nb.js": 419,
	"./ne": 420,
	"./ne.js": 420,
	"./nl": 421,
	"./nl-be": 422,
	"./nl-be.js": 422,
	"./nl.js": 421,
	"./nn": 423,
	"./nn.js": 423,
	"./pa-in": 424,
	"./pa-in.js": 424,
	"./pl": 425,
	"./pl.js": 425,
	"./pt": 426,
	"./pt-br": 427,
	"./pt-br.js": 427,
	"./pt.js": 426,
	"./ro": 428,
	"./ro.js": 428,
	"./ru": 429,
	"./ru.js": 429,
	"./sd": 430,
	"./sd.js": 430,
	"./se": 431,
	"./se.js": 431,
	"./si": 432,
	"./si.js": 432,
	"./sk": 433,
	"./sk.js": 433,
	"./sl": 434,
	"./sl.js": 434,
	"./sq": 435,
	"./sq.js": 435,
	"./sr": 436,
	"./sr-cyrl": 437,
	"./sr-cyrl.js": 437,
	"./sr.js": 436,
	"./ss": 438,
	"./ss.js": 438,
	"./sv": 439,
	"./sv.js": 439,
	"./sw": 440,
	"./sw.js": 440,
	"./ta": 441,
	"./ta.js": 441,
	"./te": 442,
	"./te.js": 442,
	"./tet": 443,
	"./tet.js": 443,
	"./th": 444,
	"./th.js": 444,
	"./tl-ph": 445,
	"./tl-ph.js": 445,
	"./tlh": 446,
	"./tlh.js": 446,
	"./tr": 447,
	"./tr.js": 447,
	"./tzl": 448,
	"./tzl.js": 448,
	"./tzm": 449,
	"./tzm-latn": 450,
	"./tzm-latn.js": 450,
	"./tzm.js": 449,
	"./uk": 451,
	"./uk.js": 451,
	"./ur": 452,
	"./ur.js": 452,
	"./uz": 453,
	"./uz-latn": 454,
	"./uz-latn.js": 454,
	"./uz.js": 453,
	"./vi": 455,
	"./vi.js": 455,
	"./x-pseudo": 456,
	"./x-pseudo.js": 456,
	"./yo": 457,
	"./yo.js": 457,
	"./zh-cn": 458,
	"./zh-cn.js": 458,
	"./zh-hk": 459,
	"./zh-hk.js": 459,
	"./zh-tw": 460,
	"./zh-tw.js": 460
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
webpackContext.id = 831;

/***/ }),

/***/ 852:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_site_site__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_jobs_jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_attendance_attendance__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_tabs_tabs__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_employee_list_employee_list__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_rate_card_rate_card__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_onesignal__ = __webpack_require__(511);
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
    function MyApp(platform, statusBar, splashScreen, oneSignal, events) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.oneSignal = oneSignal;
        this.events = events;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
        this.events.subscribe('userType', function (type) {
            console.log("User type event");
            console.log(type);
            _this.userType = type;
        });
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Dashboard', component: __WEBPACK_IMPORTED_MODULE_8__pages_tabs_tabs__["a" /* TabsPage */], active: true, icon: 'dashboard', avoid: 'none' },
            { title: 'Site', component: __WEBPACK_IMPORTED_MODULE_5__pages_site_site__["a" /* SitePage */], active: false, icon: 'dns', avoid: 'none' },
            // { title: 'Client', component: CustomerDetailPage,active:false,icon:'person'},
            { title: 'Employee', component: __WEBPACK_IMPORTED_MODULE_10__pages_employee_list_employee_list__["a" /* EmployeeListPage */], active: false, icon: 'people', avoid: 'TECHNICIAN' },
            { title: 'Jobs', component: __WEBPACK_IMPORTED_MODULE_6__pages_jobs_jobs__["a" /* JobsPage */], active: false, icon: 'description', avoid: 'none' },
            { title: 'Attendance', component: __WEBPACK_IMPORTED_MODULE_7__pages_attendance_attendance__["a" /* AttendancePage */], active: false, icon: 'content_paste', avoid: 'TECHNICIAN' },
            { title: 'Rate Card', component: __WEBPACK_IMPORTED_MODULE_11__pages_rate_card_rate_card__["a" /* RateCardPage */], active: false, icon: 'description', avoid: 'CLIENT' },
            { title: 'Quotation', component: __WEBPACK_IMPORTED_MODULE_9__pages_quotation_quotation__["a" /* QuotationPage */], active: false, icon: 'receipt', avoid: 'none' },
        ];
        console.log("Employee Name");
        console.log(window.localStorage.getItem('employeeFullName'));
        this.userName = window.localStorage.getItem('employeeFullName');
        this.events.subscribe('permissions:set', function (permission) {
            console.log("Event permission in component");
            console.log(permission);
        });
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
            _this.oneSignal.startInit('647127c6-f890-4aad-b4e2-52379805f26c', '1015991031299');
            _this.oneSignal.inFocusDisplaying(_this.oneSignal.OSInFocusDisplayOption.InAppAlert);
            _this.oneSignal.handleNotificationReceived().subscribe(function (response) {
                console.log(response);
            });
            _this.oneSignal.handleNotificationOpened().subscribe(function (response) {
                console.log(response);
            });
            _this.oneSignal.endInit();
        });
    };
    MyApp.prototype.logout = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */]);
        window.localStorage.clear();
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/app/app.html"*/`<ion-menu class="menu-width" [content]="content">\n\n\n  <ion-content>\n\n    <div class="wrapper">\n      <div class="sidebar" data-color="rose" data-background-color="black"  data-image="img/sidebar-1.jpg">\n      <!--\n    Tip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\n    Tip 2: you can also add an image using data-image tag\n  -->\n        <div class="logo">\n          <p text-center>{{userName}}</p>\n        </div>\n        <div class="sidebar-wrapper">\n          <ul class="nav">\n            <li menuClose *ngFor="let p of pages" (click)="openPage(p)" [ngClass]="{\'active\':p.active}"  >\n              <a>\n                <i class="material-icons">{{p.icon}}</i>\n                <p>{{p.title}}</p>\n              </a>\n            </li>\n            <li menuClose (click)="logout()">\n              <a>\n                  <i class="material-icons">exit_to_app</i>\n                  <p>Logout</p>\n              </a>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n    <!--\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>-->\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Platform"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_12__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 853:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
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
            selector: 'page-home',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/home/home.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h3>Ionic Menu Starter</h3>\n\n  <p>\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n  </p>\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
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
            selector: 'page-list',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/list/list.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>List</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n      {{item.title}}\n      <div class="item-note" item-end>\n        {{item.note}}\n      </div>\n    </button>\n  </ion-list>\n  <div *ngIf="selectedItem" padding>\n    You navigated here from <b>{{selectedItem.title}}</b>\n  </div>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/list/list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 855:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReportsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
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
            selector: 'page-reports',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/reports/reports.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h3>Ionic Menu Starter</h3>\n\n  <p>\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n  </p>\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/reports/reports.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], ReportsPage);
    return ReportsPage;
}());

//# sourceMappingURL=reports.js.map

/***/ }),

/***/ 856:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
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
            selector: 'page-logout',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/logout/logout.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h3>Ionic Menu Starter</h3>\n\n  <p>\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n  </p>\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/logout/logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], LogoutPage);
    return LogoutPage;
}());

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 857:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var QuotationViewPage = (function () {
    function QuotationViewPage(navCtrl, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
    }
    QuotationViewPage.prototype.quotationView = function () {
    };
    QuotationViewPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-view-quotation',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation-view.html"*/`<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Quotation</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n          <div class="row padding0 margin0 white-bg">\n            <ion-col col-12 class="padding-top0">\n              <div class="table-responsive table-sales">\n                <table class="table">\n                  <tbody>\n                  <tr (click)="quotationView()">\n                    <td>\n                      <div class="flag">\n                        <img src="../assets/img/flags/US.png">\n                      </div>\n                    </td>\n                    <td>Approved</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td>\n                      <div class="flag">\n                        <img src="../assets/img/flags/DE.png">\n                      </div>\n                    </td>\n                    <td>Overdue</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td>\n                      <div class="flag">\n                        <img src="../assets/img/flags/AU.png">\n                      </div>\n                    </td>\n                    <td>Requested</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td>\n                      <div class="flag">\n                        <img src="../assets/img/flags/AU.png">\n                      </div>\n                    </td>\n                    <td>Archieved</td>\n                    <td class="text-right">\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n                    </td>\n                    <td class="text-right">\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n                    </td>\n                  </tr>\n                  </tbody>\n                </table>\n              </div>\n            </ion-col>\n          </div>\n</ion-content>\n`/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/quotation-view.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], QuotationViewPage);
    return QuotationViewPage;
}());

//# sourceMappingURL=quotation-view.js.map

/***/ }),

/***/ 858:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IonSimpleWizardStep; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ion_simple_wizard_component__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ion_simple_wizard_animations__ = __webpack_require__(513);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var IonSimpleWizardStep = (function () {
    function IonSimpleWizardStep(parent, evts) {
        var _this = this;
        this.parent = parent;
        this.evts = evts;
        this.step = this.parent.addStep();
        this.isCurrent = this.step === this.parent.step;
        this.parent.stepChange.subscribe(function (step) {
            _this.isCurrent = _this.step === step;
            if (_this.isCurrent) {
                _this.evts.publish('step:changed', _this.step);
            }
        });
    }
    IonSimpleWizardStep = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'ion-wizard-step',
            host: {
                '[@WizardAnimations]': 'isCurrent ?"enter":"leave"'
            },
            template: "\n    <ng-content></ng-content>\n  ",
            animations: __WEBPACK_IMPORTED_MODULE_3__ion_simple_wizard_animations__["a" /* WizardAnimations */].zoom //TO DO: Change the animation by @Input for example
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ion_simple_wizard_component__["a" /* IonSimpleWizard */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["Events"]])
    ], IonSimpleWizardStep);
    return IonSimpleWizardStep;
}());

//# sourceMappingURL=ion-simple-wizard.step.component.js.map

/***/ }),

/***/ 861:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateQuotationPage3; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CreateQuotationPage3 = (function () {
    function CreateQuotationPage3(navCtrl, modalCtrl, navParams, popoverCtrl, evts, authService, alertCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.evts = evts;
        this.authService = authService;
        this.alertCtrl = alertCtrl;
        this.quotation = this.navParams.get('quotation');
        this.rate = this.navParams.get('rate');
        console.log(this.navParams.get('quotation'));
        console.log(this.navParams.get('rate'));
        console.log(this.navParams.get('site'));
    }
    CreateQuotationPage3.prototype.ionViewWillEnter = function () {
    };
    CreateQuotationPage3 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-create-quotation-step3',template:/*ion-inline-start:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation-step-3.html"*/``/*ion-inline-end:"/Users/gnana/techginko/workspace/fms/MobileApp/src/pages/quotation/create-quotation-step-3.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"]])
    ], CreateQuotationPage3);
    return CreateQuotationPage3;
}());

//# sourceMappingURL=create-quotation-step-3.js.map

/***/ })

},[516]);
//# sourceMappingURL=main.js.map