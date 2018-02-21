webpackJsonp([5],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JobsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__view_job__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__completeJob__ = __webpack_require__(460);
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
    function JobsPage(navCtrl, component, authService, loadingCtrl, actionSheetCtrl, jobService) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.jobService = jobService;
        this.all = "all";
        this.today = "today";
        this.ref = false;
        this.count = 0;
        this.categories = 'today';
        this.loadTodaysJobs();
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
            selector: 'page-jobs',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\jobs.html"*/`<ion-header no-border>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Jobs</ion-title>\n\n      <!--<ion-buttons right>-->\n\n          <!--<button ion-button clear (click)="addJob()" class="add-btn">-->\n\n              <!--<ion-icon name="add"></ion-icon>-->\n\n          <!--</button>-->\n\n      <!--</ion-buttons>-->\n\n  </ion-navbar>\n\n        <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="#ff9800">\n\n            <ion-segment-button value="today" (click)="getTodaysJobs(false)">\n\n                Today\'s Jobs\n\n            </ion-segment-button>\n\n            <ion-segment-button value="jobs" (click)="getAllJobs(false)">\n\n                All Jobs\n\n            </ion-segment-button>\n\n\n\n        </ion-segment>\n\n\n\n\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-fab bottom right >\n\n        <button (click)="addJob()" ion-fab><ion-icon name="add"></ion-icon></button>\n\n    </ion-fab>\n\n\n\n    <div [ngSwitch]="categories">\n\n        <ion-list *ngSwitchCase="\'today\'">\n\n            <ion-refresher (ionRefresh)="doRefresh($event,today)">\n\n                <ion-refresher-content></ion-refresher-content>\n\n            </ion-refresher>\n\n            <div *ngIf="allJobs?.length<0">\n\n                <ion-card>\n\n                    <ion-card-content>\n\n                        No Jobs\n\n                    </ion-card-content>\n\n                </ion-card>\n\n            </div>\n\n            <div  class="white-bg" *ngFor="let job of allJobs" >\n\n\n\n                <div class="padding-left16 padding-top5">\n\n                    <ion-row class="margin0">\n\n\n\n                        <ion-col col-2 class="ver-center">\n\n                            <button ion-button clear color="primary" class="icon-round"\n\n                                    [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n                            </button>\n\n                        </ion-col>\n\n                        <ion-col col-8 class="padding-left5">\n\n                            <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                                <p text-left class="margin0">{{job.title}}</p>\n\n                                <p text-left class="margin0">{{job.employeeName}}</p>\n\n                                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                            </div>\n\n                        </ion-col>\n\n                        <ion-col col-2 class="padding-left0 ver-center">\n\n                            <div class="padding-bottom5">\n\n                                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n\n                                    <i class="material-icons">more_horiz</i>\n\n                                </button>\n\n                            </div>\n\n                        </ion-col>\n\n                        <!--\n\n                        <ion-col col-1>\n\n                            <p (click)="open(ItemSliding,Item)">f</p>\n\n                        </ion-col>\n\n                        -->\n\n\n\n                    </ion-row>\n\n                </div>\n\n                <ion-item-sliding #slidingItem>\n\n\n\n                    <ion-item #item class="item-fnt padding-left0" >\n\n                        <!--<div class="padding-left16">-->\n\n\n\n                        <div text-capitalize >\n\n                            <ion-row class="margin0">\n\n                                <ion-col col-6 class="padding-right5">\n\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                </ion-col>\n\n                                <ion-col col-6>\n\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                </ion-col>\n\n                            </ion-row>\n\n                        </div>\n\n                        <!--</div>-->\n\n                    </ion-item>\n\n\n\n                    <ion-item-options (click)="close(slidingItem)">\n\n                        <div>\n\n                            <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n\n                        </div>\n\n                        <div>\n\n                            <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n\n                        </div>\n\n                        <div>\n\n                            <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n\n                        </div>\n\n                        <div>\n\n                            <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n\n                        </div>\n\n                    </ion-item-options>\n\n                </ion-item-sliding>\n\n\n\n            </div>\n\n\n\n\n\n\n\n            <!--\n\n                <div class="card" *ngFor="let job of todaysJobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n\n\n                    <div class="card-content padding-bottom0" >\n\n                        <ion-row class="margin0">\n\n                            <ion-col col-12 class="padding-right0">\n\n                                <button ion-button icon-left icon-only clear class="pop-icon" (click)="presentActionSheet(job)">\n\n                                    <ion-icon name="ios-more" class="fnt-12 padding0"></ion-icon>\n\n                                </button>\n\n                            </ion-col>\n\n                        </ion-row>\n\n                        <ion-row class="margin0">\n\n                            <ion-col col-7 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n\n                            <ion-col col-5 class="padding-right0">\n\n                                <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n\n                                    {{job.status}}\n\n                                </p>\n\n                            </ion-col>\n\n                        </ion-row>\n\n                        <p>{{job.employeeName}}</p>\n\n                        <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                    </div>\n\n\n\n\n\n                    <div class="card-footer">\n\n                        <div *ngIf="job.status !=\'COMPLETED\'">\n\n                            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                        </div>\n\n                        <div *ngIf="job.status ==\'COMPLETED\'">\n\n                            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                        </div>\n\n                        <div class="stats align-right">\n\n                            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n\n                        <!--</div>-->\n\n                    <!--</div>-->\n\n                <!--</div>-->\n\n\n\n        </ion-list>\n\n        <ion-list *ngSwitchCase="\'jobs\'">\n\n\n\n            <ion-refresher (ionRefresh)="doRefresh($event,all)">\n\n                <ion-refresher-content></ion-refresher-content>\n\n            </ion-refresher>\n\n\n\n            <div  class="white-bg" *ngFor="let job of allJobs" >\n\n                <div class="padding-left16 padding-top5">\n\n                <ion-row class="margin0">\n\n\n\n                    <ion-col col-2 class="ver-center">\n\n                        <button ion-button clear color="primary" class="icon-round"\n\n                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n                        </button>\n\n                    </ion-col>\n\n                    <ion-col col-8 class="padding-left5">\n\n                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                            <p text-left class="margin0">{{job.title}}</p>\n\n                            <p text-left class="margin0">{{job.employeeName}}</p>\n\n                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                        </div>\n\n                    </ion-col>\n\n                    <ion-col col-2 class="padding-left0 ver-center">\n\n                        <div class="padding-bottom5">\n\n                            <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n\n                                <i class="material-icons">more_horiz</i>\n\n                            </button>\n\n                        </div>\n\n                    </ion-col>\n\n                    <!--\n\n                    <ion-col col-1>\n\n                        <p (click)="open(ItemSliding,Item)">f</p>\n\n                    </ion-col>\n\n                    -->\n\n\n\n                </ion-row>\n\n                </div>\n\n            <ion-item-sliding #slidingItem>\n\n\n\n                <ion-item #item class="item-fnt padding-left0" >\n\n                    <!--<div class="padding-left16">-->\n\n\n\n                        <div text-capitalize >\n\n                            <ion-row class="margin0">\n\n                                <ion-col col-6 class="padding-right5">\n\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                </ion-col>\n\n                                <ion-col col-6>\n\n                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                    </div>\n\n                                </ion-col>\n\n                            </ion-row>\n\n                        </div>\n\n                    <!--</div>-->\n\n                </ion-item>\n\n\n\n                <ion-item-options (click)="close(slidingItem)">\n\n                    <div>\n\n                        <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n\n                    </div>\n\n                    <div>\n\n                        <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n\n                    </div>\n\n                    <div>\n\n                        <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n\n                    </div>\n\n                    <div>\n\n                        <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n\n                    </div>\n\n                </ion-item-options>\n\n            </ion-item-sliding>\n\n\n\n        </div>\n\n\n\n            <!--\n\n            <div class="card" *ngFor="let job of allJobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n\n\n                    <div class="card-content padding-bottom0" >\n\n                        <ion-row class="margin0">\n\n                            <ion-col col-12 class="padding-right0">\n\n                                <button ion-button icon-left icon-only clear class="pop-icon" (click)="presentActionSheet(job)">\n\n                                    <ion-icon name="ios-more" class="fnt-12 padding0"></ion-icon>\n\n                                </button>\n\n                            </ion-col>\n\n                        </ion-row>\n\n                        <ion-row class="margin0">\n\n                            <ion-col col-7 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n\n                            <ion-col col-5 class="padding-right0">\n\n                                <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n\n                                    {{job.status}}\n\n                                </p>\n\n                            </ion-col>\n\n                        </ion-row>\n\n                        <p>{{job.employeeName}}</p>\n\n                        <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                    </div>\n\n\n\n                    <div class="card-footer">\n\n                        <div *ngIf="job.status !=\'COMPLETED\'">\n\n                            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                        </div>\n\n                        <div *ngIf="job.status ==\'COMPLETED\'">\n\n                            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                        </div>\n\n                        <div class="stats align-right">\n\n                            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n\n                        <!--</div>-->\n\n                    <!--</div>-->\n\n                <!--</div>-->\n\n\n\n\n\n        </ion-list>\n\n\n\n    </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\jobs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ActionSheetController"], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */]])
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
            selector: 'page-approved-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\approvedQuotations.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Approved </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n    <ion-list>\n\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n\n            <p text-left>{{quotation.title}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\approvedQuotations.html"*/
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
            selector: 'page-archived-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\archivedQuotations.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Archived</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-list>\n\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n\n            <p text-left>{{quotation.title}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\archivedQuotations.html"*/
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
            selector: 'page-drafted-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\draftedQuotations.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Drafts </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-list>\n\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n\n            <p text-left>{{quotation.title}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n</ion-content>\n\n\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\draftedQuotations.html"*/
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
            selector: 'page-submitted-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\submittedQuotations.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Sent </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-list>\n\n        <ion-item *ngFor="let quotation of quotations;let i of index" class="bottom-border emp" (click)="viewQuotation(quotation)">\n\n            <p text-left>{{quotation.title}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\submittedQuotations.html"*/
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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
        var _this = this;
        return this.https.post(this.config.Url + 'api/auth/' + username + '/' + password, { username: username, password: password }).map(function (response) {
            _this.isUserLoggedIn = true;
            return response;
        });
    };
    authService.prototype.getClientDetails = function (id) {
        return this.http.get(this.config.Url + 'api/project/' + id).map(function (response) {
            console.log(response);
            return response;
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dashboard_dashboard__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__customer_detail_customer_detail__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__employee_list_employee_list__ = __webpack_require__(158);
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
        this.EmployeeListTab = __WEBPACK_IMPORTED_MODULE_4__employee_list_employee_list__["a" /* EmployeeListPage */];
    }
    TabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad TabsPage');
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-tabs',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\tabs\tabs.html"*/`<ion-tabs  tabsPlacement="bottom" color="primary">\n\n  <ion-tab tabTitle="Dashboard" [root]="DashboardTab"  tabIcon="ios-podium-outline" tabsHideOnSubPages="true"></ion-tab>\n\n  <ion-tab tabTitle="Quotation" [root]="QuotationTab"  tabIcon="md-paper" tabsHideOnSubPages="true"></ion-tab>\n\n  <ion-tab tabTitle="Employee" [root]="EmployeeListTab"  tabIcon="list-box" tabsHideOnSubPages="true"></ion-tab>\n\n</ion-tabs>\n\n\n\n\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
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
            selector: 'page-create-rate-card',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\rate-card\create-rate-card.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Create Rate Card</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n    <div class="row">\n\n        <div class="col-md-8">\n\n            <div class="card">\n\n                <div class="card-content">\n\n                        <ion-row>\n\n                            <ion-col col-12>\n\n                                <ion-list radio-group  [(ngModel)]="rateCardDetails.type" class="margin0">\n\n                                    <ion-item *ngFor="let type of rateCardTypes" class="padding-left0 inline-block width50" no-lines>\n\n                                        <ion-label class="radio-label">{{type.name}}</ion-label>\n\n                                        <ion-radio  value={{type.name}} (ionSelect)="rateCardUOM(type.uom)"></ion-radio>\n\n                                    </ion-item>\n\n                                </ion-list>\n\n                            </ion-col>\n\n\n\n                            <ion-col col-12>\n\n\n\n                                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n\n                                    <label class="control-label">Title</label>\n\n                                    <input class="form-control" type="text" [(ngModel)]="rateCardDetails.title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n\n                                    <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n\n\n                                    </div>\n\n\n\n                                    <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n\n\n                                    </div>\n\n                                </div>\n\n\n\n\n\n                            </ion-col>\n\n\n\n                            <ion-col col-12>\n\n                                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n\n                                    <label class="control-label">Cost</label>\n\n                                    <input class="form-control" type="number" [(ngModel)]="rateCardDetails.cost" id="cost" name="cost" #cst="ngModel" required [ngClass]="{\'has-error\': cst.errors || eMsg==\'all\'|| eMsg==\'cost\'}">\n\n                                    <div *ngIf="cst.errors && (cst.dirty || cst.touched)" class="error-msg">\n\n\n\n                                    </div>\n\n\n\n                                    <div *ngIf="cst.errors && (cst.untouched )" class="error-msg">\n\n\n\n                                    </div>\n\n                                </div>\n\n\n\n                            </ion-col>\n\n\n\n                            <ion-col col-12>\n\n                                <div class="form-group ">\n\n                                    <label class="control-label" *ngIf="uom">UOM</label>\n\n                                    <input type="text" class="form-control" placeholder="UOM" [(ngModel)]="uom" disabled>\n\n                                </div>\n\n                            </ion-col>\n\n                            <button class="btn btn-warning pull-right margin-auto" (click)="createRateCard(rateCardDetails)" >Create</button>\n\n                            <div class="clearfix"></div>\n\n                        </ion-row>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\rate-card\create-rate-card.html"*/
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-add-job',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\add-job.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Jobs</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <div class="row">\n\n        <div class="col-md-8">\n\n            <div class="card">\n\n                <div class="card-content">\n\n                    <ion-row>\n\n                        <ion-col col-12>\n\n\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n\n                                <label class="control-label">Title</label>\n\n                                <input class="form-control" type="text" [(ngModel)]="title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n\n                                <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n                        </ion-col>\n\n\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'description\'}">\n\n                                <label class="control-label">Description</label>\n\n                                <input class="form-control" type="text" [(ngModel)]="description" id="description" name="title" #desc="ngModel" required [ngClass]="{\'has-error\': desc.errors || eMsg==\'all\'|| eMsg==\'description\'}">\n\n                                <div *ngIf="desc.errors && (desc.dirty || desc.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="desc.errors && (desc.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n                        </ion-col>\n\n\n\n                        <ion-col col-12>\n\n\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'siteName\'}">\n\n                                <label class="control-label" *ngIf="!site.errors">Site</label>\n\n\n\n                                <ion-select [(ngModel)]="siteName" class="select-box" id="siteName" placeholder="Choose Site" name="siteName" #site="ngModel" required [ngClass]="{\'has-error\': site.errors || eMsg==\'all\'|| eMsg==\'siteName\'}">\n\n                                    <ion-option *ngFor="let site of sites" [value]="site.name" (ionSelect)="getEmployee(site.id)">{{site.name}}</ion-option>\n\n                                </ion-select>\n\n\n\n                                <div *ngIf="site.errors && (site.dirty || site.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="site.errors && (site.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n\n\n                        </ion-col>\n\n\n\n                        <ion-col col-12>\n\n\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'siteName\'}">\n\n                                <label class="control-label" *ngIf="empSelect">Employee</label>\n\n                                    <ion-select [(ngModel)]="employ" [disabled]="empSelect" class="select-box" id="employ" name="employ" [placeholder]="empPlace" #emp="ngModel" required [ngClass]="{\'has-error\': emp.errors || eMsg==\'all\'|| eMsg==\'employ\'}">\n\n                                        <ion-option  *ngFor="let emp of employee" [value]="emp.id" >{{emp.fullName}}</ion-option>\n\n                                    </ion-select>\n\n\n\n                                <div *ngIf="emp.errors && (emp.dirty || emp.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="emp.errors && (emp.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n                            <!--\n\n                            <div class="form-group label-floating">\n\n                                <label class="control-label">Employee</label>\n\n                                <ion-select [(ngModel)]="employ" [disabled]="empSelect" class="select-box">\n\n                                    <ion-option *ngFor="let emp of employee" [value]="emp.id" >{{emp.fullName}}</ion-option>\n\n                                </ion-select>\n\n                                <span *ngIf="field===\'employ\' && errorMsg" class="error">{{errorMsg}}</span>\n\n                            </div>\n\n                            -->\n\n                        </ion-col>\n\n\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'startDate\'}">\n\n                                <label class="control-label" *ngIf="!sDate.errors">Start Date</label>\n\n\n\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" placeholder="Select Date" [(ngModel)]="startDate" id="startDate" name="startDate" #sDate="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'startDate\'}"></ion-datetime>\n\n\n\n                                <div *ngIf="sDate.errors && (sDate.dirty || sDate.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="sDate.errors && (sDate.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n\n\n                            <!--\n\n                            <div class="form-group label-floating">\n\n                                <label class="control-label">Start Date</label>\n\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" [(ngModel)]="startDate"></ion-datetime>\n\n                                <span *ngIf="field===\'startDate\' && errorMsg" class="error">{{errorMsg}}</span>\n\n                            </div>\n\n                            -->\n\n                        </ion-col>\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'startTime\'}">\n\n                                <label class="control-label" *ngIf="!sTime.errors">Start Time</label>\n\n\n\n                                <ion-datetime displayFormat="hh:mm a" class="form-control" [(ngModel)]="startTime" id="startTime" placeholder="Select Time" name="startTime" #sTime="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'startTime\'}"></ion-datetime>\n\n\n\n                                <div *ngIf="sTime.errors && (sTime.dirty || sTime.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="sTime.errors && (sTime.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n                        </ion-col>\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'endDate\'}">\n\n                                <label class="control-label" *ngIf="!eDate.errors">End Time</label>\n\n\n\n                                <ion-datetime displayFormat="MM/DD/YYYY" class="form-control" [(ngModel)]="endDate" id="endDate" placeholder="End Date" name="endDate" #eDate="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'endDate\'}"></ion-datetime>\n\n\n\n                                <div *ngIf="eDate.errors && (eDate.dirty || eDate.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="eDate.errors && (eDate.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n                        </ion-col>\n\n                        <ion-col col-12>\n\n                            <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'endTime\'}">\n\n                                <label class="control-label" *ngIf="!eTime.errors">Start Time</label>\n\n\n\n                                <ion-datetime displayFormat="hh:mm a" class="form-control" [(ngModel)]="endTime" id="endTime" placeholder="End Time" name="endTime" #eTime="ngModel" required [ngClass]="{\'has-error\': sDate.errors || eMsg==\'all\'|| eMsg==\'endTime\'}"></ion-datetime>\n\n\n\n                                <div *ngIf="eTime.errors && (eTime.dirty || eTime.touched)" class="error-msg">\n\n\n\n                                </div>\n\n\n\n                                <div *ngIf="eTime.errors && (eTime.untouched )" class="error-msg">\n\n\n\n                                </div>\n\n                            </div>\n\n\n\n\n\n                        </ion-col>\n\n\n\n                        <button type="submit" class="btn btn-warning pull-right margin-auto" (click)="addJob()">Add</button>\n\n\n\n                        <div class="clearfix"></div>\n\n                    </ion-row>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\add-job.html"*/
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
            selector: 'page-quotation-popover',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation-popover.html"*/`<ion-content >\n\n    <ion-list >\n\n        <ion-row class="margin0 white-bg padding10">\n\n            <ion-col col-12>\n\n                <div class="form-group">\n\n                        <ion-select style="color: black" interface="action-sheet" [(ngModel)]="type" class="select-box" placeholder="Choose Site">\n\n                            <ion-option style="color: black" *ngFor="let type of rateCardTypes" [value]="type.name" (ionSelect)="selectUOMType(type)" >{{type.name}}</ion-option>\n\n                        </ion-select>\n\n                </div>\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n\n\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'name\'}">\n\n                    <label class="control-label">Name</label>\n\n                    <input class="form-control" type="text" [(ngModel)]="name" id="name" name="name" #nme="ngModel" required [ngClass]="{\'has-error\': nme.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n\n                    <div *ngIf="nme.errors && (nme.dirty || nme.touched)" class="error-msg">\n\n\n\n                    </div>\n\n\n\n                    <div *ngIf="nme.errors && (nme.untouched )" class="error-msg">\n\n\n\n                    </div>\n\n                </div>\n\n\n\n\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'cost\'}">\n\n                    <label class="control-label">Cost</label>\n\n                    <input class="form-control" type="number" [(ngModel)]="cost" id="cost" name="cost" #cst="ngModel" required [ngClass]="{\'has-error\': cst.errors || eMsg==\'all\'|| eMsg==\'cost\'}">\n\n                    <div *ngIf="cst.errors && (cst.dirty || cst.touched)" class="error-msg">\n\n\n\n                    </div>\n\n\n\n                    <div *ngIf="cst.errors && (cst.untouched )" class="error-msg">\n\n\n\n                    </div>\n\n                </div>\n\n            </ion-col>\n\n\n\n            <button type="submit" class="btn btn-warning pull-right margin-auto" (click)="addRates()">Ok</button>\n\n        </ion-row>\n\n    </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"],
            __WEBPACK_IMPORTED_MODULE_3__service_quotationService__["a" /* QuotationService */]])
    ], QuotationPopoverPage);
    return QuotationPopoverPage;
}());

