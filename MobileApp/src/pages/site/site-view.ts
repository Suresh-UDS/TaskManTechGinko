import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {EmployeeService} from "../service/employeeService";
import {SubmittedQuotationPage} from "../quotation/submittedQuotations";
import {DraftedQuotationPage} from "../quotation/draftedQuotations";
import {ArchivedQuotationPage} from "../quotation/archivedQuotations";
import {ApprovedQuotationPage} from "../quotation/approvedQuotations";
import {CreateQuotationPage} from "../quotation/create-quotation";
import {QuotationService} from "../service/quotationService";

@Component({
  selector: 'page-site-view',
  templateUrl: 'site-view.html'
})
export class SiteViewPage {

  siteName:any;
  siteDetail:any;
  categories:any;
  jobs:any;
  employee:any;
  ref=false;
  job="job";
  employ="employee";
  firstLetter:any;
  quotations:any;
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
  constructor(public navCtrl: NavController,public component:componentService,private employeeService: EmployeeService,public navParams:NavParams,public myService:authService,public authService:authService, public toastCtrl: ToastController,

              private jobService:JobService, private attendanceService: AttendanceService, private quotationService: QuotationService) {
  this.categories='detail';
    this.siteDetail=this.navParams.get('site')
    console.log('ionViewDidLoad SiteViewPage');
    console.log(this.siteDetail.name);

    this.draftedQuotationsCount= 0;
    this.approvedQuotationsCount=0;
    this.submittedQuotationsCount=0;
    this.archivedQuotationsCount=0;
    this.getQuotations();
    this.draftedQuotations=[];
    this.approvedQuotations=[];
    this.submittedQuotations=[];
    this.archivedQuotations=[];
  }

  ionViewDidLoad()
  {
  }


    showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });

        toast.present(toast);
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
      this.getEmployee(this.ref);
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
    var search={siteId:this.siteDetail.id};
    this.jobService.getJobs(search).subscribe(response=>{
      console.log("Job Refresher");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }

  getEmployee(ref)
  {
    if(this.employee)
    {
      if(ref)
      {
        console.log("------------- segment employee ref true");
        this.loadEmployee();
      }
      else
      {
        this.employee=this.employee;
      }
    }
    else
    {
      this.loadEmployee();
    }
  }


  loadEmployee()
  {
    this.component.showLoader('Getting Attendance');
    // var search={siteId:this.siteDetail.id};
    //TODO
    //Add Search criteria to attendance

    this.employeeService.getAllEmployees().subscribe(
        response=>{
          console.log('Loader Employee');
          console.log(response);
          this.employee=response;
          this.component.closeLoader();
        },
        error=>{
          console.log(error);
        }
    )

  }
  first(emp)
  {
    this.firstLetter=emp.charAt(0);
  }


  /* Quotation */
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
    this.quotationService.getQuotations(window.localStorage.getItem('employeeId')).subscribe(
        response=>{
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
    )
  }


  createQuotation(){
    this.navCtrl.push(CreateQuotationPage);
  }

}
