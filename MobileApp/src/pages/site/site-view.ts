import { Component } from '@angular/core';
import {Events, Item, ItemSliding, NavController, NavParams, ToastController} from 'ionic-angular';
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
import {SiteService} from "../service/siteService";
import {ViewJobPage} from "../jobs/view-job";
import {CompleteJobPage} from "../jobs/completeJob";

declare var demo;

@Component({
  selector: 'page-site-view',
  templateUrl: 'site-view.html'
})
export class SiteViewPage {

  siteName:any;
  siteId: any;
  siteDetail:any;
  categories:any;
  jobs:any;
  employee:any;
  ref=false;
  job="job";
  employ="employee";
  firstLetter:any;
  quotations:any;
  count=0;
  msg:any;
  approvedQuotations:any;
  submittedQuotations:any;
  draftedQuotations:any;
  archivedQuotations:any;
  approvedQuotationsCount:any;
  submittedQuotationsCount:any;
  draftedQuotationsCount:any;
  archivedQuotationsCount:any;isAdmin:any;
  approvedQuotationpage:ApprovedQuotationPage;
  archivedQuotationPage:ArchivedQuotationPage;
  draftedQuotationsPage:DraftedQuotationPage;
  submittedQuotationsPage:SubmittedQuotationPage;
  userType:any;

    jobPage:1;
    jobsTotalPages:0;
    employeePage=1;
    employeeTotalpages=0;
    page:1;
    pageSort:15;

  constructor(public navCtrl: NavController,public component:componentService,private employeeService: EmployeeService,public navParams:NavParams,private siteService: SiteService,public myService:authService,public authService:authService, public toastCtrl: ToastController,

              private jobService:JobService, private attendanceService: AttendanceService, private quotationService: QuotationService, public events:Events) {
  this.categories='detail';
    this.siteDetail=this.navParams.get('site')
    console.log('ionViewDidLoad SiteViewPage');
    console.log(this.siteDetail.name);
    this.siteId = this.siteDetail.id;
    this.isAdmin = true;
    this.draftedQuotationsCount= 0;
    this.approvedQuotationsCount=0;
    this.submittedQuotationsCount=0;
    this.archivedQuotationsCount=0;
    this.getQuotations();
    this.draftedQuotations=[];
    this.approvedQuotations=[];
    this.submittedQuotations=[];
    this.archivedQuotations=[];
    this.loadEmployee();

      this.events.subscribe('userType',(type)=>{
          console.log("User type event");
          console.log(type);
          this.userType = type;
      })
  }

  ionViewDidLoad()
  {
  }


    showToast(message: string) {
      this.component.showToastMessage(message,'bottom');
    }

  doRefresh(refresher,segment)
  {
    this.ref=true;
    if(segment=="job")
    {
      this.getJobs(this.ref);
      refresher.complete();
    }
    else if(segment=="employee")
    {
      console.log("------------- segment Employee");
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
      this.jobs = response.transactions;
      this.component.closeLoader();
    },
        error=>{
            console.log(error);
            this.component.closeLoader();
            if(error.type==3)
            {
                this.msg='Server Unreachable'
            }

            this.component.showToastMessage(this.msg,'bottom');
        }
    )
  }

    doJobInfinite(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.jobsTotalPages);
        console.log(this.jobPage);
        var searchCriteria ={
            currPage:this.jobPage+1,
            siteId:this.siteDetail.id
        };
        if(this.jobPage>this.jobsTotalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('All jobs Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.jobsTotalPages);
            console.log(this.jobPage);
            setTimeout(()=>{
                this.jobService.getJobs(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad Employee list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.jobs.push(response.transactions[i]);
                        }
                        this.jobPage = response.currPage;
                        this.jobsTotalPages = response.totalPages;
                        this.component.closeLoader();
                    },
                    error=>{
                        console.log('ionViewDidLoad Employee Page:'+error);
                        this.component.closeLoader();
                        if(error.type==3)
                        {
                            this.msg='Server Unreachable'
                        }

                        this.component.showToastMessage(this.msg,'bottom');
                    }
                )
                infiniteScroll.complete();
            },1000);
        }


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

    this.siteService.searchSiteEmployee(this.siteDetail.id).subscribe(
        response=> {
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
            }else{
                console.log(response);
                if(response.length !==0)
                {
                    this.employee=response;
                    console.log("total Employees");
                    console.log(this.employee.length);
                    console.log(this.employee);
                    if(this.employee.length>1){
                        this.isAdmin = true;
                    }else{
                        this.isAdmin = false;
                    }
                    this.component.closeLoader();
                }
                else
                {
                    this.employee=[]
                    this.component.closeLoader();

                }
            }

        },
        error=>{
          console.log(error);
            this.component.closeLoader();
            if(error.type==3)
            {
                this.msg='Server Unreachable'
            }

            this.component.showToastMessage(this.msg,'bottom');
          console.log(this.employee);
        })
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
<<<<<<< HEAD
      var searchCriteria={
          currPage:this.page,
          pageSort:this.pageSort,
      };
    this.quotationService.getQuotations(searchCriteria).subscribe(
=======
    console.log("Quotation SiteId",this.siteId);
    this.quotationService.searchQuotations( {siteId: this.siteId}).subscribe(
>>>>>>> Release-2.0-Inventory
        response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
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