//# sourceMappingURL=quotation-popover.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateEmployeePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_transfer__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_employeeService__ = __webpack_require__(57);
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
    function CreateEmployeePage(navCtrl, transfer, component, myService, navParams, authService, camera, loadingCtrl, employeeService, geolocation, toastCtrl, geoFence) {
        this.navCtrl = navCtrl;
        this.transfer = transfer;
        this.component = component;
        this.myService = myService;
        this.navParams = navParams;
        this.authService = authService;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.employeeService = employeeService;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.geoFence = geoFence;
        this.categories = 'basic';
    }
    CreateEmployeePage.prototype.ionViewDidLoad = function () {
    };
    CreateEmployeePage.prototype.viewCamera = function () {
        var _this = this;
        var options = {
            quality: 100,
        };
        this.camera.getPicture(options).then(function (imageData) {
            //this.eImg = 'data:image/jpeg;base64,' + imageData;
            var fileTransfer = _this.transfer.create();
            var options1 = {
                fileKey: 'file',
                fileName: 'name.jpg',
                headers: {}
            };
            fileTransfer.upload(imageData, '', options1)
                .then(function (data) {
                console.log("success");
            }, function (err) {
                console.log("error" + JSON.stringify(err));
            });
        }, function (err) {
            // error
        });
    };
    CreateEmployeePage.prototype.addJob = function () {
        console.log('form submitted');
        if (this.firstname && this.lastname && this.number && this.mail && this.eId && this.address) {
            // Save Employee
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
            selector: 'page-create-employee',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\create-employee.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar no-border>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Create Employee</ion-title>\n\n  </ion-navbar>\n\n    <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="clr-blue">\n\n      <ion-segment-button value="basic">\n\n        Basic\n\n      </ion-segment-button>\n\n      <ion-segment-button value="login" >\n\n        Login\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <div [ngSwitch]="categories">\n\n\n\n    <ion-list *ngSwitchCase="\'basic\'">\n\n      <div class="card">\n\n        <div class="card-content">\n\n          <ion-row>\n\n\n\n            <ion-col col-12>\n\n                <div class="margin-auto empl-round" (click)="viewCamera()">\n\n                  <img src="img/user.png">\n\n                </div>\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'firstname\'}">\n\n                <label class="control-label">First Name</label>\n\n                <input class="form-control" type="text" [(ngModel)]="firstname" id="firstname" name="firstname" #fname="ngModel" required [ngClass]="{\'has-error\': fname.errors || eMsg==\'all\'|| eMsg==\'firstname\'}">\n\n                <div *ngIf="fname.errors && (fname.dirty || fname.touched)" class="error-msg">\n\n\n\n                </div>\n\n\n\n                <div *ngIf="fname.errors && (fname.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'lastname\'}">\n\n                <label class="control-label">Last Name</label>\n\n                <input class="form-control" type="text" [(ngModel)]="lastname" id="lastname" name="lastname" #lname="ngModel" required [ngClass]="{\'has-error\': lname.errors || eMsg==\'all\'|| eMsg==\'lastname\'}">\n\n                <div *ngIf="lname.errors && (lname.dirty || lname.touched)" class="error-msg">\n\n\n\n                </div>\n\n\n\n                <div *ngIf="lname.errors && (lname.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'number\'}">\n\n                <label class="control-label">Mobile Number</label>\n\n                <input class="form-control" type="number" [(ngModel)]="number" id="number" name="number" #num="ngModel" required [ngClass]="{\'has-error\': num.errors || eMsg==\'all\'|| eMsg==\'number\'}">\n\n                <div *ngIf="num.errors && (num.dirty || num.touched)" class="error-msg">\n\n\n\n                </div>\n\n                <div *ngIf="num.errors && (num.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'mail\'}">\n\n                <label class="control-label">Mail Id</label>\n\n                <input class="form-control" type="email" [(ngModel)]="mail" id="mail" name="mail" #mid="ngModel" required [ngClass]="{\'has-error\': mid.errors || eMsg==\'all\'|| eMsg==\'number\'}">\n\n                <div *ngIf="mid.errors && (mid.dirty || mid.touched)" class="error-msg">\n\n\n\n                </div>\n\n                <div *ngIf="mid.errors && (mid.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n            </ion-col>\n\n\n\n\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'eId\'}">\n\n                <label class="control-label">Employee Id</label>\n\n                <input class="form-control" type="text" [(ngModel)]="eId" id="eId" name="number" #id="ngModel" required [ngClass]="{\'has-error\': id.errors || eMsg==\'all\'|| eMsg==\'eId\'}">\n\n                <div *ngIf="id.errors && (id.dirty || id.touched)" class="error-msg">\n\n\n\n                </div>\n\n\n\n                <div *ngIf="id.errors && (id.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'address\'}">\n\n                <label class="control-label">Address</label>\n\n                <input class="form-control" type="text" [(ngModel)]="address" id="address" name="address" #add="ngModel" required [ngClass]="{\'has-error\': add.errors || eMsg==\'all\'|| eMsg==\'address\'}">\n\n                <div *ngIf="add.errors && (add.dirty || add.touched)" class="error-msg">\n\n\n\n                </div>\n\n\n\n                <div *ngIf="add.errors && (add.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n\n\n\n\n            </ion-col>\n\n\n\n            <button type="submit" class="btn btn-warning  margin-auto" (click)="addJob()">Next</button>\n\n\n\n            <div class="clearfix"></div>\n\n          </ion-row>\n\n        </div>\n\n      </div>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'login\'">\n\n      <div class="card">\n\n        <div class="card-content">\n\n          <ion-row>\n\n            <ion-col col-12>\n\n              <div class="form-group label-floating">\n\n\n\n                <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'username\'}">\n\n                  <label class="control-label">User Name</label>\n\n                  <input class="form-control" type="text" [(ngModel)]="username" id="username" name="username" #uname="ngModel" required [ngClass]="{\'has-error\': uname.errors || eMsg==\'all\'|| eMsg==\'username\'}">\n\n                  <div *ngIf="uname.errors && (uname.dirty || uname.touched)" class="error-msg">\n\n\n\n                  </div>\n\n\n\n                  <div *ngIf="uname.errors && (uname.untouched )" class="error-msg">\n\n\n\n                  </div>\n\n                </div>\n\n              </div>\n\n\n\n            </ion-col>\n\n\n\n            <ion-col col-12>\n\n\n\n              <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'password\'}">\n\n                <label class="control-label">Password</label>\n\n                <input class="form-control" type="text" [(ngModel)]="password" id="password" name="password" #pass="ngModel" required [ngClass]="{\'has-error\': pass.errors || eMsg==\'all\'|| eMsg==\'password\'}">\n\n                <div *ngIf="pass.errors && (pass.dirty || pass.touched)" class="error-msg">\n\n\n\n                </div>\n\n\n\n                <div *ngIf="pass.errors && (pass.untouched )" class="error-msg">\n\n\n\n                </div>\n\n              </div>\n\n\n\n\n\n            </ion-col>\n\n\n\n\n\n            <button type="submit" class="btn btn-warning  margin-auto" (click)="login()">Next</button>\n\n\n\n            <div class="clearfix"></div>\n\n          </ion-row>\n\n        </div>\n\n      </div>\n\n    </ion-list>\n\n  </div>\n\n</ion-content>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\create-employee.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_7__ionic_native_transfer__["a" /* Transfer */], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_8__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */]])
    ], CreateEmployeePage);
    return CreateEmployeePage;
}());

//# sourceMappingURL=create-employee.js.map

/***/ }),

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__employee_detail__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__create_employee__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_employeeService__ = __webpack_require__(57);
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
            selector: 'page-employee-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\employee-list.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Employee List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-fab bottom right>\n\n    <button (click)="createEmployee($event)" ion-fab><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab>\n\n\n\n  <ion-list class="emp-list">\n\n\n\n    <div *ngFor="let emp of employees;let i of index">\n\n    <ion-item-sliding #slidingItem (ionDrag)="drag(menu,$event)">\n\n      <ion-item #item  class="bottom-border emp padding-left0"  >\n\n        <ion-row class="margin0">\n\n          <ion-col col-2>\n\n            <ion-avatar item-start *ngIf="emp.enrolled_face" >\n\n              <img  [src]="emp.enrolled_face" >\n\n            </ion-avatar>\n\n            <p *ngIf="!emp.enrolled_face && first(emp.name)"></p>\n\n            <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round">\n\n              <p class="margin-auto">{{firstLetter}}</p>\n\n            </ion-avatar>\n\n          </ion-col>\n\n          <ion-col col-9 class="ver-center" (click)="viewEmployee(emp)">\n\n              <p text-left class="fnt-wt" text-capitalize>{{emp.name}}</p>\n\n          </ion-col>\n\n          <ion-col col-1 class="ver-center">\n\n              <button #menu ion-button icon-left icon-only clear class="pop-icon" (click)="open(slidingItem, item ,count,menu)">\n\n                <ion-icon name="md-more" class="fnt-18 padding0"></ion-icon>\n\n              </button>\n\n          </ion-col>\n\n        </ion-row>\n\n      </ion-item>\n\n\n\n      <ion-item-options side="right" (click)="close(slidingItem,menu)">\n\n        <button ion-button clear color="danger"><ion-icon name="close" class="fnt-24 padding-bottom0"></ion-icon></button>\n\n        <button ion-button clear color="primary"><i class="material-icons fnt-24">transfer_within_a_station</i></button>\n\n        <button ion-button clear color="clr-blue"><i class="material-icons fnt-24">assignment_ind</i></button>\n\n      </ion-item-options>\n\n    </ion-item-sliding>\n\n    </div>\n\n  </ion-list>\n\n\n\n  <ion-infinite-scroll *ngIf="page<totalPages"  (ionInfinite)="doInfinite($event)">\n\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\employee-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_toast__["a" /* Toast */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_9__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ActionSheetController"]])
    ], EmployeeListPage);
    return EmployeeListPage;
}());

