import { Component } from '@angular/core';
import {
  IonicPage, Item, ItemSliding, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {componentService} from "../service/componentService";
import {JobsPage} from "../jobs/jobs";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {CreateQuotationPage} from "../quotation/create-quotation";
import {ApprovedQuotationPage} from "../quotation/approvedQuotations";
import {ArchivedQuotationPage} from "../quotation/archivedQuotations";
import {DraftedQuotationPage} from "../quotation/draftedQuotations";
import {SubmittedQuotationPage} from "../quotation/submittedQuotations";
import {QuotationService} from "../service/quotationService";
import {ViewJobPage} from "../jobs/view-job";
import {CompleteJobPage} from "../jobs/completeJob";

declare  var demo;

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-detail',
  templateUrl: 'employee-detail.html',
})
export class EmployeeDetailPage {
  isLoading:boolean;

  empDetail:any;
  categories:any;
  jobs:any;
  attendances:any;
  ref=false;
  job="job";
  attendance="attendance";
  quotations:any;
  count=0;
  approvedQuotations:any;
  submittedQuotations:any;
  draftedQuotations:any;
  archivedQuotations:any;
  approvedQuotationsCount:any;
  submittedQuotationsCount:any;
  draftedQuotationsCount:any;
  archivedQuotationsCount:any;
  approvedQuotationpage:ApprovedQuotationPage;
  archivedQuotationPage:ArchivedQuotationPage;
  draftedQuotationsPage:DraftedQuotationPage;
  submittedQuotationsPage:SubmittedQuotationPage;


  page:1;
  pageSort:15;
  constructor(public navCtrl: NavController,public myService:authService, public component:componentService,public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toastCtrl:ToastController,
              private geoFence:Geofence, private jobService: JobService, private attendanceService: AttendanceService, private quotationService: QuotationService) {

    this.empDetail=this.navParams.get('emp');
    this.categories = 'detail';
    this.draftedQuotationsCount= 0;
    this.approvedQuotationsCount=0;
    this.submittedQuotationsCount=0;
    this.archivedQuotationsCount=0;
    this.draftedQuotations=[];
    this.approvedQuotations=[];
    this.submittedQuotations=[];
    this.archivedQuotations=[];
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Employee Detail Page');
    console.log(this.empDetail);


  }

  doRefresh(refresher,segment)
  {
    this.ref=true;
    if(segment=="job")
    {
      this.getJobs(this.ref);
      refresher.complete();
    }
    else if(segment=="attendance")
    {
      console.log("------------- segment attandance");
      this.getAttendance(this.ref);
      refresher.complete();
    }

  }

  getJobs(ref)
  {
    if(this.jobs)
    {
      if(ref)
      {
        this.loadJobs();
      }
      else
      {
        this.jobs=this.jobs;
      }
    }
    else
    {
      this.loadJobs();
    }
  }

  loadJobs()
  {
    this.component.showLoader('Getting All Jobs');
    this.isLoading=true;
    var search={empId:this.empDetail.id};
    this.jobService.getJobs(search).subscribe(response=>{
        this.component.closeLoader();
        this.isLoading=false;
        console.log("Job Refresher");
      console.log(response);
      this.jobs = response.transactions;
        console.log(this.jobs);
        console.log(this.jobs.length);
    })
  }

  getAttendance(ref)
  {
    if(this.attendances)
    {
      if(ref)
      {
        console.log("------------- segment attandance ref true");
        this.loadAttendance();
      }
      else
      {
        this.attendances=this.attendances;
      }
    }
    else
    {
      this.loadAttendance();
    }
  }


  loadAttendance()
  {
    this.component.showLoader('Getting Attendance');
    this.attendanceService.getSiteAttendances(this.empDetail.id).subscribe(response=>{
        if(response.errorStatus){
            this.component.closeAll();
            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
        }else{
            console.log("Loader Attendance");
            console.log(response);
            this.attendances = response;
            this.component.closeLoader();
        }
    })
  }

  getAllJobs(){
    this.component.showLoader('Getting All Jobs');
    var search={empId:this.empDetail.id};
    this.jobService.getJobs(search).subscribe(response=>{
        if(response.errorStatus){
            this.component.closeAll();
            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
        }else{
            console.log("All jobs of current user");
            console.log(response);
            this.jobs = response;
            this.component.closeLoader();
        }
    })
  }



/* Quotation*/

  gotoApprovedQuotation(){
    this.navCtrl.push(ApprovedQuotationPage,{'quotations':this.approvedQuotations});
  }

  gotoArchivedQuotation(){
    this.navCtrl.push(ArchivedQuotationPage,{'quotations':this.archivedQuotations});
  }

  gotoSubmittedQuotation(){
    this.navCtrl.push(SubmittedQuotationPage,{'quotations':this.submittedQuotations});
  }
  gotoDraftedQuotation(){
    this.navCtrl.push(DraftedQuotationPage,{'quotations':this.draftedQuotations});
  }

  getQuotations(){
      var searchCriteria={
        currPage:this.page,
          pageSort:this.pageSort
      };
    this.quotationService.getQuotations(searchCriteria).subscribe(
        response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
                console.log(response);

                this.quotations=[];
                this.quotations = response;
                console.log(this.quotations)
                for(var i=0; i<this.quotations.length;i++){
                    if(this.quotations[i].isDrafted == true){
                        console.log("drafted");
                        console.log(this.quotations[i].isDrafted)
                        this.draftedQuotationsCount++;
                        this.draftedQuotations.push(this.quotations[i]);
                    }else if(this.quotations[i].isArchived == true){
                        console.log("archived");
                        console.log(this.quotations[i].isArchived)
                        this.archivedQuotations.push(this.quotations[i]);
                        this.archivedQuotationsCount++;
                    }else if(this.quotations[i].isApproved == true){
                        console.log("approved");
                        console.log(this.quotations[i].isApproved)
                        this.approvedQuotations.push(this.quotations[i]);
                        this.approvedQuotationsCount++;
                    }else if(this.quotations[i].isSubmitted == true){
                        console.log("submitted");
                        console.log(this.quotations[i].isSubmitted)
                        this.submittedQuotations.push(this.quotations[i]);
                        this.submittedQuotationsCount++;
                    }else{
                        console.log("all false");
                        console.log(this.quotations[i].isDrafted)
                    }
                }
            }

        }
    )
  }


  createQuotation(){
    this.navCtrl.push(CreateQuotationPage);
  }


  open(itemSlide: ItemSliding, item: Item,c)
  {
    this.count=c;
    if(c==1)
    {
      this.count=0;
      console.log('------------:'+this.count);
      this.close(itemSlide);
    }
    else
    {
      this.count=1;
      console.log('------------:'+this.count);
      itemSlide.setElementClass("active-sliding", true);
      itemSlide.setElementClass("active-slide", true);
      itemSlide.setElementClass("active-options-right", true);
      item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
    }

  }
  close(item: ItemSliding) {
    item.close();
    item.setElementClass("active-sliding", false);
    item.setElementClass("active-slide", false);
    item.setElementClass("active-options-right", false);
  }

  viewJob(job)
  {
    console.log("========view job ===========");
    console.log(job);
    this.navCtrl.push(ViewJobPage,{job:job})
  }

  compeleteJob(job)
  {
    this.navCtrl.push(CompleteJobPage,{job:job})
  }
}