//# sourceMappingURL=employee-list.js.map

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_employeeService__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-employee-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee\employee-list.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Employee List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list>\n\n    <ion-item *ngFor="let employee of employeeList;let i of index" class="bottom-border" >\n\n\n\n      <p><span style="float:left" (click)="getEmployeeAttendance(employee.id)"  >{{employee.fullName}}</span>\n\n        <span style="float: right">\n\n          <button ion-button  (click)="viewCamera(employee,\'enroll\')"  >Enroll</button>\n\n          <span *ngIf="employee.faceAuthorised">\n\n            <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkIn\')" *ngIf="!employee.checkedIn" >Check - In</button>\n\n            <button ion-button color="orange" (click)="viewCamera(employee,\'verify\',\'checkOut\')" *ngIf="employee.checkedIn">Check - Out</button>\n\n          </span>\n\n\n\n        </span></p>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee\employee-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_11__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_8__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_9__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_10__service_attendanceService__["a" /* AttendanceService */]])
    ], EmployeeList);
    return EmployeeList;
}());

//# sourceMappingURL=employee-list.js.map

/***/ }),

/***/ 181:
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
    function LoginPage(navCtrl, component, formBuilder, menuCtrl, toastCtrl, toast, navParams, myService) {
        this.navCtrl = navCtrl;
        this.component = component;
        this.formBuilder = formBuilder;
        this.menuCtrl = menuCtrl;
        this.toastCtrl = toastCtrl;
        this.toast = toast;
        this.navParams = navParams;
        this.myService = myService;
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
            selector: 'page-login',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\login\login.html"*/`<!--\n\n  Generated template for the LoginPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n\n\n\n\n<ion-content class="login">\n\n    <div class="wrapper wrapper-full-page">\n\n        <div class="full-page login-page" filter-color="black" data-image="img/login.jpeg">\n\n            <!--   you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " -->\n\n            <div class="content padding-top40">\n\n              <div class="container">\n\n                <div class="row">\n\n                    <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">\n\n                        <form>\n\n                              <div class="width90 margin-auto align-center">\n\n                                  <div class="margin-bottom">\n\n                                      <img src="img/logo.png">\n\n                                  </div>\n\n\n\n                                  <div class="card card-login">\n\n                                    <div class="card-header text-center" data-background-color="orange">\n\n                                      <h4 class="card-title">Login</h4>\n\n                                    </div>\n\n                                    <div class="card-content padding-top25">\n\n                                      <div class="input-group">\n\n                                          <span class="input-group-addon">\n\n                                              <i class="material-icons">face</i>\n\n                                          </span>\n\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'username\'}">\n\n                                          <label class="control-label">User Name</label>\n\n                                                <input class="form-control" type="text" [(ngModel)]="username" id="username" name="username" #uname="ngModel" required [ngClass]="{\'has-error\': uname.errors || eMsg==\'all\'|| eMsg==\'username\'}">\n\n                                                <div *ngIf="uname.errors && (uname.dirty || uname.touched)" class="error-msg">\n\n\n\n                                                </div>\n\n\n\n                                                <div *ngIf="uname.errors && (uname.untouched )" class="error-msg">\n\n\n\n                                                </div>\n\n                                        </div>\n\n                                      </div>\n\n                                      <div class="input-group">\n\n                                          <span class="input-group-addon">\n\n                                              <i class="material-icons">lock_outline</i>\n\n                                          </span>\n\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'|| eMsg==\'password\'}">\n\n                                          <label class="control-label">Password</label>\n\n                                            <input class="form-control" type="password" [(ngModel)]="password" id="password" name="password" #pass="ngModel" required [ngClass]="{\'has-error\':eMsg==\'all\' || eMsg==\'password\'}">\n\n                                            <div *ngIf="pass.errors && (pass.dirty || pass.touched)" class="error-msg">\n\n\n\n                                            </div>\n\n                                            <div *ngIf="pass.errors && (pass.untouched )" class="error-msg">\n\n\n\n                                            </div>\n\n                                        </div>\n\n                                      </div>\n\n                                    </div>\n\n                                    <div class="footer text-center">\n\n                                      <button class="btn btn-warning btn-simple btn-wd btn-lg" (click)="signin()">Sign In</button>\n\n                                    </div>\n\n                                  </div>\n\n\n\n                                  <div class="">\n\n                                      <p class="copyright align-center icon-color">\n\n                                          &copy;<a href="" class="clr-white"><span class="clr-blk">Powered By</span> <span class="icon-color">T</span>ech<span class="icon-color">G</span>inko</a>\n\n                                      </p>\n\n                                  </div>\n\n                              </div>\n\n                        </form>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n        </div>\n\n        </div>\n\n    </div>\n\n\n\n\n\n\n\n\n\n\n\n<!--\n\n  <div text-center class="margin-top25 margn-btom20">\n\n    <img src="img/logo.png">\n\n  </div>\n\n\n\n  <div>\n\n    <ion-item class="width80 margin-auto bg-grey">\n\n      <ion-input type="text" placeholder="Username" class="round" [(ngModel)]="username"></ion-input>\n\n    </ion-item>\n\n\n\n    <ion-item class="width80 margin-auto padding-top10 bg-grey">\n\n      <ion-input type="password"  placeholder="Password" class="round" [(ngModel)]="password"></ion-input>\n\n    </ion-item>\n\n  </div>\n\n\n\n  <div padding text-center>\n\n    <button ion-button color="primary" round >Sign In</button>\n\n  </div>\n\n-->\n\n\n\n</ion-content>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["MenuController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_6__ionic_native_toast__["a" /* Toast */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeSiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_employeeService__ = __webpack_require__(57);
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
            selector: 'page-site-employee-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site-employeeList\site-employeeList.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Select Site</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list class="emp-list">\n\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border emp">\n\n      <p text-left class="fnt-wt" text-capitalize>\n\n        {{site.name}}\n\n          <span style="float: right">\n\n            <button ion-button  (click)="viewCamera(site.id,\'enroll\')"  >Enroll</button>\n\n            <span *ngIf="employee.faceAuthorised">\n\n              <button ion-button color="orange" (click)="viewCamera(site.id,\'checkIn\')" *ngIf="!checkedIn" >Check - In</button>\n\n              <button ion-button color="orange" (click)="viewCamera(site.id,\'checkOut\')" *ngIf="checkedIn">Check - Out</button>\n\n            </span>\n\n          </span>\n\n      </p>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site-employeeList\site-employeeList.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */],
            __WEBPACK_IMPORTED_MODULE_8__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_9__service_employeeService__["a" /* EmployeeService */]])
    ], EmployeeSiteListPage);
    return EmployeeSiteListPage;
}());

//# sourceMappingURL=site-employeeList.js.map

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__employee_employee_list__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-site-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site-list\site-list.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Select Site</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-list class="emp-list">\n\n    <ion-item *ngFor="let site of siteList;let i of index" class="bottom-border emp" >\n\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n\n      <p (click)="gotoEmployeeList(site)" text-left class="fnt-wt" text-capitalize>{{site.name}}</p>\n\n\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n  <ion-infinite-scroll *ngIf="page<totalPages"  (ionInfinite)="doInfinite($event)">\n\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site-list\site-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_9__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_8__service_siteService__["a" /* SiteService */]])
    ], SiteListPage);
    return SiteListPage;
}());

//# sourceMappingURL=site-list.js.map

/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return componentService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(51);
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

/***/ 196:
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
webpackEmptyAsyncContext.id = 196;

/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/attendance-list/attendance-list.module": [
		863,
		4
	],
	"../pages/attendance-view/attendance-view.module": [
		864,
		3
	],
	"../pages/login/login.module": [
		865,
		2
	],
	"../pages/site-employeeList/site-employeeList.module": [
		866,
		1
	],
	"../pages/site-list/site-list.module": [
		867,
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
webpackAsyncContext.id = 241;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_siteService__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_employeeService__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__rate_card_create_rate_card__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__jobs_add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__employee_list_create_employee__ = __webpack_require__(157);
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
    function DashboardPage(renderer, myService, loadingCtrl, navCtrl, component, authService, modalCtrl, datePickerProvider, siteService, employeeService, jobService) {
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
        this.spinner = true;
        this.empSpinner = false;
        this.selectSite = false;
        this.empActive = false;
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
    DashboardPage.prototype.selectEmployee = function (emp, i) {
        console.log("Selected Employee");
        console.log(emp.id + " " + emp.name);
        this.searchCriteria = {
            employeeId: emp.id
        };
        this.searchJobs(this.searchCriteria);
        this.empActive = true;
        this.empIndex = i;
    };
    DashboardPage.prototype.activeSite = function (id, i) {
        var _this = this;
        // var search={siteId:id};
        this.index = i;
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
                _this.selectSite = true;
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
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('date'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], DashboardPage.prototype, "MyCalendar", void 0);
    DashboardPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-dashboard',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\dashboard\dashboard.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Dashboard</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n    <ion-fab right bottom>\n\n        <button ion-fab color="dark">\n\n            <ion-icon name="md-add" class="clr-orange"></ion-icon>\n\n        </button>\n\n        <ion-fab-list side="top" fab-list-margin>\n\n            <ion-label color="dark" class="margin0">Quotation</ion-label>\n\n            <button ion-fab color="primary" (click)="fabClick(\'quotation\')">\n\n                <i class="material-icons clr-blk">receipt</i>\n\n            </button>\n\n            <ion-label color="dark" class="margin0">Job</ion-label>\n\n            <button ion-fab color="primary" (click)="fabClick(\'job\')">\n\n                <i class="material-icons clr-blk">description</i>\n\n            </button>\n\n            <ion-label color="dark" class="margin0">Employee</ion-label>\n\n            <button ion-fab color="primary" (click)="fabClick(\'employee\')">\n\n                <i class="material-icons clr-blk">people</i>\n\n            </button>\n\n            <ion-label color="dark" class="margin0">Rate Card</ion-label>\n\n            <button ion-fab color="primary" (click)="fabClick(\'ratecard\')">\n\n                <i class="material-icons clr-blk">description</i>\n\n            </button>\n\n        </ion-fab-list>\n\n    </ion-fab>\n\n\n\n    <!--\n\n    <ion-fab right bottom>\n\n        <button ion-fab color="dark"><ion-icon name="arrow-dropleft"></ion-icon></button>\n\n        <ion-fab-list side="top">\n\n            <button ion-fab><i class="material-icons">receipt</i>Add Quotation</button>\n\n            <button ion-fab><i class="material-icons">description</i>Add</button>\n\n            <button ion-fab><i class="material-icons">description</i>Add</button>\n\n        </ion-fab-list>\n\n    </ion-fab>\n\n    -->\n\n    <ion-row class="margin0 padding-top15">\n\n        <ion-col col-8 class="align-right">\n\n            <p  text-right class="fnt-18 date-txt" (click)="showCalendar()">\n\n                <ion-icon ios="ios-calendar" md="md-calendar" class="green fnt-25 padding-right10"></ion-icon>\n\n                <span class="clr-black">{{selectDate | date:\'d\' }}</span>\n\n                <span class="clr-orange">{{selectDate | date:\'MMM\' }}</span>\n\n                <span class="clr-black">{{selectDate | date:\'y\' }}</span>\n\n            </p>\n\n        </ion-col>\n\n        <ion-col col-4 class="padding-right5 align-right">\n\n            <!--<p text-right class="fnt-18" (click)="showCalendar()"><ion-icon ios="ios-calendar" md="md-calendar" class="green fnt-25 padding-right10"></ion-icon></p>-->\n\n        </ion-col>\n\n    </ion-row>\n\n\n\n <!--\n\n  <div class="wrapper">\n\n    <ion-toolbar>\n\n      <ion-segment  color="secondary">\n\n        <ion-segment-button value="camera">\n\n          <ion-icon name="camera"></ion-icon>\n\n        </ion-segment-button>\n\n      </ion-segment>\n\n    </ion-toolbar>\n\n-->\n\n    <!--\n\nTip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\n\n\nTip 2: you can also add an image using data-image tag\n\n-->\n\n\n\n\n\n\n\n\n\n\n\n    <!--\n\n    <ion-row >\n\n        <ion-col col-6 class="margin-auto">\n\n            <div class="form-group label-floating">\n\n                <ion-select [(ngModel)]="empName" class="select-box" placeholder="Choose Employee">\n\n                    <ion-option *ngFor="let emp of employee;let i of index" [value]="emp.name">{{emp.name}}</ion-option>\n\n                </ion-select>\n\n            </div>\n\n        </ion-col>\n\n\n\n    </ion-row>\n\n    -->\n\n\n\n    <div class="SiteCon">\n\n        <div text-center>\n\n            <p class="margin0"><span class="margin-right15">Sites</span><span class="padding-left5" *ngIf="spinner"><ion-spinner name="bubbles"></ion-spinner></span></p>\n\n        </div>\n\n        <div class="container-fluid container-scroll hariz-scroll-con">\n\n            <div class="row">\n\n                <button class="siteBtn" ion-button round  *ngFor="let site of sites;let i of index" (click)="activeSite(site.id,i)" [color]="selectSite && i==index ? \'primary\' : \'light\'">\n\n                    <p class="siteName">{{site.name}}</p>\n\n                </button>\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n\n    <div class="EmpCon" style="padding-bottom:10px;">\n\n\n\n        <div text-center>\n\n            <p class="margin0"><span class="margin-right15">Employees</span><span class="padding-left5" *ngIf="empSpinner"><ion-spinner name="bubbles"></ion-spinner></span></p>\n\n        </div>\n\n        <div class="container-fluid container-scroll hariz-scroll-con">\n\n            <div *ngIf="empSelect">\n\n                <p text-center class="margin0 clr-orange">No Employee</p>\n\n            </div>\n\n            <div class="row">\n\n\n\n            <span *ngFor="let emp of employee;let i of index" class="Nametxt">\n\n                <!--<ion-avatar item-start *ngIf="emp.enrolled_face" class="emp-round width-round">-->\n\n                <!--<img  [src]="emp.enrolled_face" >-->\n\n                <!--</ion-avatar>-->\n\n                <!--<p *ngIf="!emp.enrolled_face && first(emp.name)"></p>-->\n\n                <p *ngIf="first(emp.name)"></p>\n\n                <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round" (click)="selectEmployee(emp,i)" [ngClass]="{\'emp-round-active\':empActive && i==empIndex}">\n\n                    <p class="margin-auto"> {{firstLetter}}</p>\n\n                </ion-avatar>\n\n                <!--<p text-left>{{emp.name}}</p>-->\n\n            </span>\n\n            </div>\n\n        </div>\n\n\n\n    </div>\n\n\n\n\n\n\n\n\n\n    <!--\n\n        <ion-segment [(ngModel)]="cat" class="" color="clr-blue">\n\n            <div *ngFor="let c of categories">\n\n                <ion-segment-button [value]="c" (click)="getAllJobs()">\n\n                    {{c}}\n\n                </ion-segment-button>\n\n            </div>\n\n        </ion-segment>\n\n     -->\n\n\n\n\n\n\n\n\n\n        <ion-segment [(ngModel)]="categories" class="" color="clr-blue">\n\n            <ion-segment-button value="overdue">\n\n                Overdue\n\n            </ion-segment-button>\n\n            <ion-segment-button value="upcoming">\n\n                Upcoming\n\n            </ion-segment-button>\n\n            <ion-segment-button value="completed">\n\n                Completed\n\n            </ion-segment-button>\n\n        </ion-segment>\n\n\n\n    <div class="main-panel" >\n\n\n\n      <div class="content margin-top0 padding0">\n\n        <div class="container-fluid padding0">\n\n\n\n          <div class="row margin0">\n\n            <ion-col col-12 class="margin-auto">\n\n\n\n<!--\n\n                <div [ngSwitch]="cat">\n\n                    <div *ngFor="let c of categories">\n\n                            <ion-list *ngSwitchCase="c">\n\n                                    <div *ngFor="let job of allJobs">\n\n                                        <div class="card"  *ngIf="(c | uppercase) == job.status" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n\n\n                                            <div class="card-content padding-bottom0" >\n\n                                                <ion-row class="margin0">\n\n                                                    <ion-col col-12 class="padding-right0">\n\n                                                        <button ion-button icon-left icon-only clear class="pop-icon">\n\n                                                            <ion-icon name="md-create" class="fnt-12 padding0"></ion-icon>\n\n                                                        </button>\n\n                                                    </ion-col>\n\n                                                </ion-row>\n\n                                                <ion-row class="margin0">\n\n                                                    <ion-col col-8 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n\n                                                    <ion-col col-4 class="padding-right0">\n\n                                                        <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n\n                                                            {{job.status}}\n\n                                                        </p>\n\n                                                    </ion-col>\n\n                                                </ion-row>\n\n                                                <p>{{job.employeeName}}</p>\n\n                                                <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                                            </div>\n\n\n\n                                            <div class="card-footer">\n\n                                                <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                    <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                                                </div>\n\n                                                <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                    <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n                                                </div>\n\n                                                <div class="stats align-right">\n\n\n\n                                                </div>\n\n                                            </div>\n\n                                        </div>\n\n                                    </div>\n\n\n\n                            </ion-list>\n\n                    </div>\n\n                </div>\n\n\n\n                -->\n\n\n\n\n\n\n\n\n\n                <div [ngSwitch]="categories">\n\n                        <ion-list *ngSwitchCase="\'overdue\'">\n\n                            <ion-refresher (ionRefresh)="doRefresh($event,all)">\n\n                                <ion-refresher-content></ion-refresher-content>\n\n                            </ion-refresher>\n\n                            <div  class="white-bg" *ngFor="let job of allJobs; let i = index" >\n\n                                <div *ngIf="job.status == \'OVERDUE\'">\n\n\n\n                                <div class="padding-left16 padding-top5">\n\n                                    <ion-row class="margin0">\n\n\n\n                                        <ion-col col-2 class="ver-center">\n\n                                            <button ion-button clear color="primary" class="icon-round"\n\n                                                    [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                                                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n                                            </button>\n\n                                        </ion-col>\n\n                                        <ion-col col-10 class="padding-left5">\n\n                                            <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                                                <p text-left class="margin0">{{job.title}}</p>\n\n                                                <p text-left class="margin0">{{job.employeeName}}</p>\n\n                                                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                                            </div>\n\n                                        </ion-col>\n\n                                        <!--\n\n                                        <ion-col col-1>\n\n                                            <p (click)="open(ItemSliding,Item)">f</p>\n\n                                        </ion-col>\n\n                                        -->\n\n\n\n                                    </ion-row>\n\n                                </div>\n\n\n\n                                    <ion-item class="item-fnt padding-left0" >\n\n                                        <!--<div class="padding-left16">-->\n\n\n\n                                        <div text-capitalize >\n\n                                            <ion-row class="margin0">\n\n                                                <ion-col col-6 class="padding-right5">\n\n                                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                                    </div>\n\n                                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                        <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                                    </div>\n\n                                                </ion-col>\n\n                                                <ion-col col-6>\n\n                                                    <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                                    </div>\n\n                                                    <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                        <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                                    </div>\n\n                                                </ion-col>\n\n                                            </ion-row>\n\n                                        </div>\n\n                                        <!--</div>-->\n\n                                    </ion-item>\n\n\n\n                                </div>\n\n                            </div>\n\n                        </ion-list>\n\n\n\n\n\n\n\n                    <ion-list *ngSwitchCase="\'upcoming\'">\n\n                        <ion-refresher (ionRefresh)="doRefresh($event,all)">\n\n                            <ion-refresher-content></ion-refresher-content>\n\n                        </ion-refresher>\n\n                        <div  class="white-bg" *ngFor="let job of allJobs" >\n\n                            <div *ngIf="job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\'">\n\n                            <div class="padding-left16 padding-top5" >\n\n                                <ion-row class="margin0">\n\n\n\n                                    <ion-col col-2 class="ver-center">\n\n                                        <button ion-button clear color="primary" class="icon-round"\n\n                                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n                                        </button>\n\n                                    </ion-col>\n\n                                    <ion-col col-10 class="padding-left5">\n\n                                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                                            <p text-left class="margin0">{{job.title}}</p>\n\n                                            <p text-left class="margin0">{{job.employeeName}}</p>\n\n                                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                                        </div>\n\n                                    </ion-col>\n\n\n\n                                </ion-row>\n\n                            </div>\n\n\n\n                            <ion-item class="item-fnt padding-left0" >\n\n                                <!--<div class="padding-left16">-->\n\n\n\n                                <div text-capitalize >\n\n                                    <ion-row class="margin0">\n\n                                        <ion-col col-6 class="padding-right5">\n\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                        </ion-col>\n\n                                        <ion-col col-6>\n\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                        </ion-col>\n\n                                    </ion-row>\n\n                                </div>\n\n                                <!--</div>-->\n\n                            </ion-item>\n\n\n\n                            </div>\n\n                        </div>\n\n                    </ion-list>\n\n\n\n\n\n                    <ion-list *ngSwitchCase="\'completed\'">\n\n                        <ion-refresher (ionRefresh)="doRefresh($event,all)">\n\n                            <ion-refresher-content></ion-refresher-content>\n\n                        </ion-refresher>\n\n                        <div  class="white-bg" *ngFor="let job of allJobs" >\n\n                            <div *ngIf="job.status ==\'COMPLETED\'">\n\n                            <div class="padding-left16 padding-top5">\n\n                                <ion-row class="margin0">\n\n\n\n                                    <ion-col col-2 class="ver-center">\n\n\n\n                                        <button ion-button clear color="primary" class="icon-round"\n\n                                                [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                                            <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n                                        </button>\n\n                                    </ion-col>\n\n                                    <ion-col col-10 class="padding-left5">\n\n                                        <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                                            <p text-left class="margin0">{{job.title}}</p>\n\n                                            <p text-left class="margin0">{{job.employeeName}}</p>\n\n                                            <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n                                        </div>\n\n                                    </ion-col>\n\n                                    <!--\n\n                                    <ion-col col-1>\n\n                                        <p (click)="open(ItemSliding,Item)">f</p>\n\n                                    </ion-col>\n\n                                    -->\n\n\n\n                                </ion-row>\n\n                            </div>\n\n\n\n                            <ion-item class="item-fnt padding-left0" >\n\n                                <!--<div class="padding-left16">-->\n\n\n\n                                <div text-capitalize >\n\n                                    <ion-row class="margin0">\n\n                                        <ion-col col-6 class="padding-right5">\n\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                        </ion-col>\n\n                                        <ion-col col-6>\n\n                                            <div *ngIf="job.status ==\'COMPLETED\'">\n\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                            <div *ngIf="job.status !=\'COMPLETED\'">\n\n                                                <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                                            </div>\n\n                                        </ion-col>\n\n                                    </ion-row>\n\n                                </div>\n\n                                <!--</div>-->\n\n                            </ion-item>\n\n\n\n                            </div>\n\n                        </div>\n\n                    </ion-list>\n\n                </div>\n\n            </ion-col>\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n\n\n</ion-content>\n\n<!--\n\n<script type="text/javascript">\n\n    $(document).ready(function() {\n\n        demo.initFullCalendar();\n\n    });\n\n</script>\n\n-->`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\dashboard\dashboard.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_4__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"],
            __WEBPACK_IMPORTED_MODULE_3_ionic2_date_picker__["DatePickerProvider"], __WEBPACK_IMPORTED_MODULE_5__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_6__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */]])
    ], DashboardPage);
    return DashboardPage;
}());

//# sourceMappingURL=dashboard.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuotationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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
        return this.http.get(this.config.NodeUrl + 'api/rateCardTypes').map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    QuotationService.prototype.getRateTypes = function () {
        return this.http.get(this.config.NodeUrl + 'api/rateCard/types').map(function (response) {
            console.log(response);
            return response;
        });
    };
    QuotationService.prototype.getUOMTypes = function () {
        return this.http.get(this.config.NodeUrl + 'api/rateCard/uom').map(function (response) {
            console.log(response);
            return response;
        });
    };
    QuotationService.prototype.createRateCard = function (rateCard) {
        return this.http.post(this.config.NodeUrl + 'api/rateCard/create', rateCard).map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    QuotationService.prototype.getRateCards = function () {
        return this.http.get(this.config.NodeUrl + 'api/rateCard').map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.getQuotations = function (id) {
        return this.http.get(this.config.NodeUrl + 'api/quotation/' + id).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.createQuotation = function (quotation) {
        return this.http.post(this.config.NodeUrl + 'api/quotation/create', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.editQuotation = function (quotation) {
        return this.http.post(this.config.NodeUrl + 'api/quotation/edit', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.sendQuotation = function (quotation) {
        return this.http.post(this.config.NodeUrl + 'api/quotation/send', quotation).map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    QuotationService.prototype.approveQuotation = function (quotation) {
        return this.http.post(this.config.NodeUrl + 'api/quotation/approve', quotation).map(function (response) {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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
        return this.http.post(this.config.Url + 'api/jobs/date/search', { checkInDateTimeFrom: new Date() }).map(function (response) {
            console.log(response);
            return response.json();
        });
    };
    JobService.prototype.getJobs = function (searchCriteria) {
        console.log(searchCriteria);
        return this.http.post(this.config.Url + 'api/jobs/search', { searchCriteria: searchCriteria }).map(function (response) {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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
    AttendanceService.prototype.checkSiteProximity = function (siteId, lat, lng) {
        return this.http.get('http://ec2-52-77-216-21.ap-southeast-1.compute.amazonaws.com:8000/api/site/nearby?' + 'siteId=' + siteId + '&' + 'lat=' + lat + '&lng=' + lng).map(function (response) {
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

/***/ 459:
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
            selector: 'page-view-job',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\view-job.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Jobs</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n\n\n\n\n    <div class="card" >\n\n\n\n                    <div class="card-content padding-bottom0" >\n\n                        <div>\n\n                            {{jobDetails.description}}\n\n                            {{jobDetails.employeeId}}\n\n                            {{jobDetails.employeeName}}\n\n                        </div>\n\n\n\n                    </div>\n\n\n\n                    <div class="card-footer">\n\n\n\n                    </div>\n\n\n\n\n\n    </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\view-job.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"]])
    ], ViewJobPage);
    return ViewJobPage;
}());

//# sourceMappingURL=view-job.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompleteJobPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__job_popover__ = __webpack_require__(461);
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
        if (this.sLength == this.count) {
            this.onButton = true;
        }
    };
    CompleteJobPage.prototype.call = function () {
    };
    CompleteJobPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-complete-job',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\completeJob.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Complete Job</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n    <ion-list >\n\n        <ion-row class="margin0 white-bg padding10">\n\n            <ion-col col-6 class="label-on-left">Job Id</ion-col>\n\n            <ion-col col-6>\n\n                <p text-right>{{jobDetails.id}}</p>\n\n            </ion-col>\n\n            <ion-col col-6 class="label-on-left">Name</ion-col>\n\n            <ion-col col-6>\n\n                <p text-right>{{jobDetails.title}}</p>\n\n            </ion-col>\n\n            <ion-col col-6 class="label-on-left">Status</ion-col>\n\n            <ion-col col-6>\n\n                <p text-right>{{jobDetails.status}}</p>\n\n            </ion-col>\n\n        </ion-row>\n\n\n\n        <div class="margin-tp25 white-bg padding10">\n\n            <ion-row class="margin0">\n\n                <ion-col col-6 class="label-on-left">\n\n                    <p class="line-height">Photo (Before)</p>\n\n                </ion-col>\n\n                <ion-col col-6 text-right>\n\n                    <button class="ion-button" round (click)="viewCamera(\'beforeJob\',jobDetails)" class="camera-btn"><ion-icon name="ios-camera"></ion-icon></button>\n\n                </ion-col>\n\n            </ion-row>\n\n            <ion-row>\n\n                <ion-col col-3 *ngFor="let image of takenImages;let i of index" class="">\n\n                    <img [src]="image" class="job-img margin-bottom25" (click)="viewImage(i,image)">\n\n                </ion-col>\n\n            </ion-row>\n\n        </div>\n\n\n\n        <ion-row class="margin-tp25 white-bg padding10" >\n\n            <div *ngIf="jobDetails.checklistItems?.length > 0">\n\n                <ion-item *ngFor="let list of jobDetails.checklistItems;let i = index">\n\n                    <ion-label style="color: black">{{list.checklistItemName}}</ion-label>\n\n                    <ion-checkbox [(ngModel)]="list.status"  (ionChange)="changeStatus(i)" checked="list.status"></ion-checkbox>\n\n                </ion-item>\n\n            </div>\n\n            <div *ngIf="!jobDetails.checklistItems?.length > 0" class="align-center">\n\n                <p text-center>No Checklist Found</p>\n\n            </div>\n\n        </ion-row>\n\n    </ion-list>\n\n\n\n</ion-content>\n\n\n\n<ion-footer>\n\n    <ion-toolbar class="align-center">\n\n        <button class="btn btn-warning center" [disabled]="!onButton" (click)="completeJob(jobDetails,takenImages)">\n\n            complete job\n\n        </button>\n\n    </ion-toolbar>\n\n</ion-footer>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\completeJob.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_6__service_jobService__["a" /* JobService */],
            __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], CompleteJobPage);
    return CompleteJobPage;
}());

//# sourceMappingURL=completeJob.js.map

/***/ }),

/***/ 461:
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
            selector: 'page-job-popover',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\job-popover.html"*/`<ion-content>\n\n\n\n    <div>\n\n        <img [src]="img" class="job-img margin-bottom25">\n\n    </div>\n\n    <div class="align-center">\n\n        <button ion-button clear color="danger" (click)="deleteImg(index)" icon-only><ion-icon name="trash"></ion-icon></button>\n\n    </div>\n\n\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\jobs\job-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ViewController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], JobPopoverPage);
    return JobPopoverPage;
}());

//# sourceMappingURL=job-popover.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateQuotationPage2; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__quotation_popover__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-create-quotation-step2',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation-step-2.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Add-Rates</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <ion-fab bottom right>\n\n        <button mini (click)="addRates($event)"  ion-fab><ion-icon name="add"></ion-icon></button>\n\n    </ion-fab>\n\n\n\n    <ion-col col-10>\n\n        <div class="card-content white-bg">\n\n                <div class="form-group label-floating width80 margin-auto padding-bottom3">\n\n                    <ion-select style="color: black" [(ngModel)]="selectedSite" class="select-box" placeholder="Choose Site">\n\n                        <ion-option style="color: black;" *ngFor="let site of allSites" [value]="site.name" (ionSelect)="selectSite(site)" >{{site.name}}</ion-option>\n\n                    </ion-select>\n\n                </div>\n\n        </div>\n\n    </ion-col>\n\n\n\n    <div class="card-content white-bg">\n\n        <div class="table-responsive">\n\n            <table class="table table-scroll">\n\n                <thead>\n\n                <tr>\n\n                    <th class="text-center">Type</th>\n\n                    <th class="text-center">Name</th>\n\n                    <th class="text-center">Rate</th>\n\n                    <th class="text-center">No</th>\n\n                    <th class="text-center">Uom</th>\n\n                    <th class="text-center">Total</th>\n\n                    <th class="text-center">&nbsp;&nbsp;&nbsp;&nbsp;</th>\n\n                </tr>\n\n                </thead>\n\n                <tbody>\n\n                <tr *ngFor="let rate of rates;let i = index ">\n\n                    <td class="text-center">{{rate.type}}</td>\n\n                    <td class="text-center table-data">{{rate.name}}</td>\n\n                    <td class="text-center">{{rate.cost}}</td>\n\n                    <td class="text-center">\n\n                        <input type="number" class="form-control align-center width15" [(ngModel)]="rate.no" (change)="addTotal(i,rate.no,rate.cost)">\n\n                    </td>\n\n                    <td class="text-center">{{rate.uom}}</td>\n\n                    <td class="text-center">{{rate.total}}</td>\n\n                    <td class="td-actions text-center">\n\n                        <i class="material-icons clr-red" (click)="remove(i)">close</i>\n\n                    </td>\n\n                </tr>\n\n                <tr>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td class="text-center">Grand Total</td>\n\n                    <td class="text-center">{{grandTotal}}</td>\n\n                    <td></td>\n\n                </tr>\n\n                </tbody>\n\n            </table>\n\n        </div>\n\n    </div>\n\n\n\n</ion-content>\n\n\n\n<ion-footer>\n\n    <ion-toolbar class="align-right" >\n\n        <button class="btn btn-warning center pull-left" >\n\n            Save\n\n        </button>\n\n        <button class="btn btn-success center pull-right" (click)="saveRates()">\n\n            Submitted <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </button>\n\n    </ion-toolbar>\n\n</ion-footer>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation-step-2.html"*/
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(33);
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
            selector: 'page-customer-detail',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\customer-detail\customer-detail.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Customer Detail</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-segment [(ngModel)]="categories" class="segmnt margin-auto margin-top5" color="clr-blue">\n\n    <ion-segment-button value="detail">\n\n      Detail\n\n    </ion-segment-button>\n\n    <ion-segment-button value="jobs">\n\n      Jobs\n\n    </ion-segment-button>\n\n    <ion-segment-button value="quotation">\n\n      Quotation\n\n    </ion-segment-button>\n\n\n\n  </ion-segment>\n\n\n\n\n\n  <div [ngSwitch]="categories">\n\n\n\n        <ion-col col-11 class="margin-auto" *ngSwitchCase="\'detail\'">\n\n          <div class="card">\n\n            <div class="card-content">\n\n              <div class="row">\n\n                <label class="col-md-4 label-on-left">Name</label>\n\n                <div class="col-md-8">\n\n                  <p text-right>Name</p>\n\n                </div>\n\n              </div>\n\n                <div class="row">\n\n                    <label class="col-md-4 label-on-left">Mobile</label>\n\n                    <div class="col-md-8">\n\n                        <p text-right>9003837625</p>\n\n                    </div>\n\n                </div>\n\n                <div class="row">\n\n                    <label class="col-md-4 label-on-left">Email</label>\n\n                    <div class="col-md-8">\n\n                        <p text-right>name@gmail.com</p>\n\n                    </div>\n\n                </div>\n\n            </div>\n\n          </div>\n\n        </ion-col>\n\n\n\n    <ion-list *ngSwitchCase="\'jobs\'">\n\n      <div class="card" *ngFor="let job of jobs" [ngClass]="{\'red-card\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green-card\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue-card\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n\n\n        <div class="card-content padding-bottom0" >\n\n          <ion-row class="margin0">\n\n            <ion-col col-12 class="padding-right0">\n\n              <button ion-button icon-left icon-only clear class="pop-icon" (click)="viewJob(job)">\n\n                <ion-icon name="eye" class="fnt-12 padding0"></ion-icon>\n\n              </button>\n\n            </ion-col>\n\n          </ion-row>\n\n          <ion-row class="margin0">\n\n            <ion-col col-8 class="padding-left0"><p text-left>{{job.title}}</p></ion-col>\n\n            <ion-col col-4 class="padding-right0">\n\n              <p text-right [ngClass]="{\'red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}" >\n\n                {{job.status}}\n\n              </p>\n\n            </ion-col>\n\n          </ion-row>\n\n          <p>{{job.employeeName}}</p>\n\n          <p>{{job.siteProjectName}} - {{job.siteName}}</p>\n\n        </div>\n\n\n\n        <div class="card-footer">\n\n          <div *ngIf="job.status !=\'COMPLETED\'">\n\n            <p>{{job.plannedStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.plannedEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n          </div>\n\n          <div *ngIf="job.status ==\'COMPLETED\'">\n\n            <p>{{job.actualStartTime | date:\'dd/MM/yyyy @ H:mm\' }} - {{job.actualEndTime | date:\'dd/MM/yyyy @ H:mm\' }} </p>\n\n          </div>\n\n          <div class="stats align-right">\n\n            <!--<p class="display-inline">view</p><ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>-->\n\n          </div>\n\n        </div>\n\n      </div>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n      <div class="row padding0 margin0 white-bg">\n\n        <ion-col col-12 class="padding-top0">\n\n          <div class="table-responsive table-sales">\n\n            <table class="table fnt-18">\n\n              <tbody>\n\n              <tr (click)="quotationView()">\n\n                <td>Approved</td>\n\n                <td class="text-right">\n\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                </td>\n\n                <td class="text-right">\n\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                </td>\n\n              </tr>\n\n              <tr (click)="quotationView()">\n\n                <td>Overdue</td>\n\n                <td class="text-right">\n\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                </td>\n\n                <td class="text-right">\n\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                </td>\n\n              </tr>\n\n              <tr (click)="quotationView()">\n\n                <td>Requested</td>\n\n                <td class="text-right">\n\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                </td>\n\n                <td class="text-right">\n\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                </td>\n\n              </tr>\n\n              <tr (click)="quotationView()">\n\n                <td>Archieved</td>\n\n                <td class="text-right">\n\n                  <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                </td>\n\n                <td class="text-right">\n\n                  <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                </td>\n\n              </tr>\n\n              </tbody>\n\n            </table>\n\n          </div>\n\n        </ion-col>\n\n      </div>\n\n    </ion-list>\n\n\n\n  </div>\n\n\n\n</ion-content>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\customer-detail\customer-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */]])
    ], CustomerDetailPage);
    return CustomerDetailPage;
}());

//# sourceMappingURL=customer-detail.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(33);
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
            selector: 'page-employee-detail',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\employee-detail.html"*/`<!--\n\n  Generated template for the SiteListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header no-border>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Employee Detail</ion-title>\n\n  </ion-navbar>\n\n\n\n\n\n    <ion-segment [(ngModel)]="categories" class="segmnt margin-auto" color="clr-blue">\n\n      <ion-segment-button value="detail">\n\n        Detail\n\n      </ion-segment-button>\n\n      <ion-segment-button value="jobs" (click)="getJobs(false)">\n\n        Jobs\n\n      </ion-segment-button>\n\n      <ion-segment-button value="quotation">\n\n        Quotation\n\n      </ion-segment-button>\n\n      <ion-segment-button value="attendance" (click)="getAttendance(false)">\n\n        Attendance\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n\n\n\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n\n\n\n\n  <div [ngSwitch]="categories">\n\n\n\n    <ion-list *ngSwitchCase="\'detail\'">\n\n\n\n      <!--\n\n      <div class="padding10">\n\n        <ion-row class="margin0 white-bg padding5">\n\n          <ion-col col-12>\n\n            <p text-center class="margin-bottom0 fnt-20 label-on-left">Employee</p>\n\n          </ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row class="margin-left-right0 margin-top3 white-bg padding5">\n\n\n\n          <ion-col col-8>\n\n            <p text-left class="margin-bottom0 fnt-12 clr-orange">Name</p>\n\n            <p text-left class="margin-bottom0">{{empDetail.fullName}}</p>\n\n          </ion-col>\n\n          <ion-col col-4>\n\n            <p text-right class="margin-bottom0 fnt-12 clr-orange">Id</p>\n\n            <p text-right class="margin-bottom0">{{empDetail.empId}}</p>\n\n          </ion-col>\n\n          <ion-col col-12>\n\n            <p text-left class="margin-bottom0 fnt-12 clr-orange">Designation</p>\n\n            <p text-left class="margin-bottom0">{{empDetail.designation}}</p>\n\n          </ion-col>\n\n        </ion-row>\n\n      </div>\n\n\n\n      <div class="padding10">\n\n        <ion-row class="margin0 white-bg padding5">\n\n          <ion-col col-12>\n\n            <p text-center class="margin-bottom0 fnt-20 label-on-left">Manager</p>\n\n          </ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row class="margin-left-right0 margin-top3 white-bg padding5">\n\n          <ion-col col-8>\n\n            <p text-left class="margin-bottom0 fnt-12 clr-orange">Name</p>\n\n            <p text-left class="margin-bottom0">{{empDetail.manager.fullName}}</p>\n\n          </ion-col>\n\n          <ion-col col-4>\n\n            <p text-right class="margin-bottom0 fnt-12 clr-orange">Id</p>\n\n            <p text-right class="margin-bottom0">{{empDetail.manager.id}}</p>\n\n          </ion-col>\n\n          <ion-col col-12>\n\n            <p text-left class="margin-bottom0 fnt-12 clr-orange">Designation</p>\n\n            <p text-left class="margin-bottom0">{{empDetail.manager.designation}}</p>\n\n          </ion-col>\n\n        </ion-row>\n\n      </div>\n\n\n\n      <div class="padding10">\n\n        <ion-row class="margin0 white-bg padding5">\n\n          <ion-col col-12>\n\n            <p text-center class="margin-bottom0 fnt-20 label-on-left">Sites</p>\n\n          </ion-col>\n\n        </ion-row>\n\n\n\n        <ion-row class="margin-left-right0 margin-top3 white-bg padding5">\n\n          <ion-col col-8 *ngFor="let site of empDetail.sites">\n\n            <p text-left class="margin-bottom0">{{site.name}}</p>\n\n          </ion-col>\n\n        </ion-row>\n\n      </div>\n\n-->\n\n\n\n\n\n      <ion-row class="margin0 white-bg padding10">\n\n        <ion-col col-6 class="label-on-left">Employee ID</ion-col>\n\n        <ion-col col-6>\n\n          <p text-right>{{empDetail.empId}}</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="label-on-left">Name</ion-col>\n\n        <ion-col col-6>\n\n          <p text-right>{{empDetail.fullName}}</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="label-on-left">Designation</ion-col>\n\n        <ion-col col-6>\n\n          <p text-right>{{empDetail.designation}}</p>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row class="margin0 white-bg padding10" *ngIf="empDetail.manager">\n\n        <ion-col col-6 class="label-on-left">Manager Name</ion-col>\n\n        <ion-col col-6>\n\n          <p text-right>{{empDetail.manager.fullName}}</p>\n\n        </ion-col>\n\n      </ion-row>\n\n\n\n      <ion-row class="margin-tp25 white-bg padding10">\n\n        <ion-col col-6 class="label-on-left">Sites</ion-col>\n\n        <ion-col col-6>\n\n          <p *ngFor="let site of empDetail.projectSites" text-right>{{site.name}}</p>\n\n        </ion-col>\n\n\n\n      </ion-row>\n\n\n\n    </ion-list>\n\n\n\n    <ion-list *ngSwitchCase="\'jobs\'" >\n\n      <ion-refresher (ionRefresh)="doRefresh($event,job)">\n\n        <ion-refresher-content></ion-refresher-content>\n\n      </ion-refresher>\n\n      <div *ngIf="jobs?.length<0">\n\n        <ion-card>\n\n          <ion-card-content>\n\n            No Jobs\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </div>\n\n      <div  class="white-bg" *ngFor="let job of jobs" >\n\n        <div class="padding-left16 padding-top5">\n\n          <ion-row class="margin0">\n\n\n\n            <ion-col col-2 class="ver-center">\n\n              <button ion-button clear color="primary" class="icon-round"\n\n                      [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n              </button>\n\n            </ion-col>\n\n            <ion-col col-8 class="padding-left5">\n\n              <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                <p text-left class="margin0">{{job.title}}</p>\n\n                <p text-left class="margin0">{{job.employeeName}}</p>\n\n                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n              </div>\n\n            </ion-col>\n\n            <ion-col col-2 class="padding-left0 ver-center">\n\n              <div class="padding-bottom5">\n\n                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n\n                  <i class="material-icons">more_horiz</i>\n\n                </button>\n\n              </div>\n\n            </ion-col>\n\n            <!--\n\n            <ion-col col-1>\n\n                <p (click)="open(ItemSliding,Item)">f</p>\n\n            </ion-col>\n\n            -->\n\n\n\n          </ion-row>\n\n        </div>\n\n        <ion-item-sliding #slidingItem>\n\n\n\n          <ion-item #item class="item-fnt padding-left0" >\n\n            <!--<div class="padding-left16">-->\n\n\n\n            <div text-capitalize >\n\n              <ion-row class="margin0">\n\n                <ion-col col-6 class="padding-right5">\n\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                </ion-col>\n\n                <ion-col col-6>\n\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                </ion-col>\n\n              </ion-row>\n\n            </div>\n\n            <!--</div>-->\n\n          </ion-item>\n\n\n\n          <ion-item-options (click)="close(slidingItem)">\n\n            <div>\n\n              <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n          </ion-item-options>\n\n        </ion-item-sliding>\n\n\n\n      </div>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n\n\n      <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-orange">\n\n              <ion-icon name="mail" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-blue">\n\n              <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-green">\n\n              <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Approved</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-red">\n\n              <i class="material-icons">archive</i>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'attendance\'">\n\n      <ion-refresher (ionRefresh)="doRefresh($event,attendance)">\n\n        <ion-refresher-content></ion-refresher-content>\n\n      </ion-refresher>\n\n\n\n      <ion-row class="margin0 white-bg padding10 margin-bottom25 width98 margin-side-auto" *ngFor="let a of attendances">\n\n        <ion-col col-12 *ngIf="!attendances">\n\n          <p>No Records</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="label-on-left">Name</ion-col>\n\n        <ion-col col-6>\n\n          <p text-left class="margin0">{{a.employeeFullName}}</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="label-on-left">Site</ion-col>\n\n        <ion-col col-6>\n\n          <p text-left class="margin0">{{a.siteName}}</p>\n\n        </ion-col>\n\n        <ion-col col-6>\n\n          <p text-left class="margin0" class="display-inline">{{a.checkInTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n        </ion-col>\n\n        <ion-col col-6>\n\n          <p text-right class="margin0" class="display-inline">{{a.checkOutTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="align-center">\n\n          <ion-item no-lines class="item-label">\n\n            <ion-avatar *ngIf="a.checkInImage">\n\n              <img  [src]="a.checkInImage" >\n\n            </ion-avatar>\n\n            <ion-avatar *ngIf="!a.checkInImage">\n\n              <img  src="img/user.png" width="10%">\n\n            </ion-avatar>\n\n          </ion-item>\n\n        </ion-col>\n\n        <ion-col col-6 class="align-center">\n\n          <ion-item no-lines class="item-label">\n\n            <ion-avatar *ngIf="a.checkOutImage">\n\n              <img  [src]="a.checkOutImage" >\n\n            </ion-avatar>\n\n            <ion-avatar *ngIf="!a.checkOutImage">\n\n              <img  src="img/user.png" >\n\n            </ion-avatar>\n\n          </ion-item>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-list>\n\n  </div>\n\n\n\n</ion-content>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\employee-list\employee-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_geofence__["a" /* Geofence */], __WEBPACK_IMPORTED_MODULE_7__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_8__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_14__service_quotationService__["a" /* QuotationService */]])
    ], EmployeeDetailPage);
    return EmployeeDetailPage;
}());

//# sourceMappingURL=employee-detail.js.map

/***/ }),

/***/ 507:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SitePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__site_view__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-site',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site\site.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Site List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <ion-item *ngFor="let site of sites;let i of index" class="bottom-border emp" (click)="viewSite(site)">\n\n      <ion-icon name="podium" item-start class="icon-color"></ion-icon>\n\n      <p text-left  class="fnt-wt" text-capitalize>{{site.name}}</p>\n\n    </ion-item>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site\site.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_5__service_siteService__["a" /* SiteService */]])
    ], SitePage);
    return SitePage;
}());

//# sourceMappingURL=site.js.map

/***/ }),

/***/ 508:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SiteViewPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_employeeService__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__quotation_submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__quotation_draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__quotation_archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__quotation_approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__service_siteService__ = __webpack_require__(34);
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
    function SiteViewPage(navCtrl, component, employeeService, navParams, siteService, myService, authService, toastCtrl, jobService, attendanceService, quotationService) {
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
        this.ref = false;
        this.job = "job";
        this.employ = "employee";
        this.count = 0;
        this.categories = 'detail';
        this.siteDetail = this.navParams.get('site');
        console.log('ionViewDidLoad SiteViewPage');
        console.log(this.siteDetail.name);
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
                console.log(_this.employee);
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
            selector: 'page-site-view',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site\site-view.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>{{siteDetail.name}}</ion-title>\n\n  </ion-navbar>\n\n\n\n      <!--<ion-scroll scrollX="true" style="width:355px;height:50px">-->\n\n    <ion-segment [(ngModel)]="categories" color="clr-blue" class="segmnt margin-auto">\n\n        <ion-segment-button value="detail">\n\n            Detail\n\n        </ion-segment-button>\n\n        <ion-segment-button value="jobs" (click)="getJobs(false)">\n\n            Jobs\n\n        </ion-segment-button>\n\n        <ion-segment-button value="quotation">\n\n            Quotation\n\n        </ion-segment-button>\n\n        <ion-segment-button value="employee" (click)="getEmployee(false)">\n\n            Employee\n\n        </ion-segment-button>\n\n    </ion-segment>\n\n      <!--</ion-scroll>-->\n\n\n\n\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <div [ngSwitch]="categories">\n\n    <ion-list *ngSwitchCase="\'detail\'">\n\n      <!--\n\n      <div class="padding10">\n\n        <ion-row class="margin0 white-bg padding5">\n\n          <ion-col col-6>\n\n            <p text-left><ion-icon name="md-map" class="padding-right5 clr-orange"></ion-icon>{{siteDetail.name}}</p>\n\n          </ion-col>\n\n          <ion-col col-6>\n\n            <p text-left><ion-icon name="md-person" class="padding-right5 clr-orange"></ion-icon>{{siteDetail.projectName}}</p>\n\n          </ion-col>\n\n          <ion-col col-8>\n\n            <p text-left><ion-icon name="pin" class="padding-right5 clr-orange fnt-18"></ion-icon>{{siteDetail.address}}</p>\n\n          </ion-col>\n\n          <ion-col col-4>\n\n\n\n          </ion-col>\n\n          <ion-col col-12>\n\n            <div class="map">\n\n\n\n            </div>\n\n          </ion-col>\n\n        </ion-row>\n\n      </div>\n\n      -->\n\n          <ion-row class="margin0 white-bg padding10">\n\n            <ion-col col-6 class="label-on-left">Site Name</ion-col>\n\n            <ion-col col-6>\n\n              <p text-right>{{siteDetail.name}}</p>\n\n            </ion-col>\n\n            <ion-col col-6 class="label-on-left">Client Name</ion-col>\n\n            <ion-col col-6>\n\n              <p text-right>{{siteDetail.projectName}}</p>\n\n            </ion-col>\n\n            <ion-col col-6 class="label-on-left">Address</ion-col>\n\n            <ion-col col-6>\n\n              <p text-right>{{siteDetail.address}}</p>\n\n            </ion-col>\n\n            <ion-col col-6 class="label-on-left">Address Co-ordinates</ion-col>\n\n            <ion-col col-6>\n\n              <p text-right>{{siteDetail.addressLat}},{{siteDetail.addressLng}}</p>\n\n            </ion-col>\n\n          </ion-row>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'jobs\'" class="align-center">\n\n      <ion-refresher (ionRefresh)="doRefresh($event,job)">\n\n        <ion-refresher-content></ion-refresher-content>\n\n      </ion-refresher>\n\n      <div  class="white-bg" *ngFor="let job of jobs" >\n\n        <div *ngIf="jobs?.length<0">\n\n          <ion-card>\n\n            <ion-card-content>\n\n              No Jobs\n\n            </ion-card-content>\n\n          </ion-card>\n\n        </div>\n\n        <div class="padding-left16 padding-top5">\n\n          <ion-row class="margin0">\n\n\n\n            <ion-col col-2 class="ver-center">\n\n              <button ion-button clear color="primary" class="icon-round"\n\n                      [ngClass]="{\'icon-round-red\' : (job.status == \'OVERDUE\'),\n\n                                                          \'icon-round-green\' : (job.status == \'COMPLETED\'),\n\n                                                          \'icon-round-blue\' :(job.status ==\'OPEN\' || job.status == \'ASSIGNED\' || job.status == \'INPROGRESS\')}">\n\n                <ion-icon name="ios-construct-outline" class="fnt-24"></ion-icon>\n\n              </button>\n\n            </ion-col>\n\n            <ion-col col-8 class="padding-left5">\n\n              <div class="border-btm padding-bottom5 ln-ght20" text-capitalize>\n\n                <p text-left class="margin0">{{job.title}}</p>\n\n                <p text-left class="margin0">{{job.employeeName}}</p>\n\n                <p text-left class="margin0">{{job.siteProjectName}} - {{job.siteName}}</p>\n\n              </div>\n\n            </ion-col>\n\n            <ion-col col-2 class="padding-left0 ver-center">\n\n              <div class="padding-bottom5">\n\n                <button ion-button clear color="primary" (click)="open(slidingItem, item ,count)">\n\n                  <i class="material-icons">more_horiz</i>\n\n                </button>\n\n              </div>\n\n            </ion-col>\n\n            <!--\n\n            <ion-col col-1>\n\n                <p (click)="open(ItemSliding,Item)">f</p>\n\n            </ion-col>\n\n            -->\n\n\n\n          </ion-row>\n\n        </div>\n\n        <ion-item-sliding #slidingItem>\n\n\n\n          <ion-item #item class="item-fnt padding-left0" >\n\n            <!--<div class="padding-left16">-->\n\n\n\n            <div text-capitalize >\n\n              <ion-row class="margin0">\n\n                <ion-col col-6 class="padding-right5">\n\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.actualStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n\n                    <p text-left class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="green padding-right10"></ion-icon>{{job.plannedStartTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                </ion-col>\n\n                <ion-col col-6>\n\n                  <div *ngIf="job.status ==\'COMPLETED\'">\n\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.actualEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                  <div *ngIf="job.status !=\'COMPLETED\'">\n\n                    <p text-right class="fnt-12"><ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>{{job.plannedEndTime | date:\'MMM d, y, h:mm a\' }} </p>\n\n                  </div>\n\n                </ion-col>\n\n              </ion-row>\n\n            </div>\n\n            <!--</div>-->\n\n          </ion-item>\n\n\n\n          <ion-item-options (click)="close(slidingItem)">\n\n            <div>\n\n              <button ion-button clear color="primary"><ion-icon name="md-eye" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="clr-blue"><ion-icon name="md-create" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="secondary" *ngIf="job.status !=\'COMPLETED\'" (click)="compeleteJob(job)"><ion-icon name="md-checkmark-circle" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n            <div>\n\n              <button ion-button clear color="danger"><ion-icon name="md-close-circle" class="fnt-24"></ion-icon></button>\n\n            </div>\n\n          </ion-item-options>\n\n        </ion-item-sliding>\n\n\n\n      </div>\n\n\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'quotation\'">\n\n\n\n      <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-orange">\n\n              <ion-icon name="mail" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-blue">\n\n              <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-green">\n\n              <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Approved</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n      <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n            <button ion-button clear color="primary" class="q-round icon-round-red">\n\n              <i class="material-icons">archive</i>\n\n            </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n          <div>\n\n            <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n\n          </div>\n\n          <div>\n\n            <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n          <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-list>\n\n    <ion-list *ngSwitchCase="\'employee\'">\n\n      <ion-refresher (ionRefresh)="doRefresh($event,employee)">\n\n        <ion-refresher-content></ion-refresher-content>\n\n      </ion-refresher>\n\n\n\n        <ion-item *ngFor="let emp of employee;let i of index" class="bottom-border emp" >\n\n            <ion-avatar item-start *ngIf="emp.enrolled_face">\n\n                <img  [src]="emp.enrolled_face" >\n\n            </ion-avatar>\n\n            <p *ngIf="!emp.enrolled_face && first(emp.name)"></p>\n\n            <ion-avatar item-start *ngIf="!emp.enrolled_face" class="emp-round">\n\n                <p class="margin-auto">{{firstLetter}}</p>\n\n            </ion-avatar>\n\n            <p text-left class="fnt-wt">{{emp.name}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n  </div>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\site\site-view.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_6__service_employeeService__["a" /* EmployeeService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_13__service_siteService__["a" /* SiteService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_4__service_jobService__["a" /* JobService */], __WEBPACK_IMPORTED_MODULE_5__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_12__service_quotationService__["a" /* QuotationService */]])
    ], SiteViewPage);
    return SiteViewPage;
}());

//# sourceMappingURL=site-view.js.map

/***/ }),

/***/ 509:
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
            selector: 'page-reports',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\reports\reports.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\reports\reports.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], ReportsPage);
    return ReportsPage;
}());

//# sourceMappingURL=reports.js.map

/***/ }),

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AttendancePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__attendance_popover__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__site_list_site_list__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__site_employeeList_site_employeeList__ = __webpack_require__(182);
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
            selector: 'page-attendance',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance\attendance.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Attendance</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-fab bottom right>\n\n    <button (click)="markAttendance()" ion-fab><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab>\n\n\n\n  <div class="row">\n\n      <ion-row class="margin0 white-bg padding10 margin-bottom25 width98 margin-side-auto" *ngFor="let a of attendances">\n\n          <ion-col col-12 *ngIf="!attendances">\n\n              <p>No Records</p>\n\n          </ion-col>\n\n          <ion-col col-6 >\n\n              <p text-left class="margin0">{{a.employeeFullName}}</p>\n\n              <p text-left class="margin0 label-on-left">{{a.siteName}}</p>\n\n          </ion-col>\n\n          <ion-col col-6>\n\n\n\n          </ion-col>\n\n\n\n          <ion-col col-6 class="align-center">\n\n              <ion-item no-lines class="item-label" >\n\n                  <ion-avatar *ngIf="a.checkInImage">\n\n                      <img  [src]="a.checkInImage" (click)="viewImage(a.checkInImage)">\n\n                  </ion-avatar>\n\n                  <ion-avatar *ngIf="!a.checkInImage">\n\n                      <img  src="img/user.png" width="10%">\n\n                  </ion-avatar>\n\n              </ion-item>\n\n          </ion-col>\n\n          <ion-col col-6 class="align-center">\n\n              <ion-item no-lines class="item-label">\n\n                  <ion-avatar *ngIf="a.checkOutImage" (click)="viewImage(a.checkOutImage)">\n\n                      <img  [src]="a.checkOutImage" >\n\n                  </ion-avatar>\n\n                  <ion-avatar *ngIf="!a.checkOutImage">\n\n                      <img  src="img/user.png" >\n\n                  </ion-avatar>\n\n              </ion-item>\n\n          </ion-col>\n\n          <ion-col col-6>\n\n              <p text-left class="fnt-12">\n\n                  <ion-icon ios="ios-calendar" md="md-calendar" class="green  padding-right10"></ion-icon>\n\n                  {{a.checkInTime | date:\'MMM d, y, h:mm a\' }}\n\n              </p>\n\n          </ion-col>\n\n          <ion-col col-6>\n\n              <p text-left class="fnt-12">\n\n                  <ion-icon ios="ios-calendar" md="md-calendar" class="red padding-right10"></ion-icon>\n\n                  {{a.checkOutTime | date:\'MMM d, y, h:mm a\' }}\n\n              </p>\n\n          </ion-col>\n\n      </ion-row>\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance\attendance.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_7__service_attendanceService__["a" /* AttendanceService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_6__service_componentService__["a" /* componentService */]])
    ], AttendancePage);
    return AttendancePage;
}());

//# sourceMappingURL=attendance.js.map

/***/ }),

/***/ 511:
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
            selector: 'page-attendance-popover',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance\attendance-popover.html"*/`<ion-content>\n\n\n\n    <div>\n\n        <img [src]="img">\n\n    </div>\n\n\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance\attendance-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], AttendancePopoverPage);
    return AttendancePopoverPage;
}());

//# sourceMappingURL=attendance-popover.js.map

/***/ }),

/***/ 512:
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
            selector: 'page-rate-card',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\rate-card\rate-card.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Rate Cards</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n    <ion-fab bottom right>\n\n        <button mini (click)="createRate()"  ion-fab><ion-icon name="add"></ion-icon></button>\n\n    </ion-fab>\n\n\n\n    <ion-list>\n\n        <ion-item *ngFor="let rate of rateCards">\n\n            <p text-left style="color: #2e2e2e">{{rate.title}} - {{rate.cost}} - {{rate.uom}}</p>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\rate-card\rate-card.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_3__service_componentService__["a" /* componentService */], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"], __WEBPACK_IMPORTED_MODULE_5__service_quotationService__["a" /* QuotationService */]])
    ], RateCardPage);
    return RateCardPage;
}());

//# sourceMappingURL=rate-card.js.map

/***/ }),

/***/ 514:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IonSimpleWizard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ion_simple_wizard_animations__ = __webpack_require__(515);
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
            selector: 'ion-simple-wizard',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\ion-simple-wizard\ion-simple-wizard.component.html"*/`<ng-content></ng-content>\n\n<ion-footer [hidden]="hideWizard">\n\n  <div class="ion-wizard-footer">\n\n    <!--Back Button-->\n\n    <ion-fab [@btnState] *ngIf="!isOnFirstStep()" left bottom>\n\n      <button ion-fab (click)="back()">\n\n        <ion-icon name="arrow-round-back"></ion-icon>\n\n      </button>\n\n    </ion-fab>\n\n    <!--Steps count-->   \n\n    <ion-badge *ngIf="showSteps">{{step}} / {{steps}}</ion-badge>\n\n    <!--Next Button-->\n\n    <ion-fab [@btnState] *ngIf="(!isOnFinalStep() && getCondition())" right bottom>\n\n      <button ion-fab (click)="next()">\n\n        <ion-icon name="arrow-round-forward"></ion-icon>\n\n      </button>\n\n    </ion-fab>\n\n    <!--Finish Button-->\n\n    <ion-fab [@btnState] *ngIf="(isOnFinalStep() && getCondition())" right bottom>\n\n      <button ion-fab (click)="finish.emit(step + 1)">\n\n        <ion-icon [name]="finishIcon"></ion-icon>\n\n      </button>\n\n    </ion-fab>\n\n  </div>\n\n</ion-footer>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\ion-simple-wizard\ion-simple-wizard.component.html"*/,
            animations: __WEBPACK_IMPORTED_MODULE_2__ion_simple_wizard_animations__["a" /* WizardAnimations */].btnRotate
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"]])
    ], IonSimpleWizard);
    return IonSimpleWizard;
}());

//# sourceMappingURL=ion-simple-wizard.component.js.map

/***/ }),

/***/ 515:
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

/***/ 517:
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
            selector: 'page-attendance-view',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance-view\attendance-view.html"*/`<!--\n\n  Generated template for the AttendanceViewPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>attendance-view</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <div class="align-center">\n\n    <img *ngIf="img" [src]="domSanitizer.bypassSecurityTrustUrl(img)" width="80%" height="70%" class="margin-auto">\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance-view\attendance-view.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]])
    ], AttendanceViewPage);
    return AttendanceViewPage;
}());

//# sourceMappingURL=attendance-view.js.map

/***/ }),

/***/ 518:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(519);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(523);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 523:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(854);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(855);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_list_list__ = __webpack_require__(856);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_status_bar__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_splash_screen__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_attendance_view_attendance_view__ = __webpack_require__(517);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_login_login__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_site_list_site_list__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_attendance_list_attendance_list__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_employee_employee_list__ = __webpack_require__(159);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_storage__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_geolocation__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_geofence__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_site_employeeList_site_employeeList__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_dashboard_dashboard__ = __webpack_require__(336);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_tabs_tabs__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_site_site__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_jobs_jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_reports_reports__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_logout_logout__ = __webpack_require__(857);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27_ionic2_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_quotation_quotation_popover__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_quotation_quotation_view__ = __webpack_require__(858);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_quotation_create_quotation__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_attendance_attendance__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_attendance_attendance_popover__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_customer_detail_customer_detail__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_jobs_view_job__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_employee_list_employee_list__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__pages_service_componentService__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__pages_rate_card_rate_card__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__pages_rate_card_create_rate_card__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__pages_employee_list_employee_detail__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__pages_site_site_view__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pages_jobs_add_job__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_ion_simple_wizard_ion_simple_wizard_component__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__pages_ion_simple_wizard_ion_simple_wizard_step_component__ = __webpack_require__(859);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__angular_platform_browser_animations__ = __webpack_require__(860);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_jobs_completeJob__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_quotation_create_quotation_step_2__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__pages_quotation_create_quotation_step_3__ = __webpack_require__(862);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__pages_quotation_approvedQuotations__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__pages_quotation_draftedQuotations__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_quotation_submittedQuotations__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_quotation_archivedQuotations__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_quotation_viewQuotation__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__pages_employee_list_create_employee__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__ionic_native_onesignal__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__ionic_native_toast__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_service_app_config__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__pages_service_attendanceService__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__pages_service_employeeService__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__pages_service_jobService__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__pages_service_quotationService__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__pages_service_siteService__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__pages_jobs_job_popover__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__ionic_native_transfer__ = __webpack_require__(463);
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
                __WEBPACK_IMPORTED_MODULE_64__ionic_native_transfer__["a" /* Transfer */],
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

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(335);
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

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MY_CONFIG_TOKEN; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var AppConfig = {
    Url: "http://192.168.1.9:8088/",
    NodeUrl: "http://192.168.1.9:8088/",
};
var MY_CONFIG_TOKEN = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["InjectionToken"]('config');
//# sourceMappingURL=app-config.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Interceptor_HttpClient__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_config__ = __webpack_require__(56);
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
    EmployeeService.prototype.markEnrolled = function (employee) {
        return this.http.post(this.config.Url + 'api/employee/enroll', { id: employee.id, enrolled_face: employee.imageData }).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
        });
    };
    EmployeeService.prototype.employeeImage = function () {
        return this.http.post(this.config.Url + 'api/employee/authorizeImage', {}).map(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return error;
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

/***/ 75:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateQuotationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_authService__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__create_quotation_step_2__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_siteService__ = __webpack_require__(34);
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
            selector: 'page-create-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Add-Quotation</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n            <div class="row">\n\n                <div class="col-md-10">\n\n                    <form id="LoginValidation">\n\n                    <div class="card">\n\n                        <div class="card-content">\n\n                            <ion-row padding>\n\n                                    <ion-col col-12>\n\n                                        <div class="form-group label-floating" [ngClass]="{\'has-error\': eMsg==\'all\'||eMsg==\'title\'}">\n\n                                            <label class="control-label">Title</label>\n\n                                            <input class="form-control" type="text" [(ngModel)]="title" id="title" name="title" #titl="ngModel" required [ngClass]="{\'has-error\': titl.errors || eMsg==\'all\'|| eMsg==\'title\'}">\n\n                                            <div *ngIf="titl.errors && (titl.dirty || titl.touched)" class="error-msg">\n\n\n\n                                            </div>\n\n\n\n                                            <div *ngIf="titl.errors && (titl.untouched )" class="error-msg">\n\n\n\n                                            </div>\n\n                                        </div>\n\n\n\n                                    </ion-col>\n\n\n\n                                    <ion-col col-12>\n\n                                        <div class="form-group label-floating">\n\n                                            <label class="control-label">Description</label>\n\n                                            <input type="text" class="form-control" [(ngModel)]="description" name="description" required="true">\n\n                                        </div>\n\n                                    </ion-col>\n\n\n\n                            </ion-row>\n\n                        </div>\n\n                    </div>\n\n                    </form>\n\n                </div>\n\n            </div>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n    <ion-toolbar class="align-center" >\n\n        <button class="btn btn-warning center margin-auto" type="submit" (click)="saveQuotation(title,description)">\n\n            Next<ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </button>\n\n    </ion-toolbar>\n\n</ion-footer>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation.html"*/
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__quotation_popover__ = __webpack_require__(156);
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
    function QuotationPage(navCtrl, popoverCtrl, authService, quotationService) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.authService = authService;
        this.quotationService = quotationService;
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
            selector: 'page-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Quotation</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-fab bottom right>\n\n    <button (click)="createQuotation()" ion-fab color="dark"><ion-icon name="add" class="clr-orange"></ion-icon></button>\n\n  </ion-fab>\n\n\n\n  <ion-row class="margin0 white-bg border-btm padding10 paddding-top20" (click)="gotoDraftedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n          <div class="q-round ver-center">\n\n                <button ion-button clear color="primary" class="q-round icon-round-orange">\n\n                  <ion-icon name="mail" class="fnt-24"></ion-icon>\n\n                </button>\n\n          </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n                <div>\n\n                  <p text-left class="fnt-18 margin-bottom5">Drafted</p>\n\n                </div>\n\n                <div>\n\n                  <span class="clr-green padding-right2">(</span><span class="clr-orange">{{draftedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n                </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n                <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n    </ion-row>\n\n    <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoSubmittedQuotation()">\n\n        <ion-col col-2 class="ver-center">\n\n            <div class="q-round ver-center">\n\n                <button ion-button clear color="primary" class="q-round icon-round-blue">\n\n                    <ion-icon name="arrow-round-forward" class="fnt-24"></ion-icon>\n\n                </button>\n\n            </div>\n\n        </ion-col>\n\n        <ion-col col-9 class="padding-left10">\n\n            <div>\n\n                <p text-left class="fnt-18 margin-bottom5">Submitted</p>\n\n            </div>\n\n            <div>\n\n                <span class="clr-green padding-right2">(</span><span class="clr-blue">{{submittedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n            </div>\n\n        </ion-col>\n\n        <ion-col col-1 class="ver-center">\n\n            <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n        </ion-col>\n\n    </ion-row>\n\n  <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoApprovedQuotation()">\n\n    <ion-col col-2 class="ver-center">\n\n      <div class="q-round ver-center">\n\n        <button ion-button clear color="primary" class="q-round icon-round-green">\n\n          <ion-icon name="checkmark" class="fnt-24"></ion-icon>\n\n        </button>\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-9 class="padding-left10">\n\n      <div>\n\n        <p text-left class="fnt-18 margin-bottom5">Approved</p>\n\n      </div>\n\n      <div>\n\n        <span class="clr-green padding-right2">(</span><span class="green">{{approvedQuotationsCount}}</span><span class="clr-green padding-left2">)</span>\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-1 class="ver-center">\n\n      <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row class="margin0 white-bg border-btm padding10" (click)="gotoArchivedQuotation()">\n\n    <ion-col col-2 class="ver-center">\n\n      <div class="q-round ver-center">\n\n        <button ion-button clear color="primary" class="q-round icon-round-red">\n\n            <i class="material-icons">archive</i>\n\n        </button>\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-9 class="padding-left10">\n\n      <div>\n\n        <p text-left class="fnt-18 margin-bottom5">Archieved</p>\n\n      </div>\n\n      <div>\n\n        <span class="clr-green padding-right2">(</span><span class="clr-red">{{archivedQuotationsCount}}</span><span class="padding-left2">)</span>\n\n      </div>\n\n    </ion-col>\n\n    <ion-col col-1 class="ver-center">\n\n      <ion-icon class="primary-clr fnt-24" name="ios-arrow-forward-outline"></ion-icon>\n\n    </ion-col>\n\n  </ion-row>\n\n\n\n\n\n\n\n\n\n<!--\n\n            <ion-col col-12 class="padding-top0">\n\n\n\n              <div class="table-responsive table-sales">\n\n\n\n                <table class="table fnt-18">\n\n                  <tbody>\n\n                  <tr (click)="gotoDraftedQuotation()">\n\n                    <td>Drafted</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>{{draftedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr (click)="gotoSubmittedQuotation()">\n\n                    <td>Submitted</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>{{submittedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr (click)="gotoApprovedQuotation()">\n\n                    <td>Approved</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>{{approvedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr (click)="gotoArchivedQuotation()">\n\n                    <td>Archieved</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>{{archivedQuotationsCount}}<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  </tbody>\n\n                </table>\n\n              </div>\n\n            </ion-col>\n\n-->\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_4__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_9__service_quotationService__["a" /* QuotationService */]])
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
            selector: 'page-view-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\viewQuotation.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title> </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <ion-fab bottom right>\n\n        <button mini  ion-fab><ion-icon name="ios-create"></ion-icon></button>\n\n    </ion-fab>\n\n    <ion-row class="margin0 white-bg padding10">\n\n        <!--<ion-col col-6 class="label-on-left">Quotation Id</ion-col>-->\n\n        <!--<ion-col col-6>-->\n\n        <!--<p text-right>{{quotation.id}}</p>-->\n\n        <!--</ion-col>-->\n\n        <ion-col col-6 class="label-on-left">Title</ion-col>\n\n        <ion-col col-6 *ngIf="quotation.title">\n\n            <p text-right>{{quotation.title}}</p>\n\n        </ion-col>\n\n        <ion-col col-6 class="label-on-left">Description</ion-col>\n\n        <ion-col col-6 *ngIf="quotation.description">\n\n            <p text-right>{{quotation.description}}</p>\n\n        </ion-col>\n\n\n\n    </ion-row>\n\n    <div class="card-content white-bg">\n\n        <div class="table-responsive">\n\n            <table class="table table-scroll">\n\n                <thead>\n\n                <tr>\n\n                    <th class="text-center">Type</th>\n\n                    <th class="text-center">Name</th>\n\n                    <th class="text-center">Rate</th>\n\n                    <th class="text-center">No</th>\n\n                    <th class="text-center">Uom</th>\n\n                    <th class="text-center">Total</th>\n\n                    <th class="text-center">&nbsp;&nbsp;&nbsp;&nbsp;</th>\n\n                </tr>\n\n                </thead>\n\n                <tbody *ngIf="quotation.rateCardDetails.length>0">\n\n                <tr *ngFor="let rate of quotation.rateCardDetails;let i = index ">\n\n                    <td class="text-center">{{rate.type}}</td>\n\n                    <td class="text-center table-data padding-left0 padding-right0">{{rate.name}}</td>\n\n                    <td class="text-center">{{rate.cost}}</td>\n\n                    <td class="text-center">\n\n                        <!--<input type="number" class="form-control align-center width15" [(ngModel)]="rate.no" (change)="addTotal(i,rate.no,rate.cost)">-->\n\n                        {{rate.no}}\n\n                    </td>\n\n                    <td class="text-center">{{rate.uom}}</td>\n\n                    <td class="text-center">{{rate.total}}</td>\n\n                    <!--<td class="td-actions text-center">-->\n\n                    <!--<i class="material-icons clr-red" (click)="remove(i)">close</i>-->\n\n                    <!--</td>-->\n\n                </tr>\n\n                <tr>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td></td>\n\n                    <td class="text-center">Grand Total</td>\n\n                    <td class="text-center">{{quotation.grandTotal}}</td>\n\n                    <td></td>\n\n                </tr>\n\n                </tbody>\n\n                <tbody *ngIf="quotation.title.length<0">\n\n                <div class="card">\n\n                    <td>No rates added</td>\n\n                </div>\n\n                </tbody>\n\n            </table>\n\n        </div>\n\n    </div>\n\n</ion-content>\n\n\n\n<ion-footer >\n\n    <ion-toolbar class="align-right" >\n\n\n\n        <button *ngIf="!quotation.isSubmitted" class="btn btn-success center pull-right" (click)="sendQuotation(quotation)">\n\n            Send Quotation &nbsp; <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </button>\n\n        <button *ngIf="quotation.isSubmitted" class="btn btn-success center pull-right" (click)="approveQuotation(quotation)">\n\n            Approve Quotation &nbsp; <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n\n        </button>\n\n\n\n    </ion-toolbar>\n\n</ion-footer>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\viewQuotation.html"*/
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(33);
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
            selector: 'page-attendance-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance-list\attendance-list.html"*/`<!--\n\n  Generated template for the AttendanceListPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-navbar color="primary" >\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Attendance</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <ion-item *ngFor="let a of attendances" class="bottom-border">\n\n      <ion-row>\n\n      <!--<ion-col col-2 >-->\n\n        <!--&lt;!&ndash;<ion-icon name="calendar" class="fnt-30 margin9 icon-color"></ion-icon>&ndash;&gt;-->\n\n      <!--</ion-col>-->\n\n      <ion-col col-10>\n\n        <p>Site Name - {{a.siteName}}</p>\n\n        <p>Employee - {{a.employeeFullName}}</p>\n\n        <p><b>Checkin Time</b>{{a.checkInTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n        <p><b>Checkout Time</b>{{a.checkOutTime |date:\'MM/dd/yyyy @ h:mma\'}}</p>\n\n      </ion-col>\n\n      </ion-row>\n\n      <ion-row *ngIf="!a">\n\n        No Attendance Records Found\n\n      </ion-row>\n\n    </ion-item>\n\n  </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\attendance-list\attendance-list.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_3__service_authService__["a" /* authService */]])
    ], AttendanceListPage);
    return AttendanceListPage;
}());

//# sourceMappingURL=attendance-list.js.map

/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 340,
	"./af.js": 340,
	"./ar": 341,
	"./ar-dz": 342,
	"./ar-dz.js": 342,
	"./ar-kw": 343,
	"./ar-kw.js": 343,
	"./ar-ly": 344,
	"./ar-ly.js": 344,
	"./ar-ma": 345,
	"./ar-ma.js": 345,
	"./ar-sa": 346,
	"./ar-sa.js": 346,
	"./ar-tn": 347,
	"./ar-tn.js": 347,
	"./ar.js": 341,
	"./az": 348,
	"./az.js": 348,
	"./be": 349,
	"./be.js": 349,
	"./bg": 350,
	"./bg.js": 350,
	"./bm": 351,
	"./bm.js": 351,
	"./bn": 352,
	"./bn.js": 352,
	"./bo": 353,
	"./bo.js": 353,
	"./br": 354,
	"./br.js": 354,
	"./bs": 355,
	"./bs.js": 355,
	"./ca": 356,
	"./ca.js": 356,
	"./cs": 357,
	"./cs.js": 357,
	"./cv": 358,
	"./cv.js": 358,
	"./cy": 359,
	"./cy.js": 359,
	"./da": 360,
	"./da.js": 360,
	"./de": 361,
	"./de-at": 362,
	"./de-at.js": 362,
	"./de-ch": 363,
	"./de-ch.js": 363,
	"./de.js": 361,
	"./dv": 364,
	"./dv.js": 364,
	"./el": 365,
	"./el.js": 365,
	"./en-au": 366,
	"./en-au.js": 366,
	"./en-ca": 367,
	"./en-ca.js": 367,
	"./en-gb": 368,
	"./en-gb.js": 368,
	"./en-ie": 369,
	"./en-ie.js": 369,
	"./en-nz": 370,
	"./en-nz.js": 370,
	"./eo": 371,
	"./eo.js": 371,
	"./es": 372,
	"./es-do": 373,
	"./es-do.js": 373,
	"./es-us": 374,
	"./es-us.js": 374,
	"./es.js": 372,
	"./et": 375,
	"./et.js": 375,
	"./eu": 376,
	"./eu.js": 376,
	"./fa": 377,
	"./fa.js": 377,
	"./fi": 378,
	"./fi.js": 378,
	"./fo": 379,
	"./fo.js": 379,
	"./fr": 380,
	"./fr-ca": 381,
	"./fr-ca.js": 381,
	"./fr-ch": 382,
	"./fr-ch.js": 382,
	"./fr.js": 380,
	"./fy": 383,
	"./fy.js": 383,
	"./gd": 384,
	"./gd.js": 384,
	"./gl": 385,
	"./gl.js": 385,
	"./gom-latn": 386,
	"./gom-latn.js": 386,
	"./gu": 387,
	"./gu.js": 387,
	"./he": 388,
	"./he.js": 388,
	"./hi": 389,
	"./hi.js": 389,
	"./hr": 390,
	"./hr.js": 390,
	"./hu": 391,
	"./hu.js": 391,
	"./hy-am": 392,
	"./hy-am.js": 392,
	"./id": 393,
	"./id.js": 393,
	"./is": 394,
	"./is.js": 394,
	"./it": 395,
	"./it.js": 395,
	"./ja": 396,
	"./ja.js": 396,
	"./jv": 397,
	"./jv.js": 397,
	"./ka": 398,
	"./ka.js": 398,
	"./kk": 399,
	"./kk.js": 399,
	"./km": 400,
	"./km.js": 400,
	"./kn": 401,
	"./kn.js": 401,
	"./ko": 402,
	"./ko.js": 402,
	"./ky": 403,
	"./ky.js": 403,
	"./lb": 404,
	"./lb.js": 404,
	"./lo": 405,
	"./lo.js": 405,
	"./lt": 406,
	"./lt.js": 406,
	"./lv": 407,
	"./lv.js": 407,
	"./me": 408,
	"./me.js": 408,
	"./mi": 409,
	"./mi.js": 409,
	"./mk": 410,
	"./mk.js": 410,
	"./ml": 411,
	"./ml.js": 411,
	"./mr": 412,
	"./mr.js": 412,
	"./ms": 413,
	"./ms-my": 414,
	"./ms-my.js": 414,
	"./ms.js": 413,
	"./mt": 415,
	"./mt.js": 415,
	"./my": 416,
	"./my.js": 416,
	"./nb": 417,
	"./nb.js": 417,
	"./ne": 418,
	"./ne.js": 418,
	"./nl": 419,
	"./nl-be": 420,
	"./nl-be.js": 420,
	"./nl.js": 419,
	"./nn": 421,
	"./nn.js": 421,
	"./pa-in": 422,
	"./pa-in.js": 422,
	"./pl": 423,
	"./pl.js": 423,
	"./pt": 424,
	"./pt-br": 425,
	"./pt-br.js": 425,
	"./pt.js": 424,
	"./ro": 426,
	"./ro.js": 426,
	"./ru": 427,
	"./ru.js": 427,
	"./sd": 428,
	"./sd.js": 428,
	"./se": 429,
	"./se.js": 429,
	"./si": 430,
	"./si.js": 430,
	"./sk": 431,
	"./sk.js": 431,
	"./sl": 432,
	"./sl.js": 432,
	"./sq": 433,
	"./sq.js": 433,
	"./sr": 434,
	"./sr-cyrl": 435,
	"./sr-cyrl.js": 435,
	"./sr.js": 434,
	"./ss": 436,
	"./ss.js": 436,
	"./sv": 437,
	"./sv.js": 437,
	"./sw": 438,
	"./sw.js": 438,
	"./ta": 439,
	"./ta.js": 439,
	"./te": 440,
	"./te.js": 440,
	"./tet": 441,
	"./tet.js": 441,
	"./th": 442,
	"./th.js": 442,
	"./tl-ph": 443,
	"./tl-ph.js": 443,
	"./tlh": 444,
	"./tlh.js": 444,
	"./tr": 445,
	"./tr.js": 445,
	"./tzl": 446,
	"./tzl.js": 446,
	"./tzm": 447,
	"./tzm-latn": 448,
	"./tzm-latn.js": 448,
	"./tzm.js": 447,
	"./uk": 449,
	"./uk.js": 449,
	"./ur": 450,
	"./ur.js": 450,
	"./uz": 451,
	"./uz-latn": 452,
	"./uz-latn.js": 452,
	"./uz.js": 451,
	"./vi": 453,
	"./vi.js": 453,
	"./x-pseudo": 454,
	"./x-pseudo.js": 454,
	"./yo": 455,
	"./yo.js": 455,
	"./zh-cn": 456,
	"./zh-cn.js": 456,
	"./zh-hk": 457,
	"./zh-hk.js": 457,
	"./zh-tw": 458,
	"./zh-tw.js": 458
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
webpackContext.id = 833;

/***/ }),

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_site_site__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_jobs_jobs__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_reports_reports__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_attendance_attendance__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_quotation_quotation__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_employee_list_employee_list__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_rate_card_rate_card__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_onesignal__ = __webpack_require__(513);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














// import { Routes, RouterModule } from '@angular/router';
var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, oneSignal) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.oneSignal = oneSignal;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Dashboard', component: __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */], active: true, icon: 'dashboard' },
            { title: 'Site', component: __WEBPACK_IMPORTED_MODULE_5__pages_site_site__["a" /* SitePage */], active: false, icon: 'dns' },
            // { title: 'Client', component: CustomerDetailPage,active:false,icon:'person'},
            { title: 'Employee', component: __WEBPACK_IMPORTED_MODULE_11__pages_employee_list_employee_list__["a" /* EmployeeListPage */], active: false, icon: 'people' },
            { title: 'Jobs', component: __WEBPACK_IMPORTED_MODULE_6__pages_jobs_jobs__["a" /* JobsPage */], active: false, icon: 'description' },
            { title: 'Attendance', component: __WEBPACK_IMPORTED_MODULE_8__pages_attendance_attendance__["a" /* AttendancePage */], active: false, icon: 'content_paste' },
            { title: 'Rate Card', component: __WEBPACK_IMPORTED_MODULE_12__pages_rate_card_rate_card__["a" /* RateCardPage */], active: false, icon: 'description' },
            { title: 'Quotation', component: __WEBPACK_IMPORTED_MODULE_10__pages_quotation_quotation__["a" /* QuotationPage */], active: false, icon: 'receipt' },
            { title: 'Reports', component: __WEBPACK_IMPORTED_MODULE_7__pages_reports_reports__["a" /* ReportsPage */], active: false, icon: 'trending_up' },
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\app\app.html"*/`<ion-menu class="menu-width" [content]="content">\n\n\n\n\n\n  <ion-content>\n\n\n\n    <div class="wrapper">\n\n      <div class="sidebar" data-color="rose" data-background-color="black"  data-image="img/sidebar-1.jpg">\n\n      <!--\n\n    Tip 1: You can change the color of the sidebar using: data-color="purple | blue | green | orange | red"\n\n\n\n    Tip 2: you can also add an image using data-image tag\n\n  -->\n\n        <div class="logo">\n\n          <p text-center>User</p>\n\n        </div>\n\n        <div class="sidebar-wrapper">\n\n          <ul class="nav">\n\n            <li menuClose *ngFor="let p of pages" (click)="openPage(p)" [ngClass]="{\'active\':p.active}" >\n\n              <a>\n\n                <i class="material-icons">{{p.icon}}</i>\n\n                <p>{{p.title}}</p>\n\n              </a>\n\n            </li>\n\n            <li menuClose (click)="logout()">\n\n              <a>\n\n                  <i class="material-icons">exit_to_app</i>\n\n                  <p>Logout</p>\n\n              </a>\n\n            </li>\n\n          </ul>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <!--\n\n    <ion-list>\n\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n\n        {{p.title}}\n\n      </button>\n\n    </ion-list>-->\n\n  </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Platform"], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_onesignal__["a" /* OneSignal */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 855:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var HomePage = (function () {
    function HomePage() {
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\home\home.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\home\home.html"*/
        }),
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 856:
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
            selector: 'page-list',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\list\list.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>List</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n    <button ion-item *ngFor="let item of items" (click)="itemTapped($event, item)">\n\n      <ion-icon [name]="item.icon" item-start></ion-icon>\n\n      {{item.title}}\n\n      <div class="item-note" item-end>\n\n        {{item.note}}\n\n      </div>\n\n    </button>\n\n  </ion-list>\n\n  <div *ngIf="selectedItem" padding>\n\n    You navigated here from <b>{{selectedItem.title}}</b>\n\n  </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\list\list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"]])
    ], ListPage);
    return ListPage;
    var ListPage_1;
}());

//# sourceMappingURL=list.js.map

/***/ }),

/***/ 857:
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
            selector: 'page-logout',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\logout\logout.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h3>Ionic Menu Starter</h3>\n\n\n\n  <p>\n\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n\n  </p>\n\n\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\logout\logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"]])
    ], LogoutPage);
    return LogoutPage;
}());

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 858:
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
            selector: 'page-view-quotation',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation-view.html"*/`<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>Quotation</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n          <div class="row padding0 margin0 white-bg">\n\n            <ion-col col-12 class="padding-top0">\n\n              <div class="table-responsive table-sales">\n\n                <table class="table">\n\n                  <tbody>\n\n                  <tr (click)="quotationView()">\n\n                    <td>\n\n                      <div class="flag">\n\n                        <img src="../assets/img/flags/US.png">\n\n                      </div>\n\n                    </td>\n\n                    <td>Approved</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr>\n\n                    <td>\n\n                      <div class="flag">\n\n                        <img src="../assets/img/flags/DE.png">\n\n                      </div>\n\n                    </td>\n\n                    <td>Overdue</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr>\n\n                    <td>\n\n                      <div class="flag">\n\n                        <img src="../assets/img/flags/AU.png">\n\n                      </div>\n\n                    </td>\n\n                    <td>Requested</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  <tr>\n\n                    <td>\n\n                      <div class="flag">\n\n                        <img src="../assets/img/flags/AU.png">\n\n                      </div>\n\n                    </td>\n\n                    <td>Archieved</td>\n\n                    <td class="text-right">\n\n                      <span class="clr-orange padding-right2">(</span>0<span class="clr-orange padding-left2">)</span>\n\n                    </td>\n\n                    <td class="text-right">\n\n                      <ion-icon class="primary-clr padding-left5 fnt-12" name="arrow-forward"></ion-icon>\n\n                    </td>\n\n                  </tr>\n\n                  </tbody>\n\n                </table>\n\n              </div>\n\n            </ion-col>\n\n          </div>\n\n</ion-content>\n\n`/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\quotation-view.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"]])
    ], QuotationViewPage);
    return QuotationViewPage;
}());

//# sourceMappingURL=quotation-view.js.map

/***/ }),

/***/ 859:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IonSimpleWizardStep; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ion_simple_wizard_component__ = __webpack_require__(514);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ion_simple_wizard_animations__ = __webpack_require__(515);
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

/***/ 862:
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
            selector: 'page-create-quotation-step3',template:/*ion-inline-start:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation-step-3.html"*/``/*ion-inline-end:"D:\usha\ionic\FMS-NEW\MobileApp\src\pages\quotation\create-quotation-step-3.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ModalController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["PopoverController"], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Events"], __WEBPACK_IMPORTED_MODULE_2__service_authService__["a" /* authService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"]])
    ], CreateQuotationPage3);
    return CreateQuotationPage3;
}());

//# sourceMappingURL=create-quotation-step-3.js.map

/***/ })

},[518]);
//# sourceMappingURL=main.js.map