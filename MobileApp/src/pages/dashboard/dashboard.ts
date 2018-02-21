import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {DatePickerProvider} from "ionic2-date-picker";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {EmployeeService} from "../service/employeeService";
import {JobService} from "../service/jobService";
import {CreateRateCardPage} from "../rate-card/create-rate-card";
import {CreateJobPage} from "../jobs/add-job";
import {CreateQuotationPage} from "../quotation/create-quotation";
import {CreateEmployeePage} from "../employee-list/create-employee";
declare var demo;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'

})
export class DashboardPage {
  @ViewChild('date') MyCalendar: ElementRef;
  todaysJobs: any;
  allJobs:any;
  categories:any;
  loader:any;
  dateView:any;
  employee:any;
  sites:any;
  spinner=true;
  empSpinner=false;
  searchCriteria:any;
  index:any;
    firstLetter:any;
    selectDate:any;
    selectSite=false;
    empSelect:any;
    empIndex:any;
    empActive=false;
  constructor(public renderer: Renderer,public myService:authService,private loadingCtrl:LoadingController,public navCtrl: NavController,public component:componentService,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider, private siteService:SiteService, private employeeService: EmployeeService, private jobService:JobService) {

    this.categories='overdue';
    this.selectDate=new Date();
    this.searchCriteria={};
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
  ionViewDidLoad()
  {
   // demo.initFullCalendar();
    this.siteService.searchSite().subscribe(response=>
    {
      console.log(response);
    },
    error=>
    {
      console.log(error);
    });


    this.employeeService.getAllEmployees().subscribe(
        response=>{
          console.log('ionViewDidLoad Employee list:');
          console.log(response);
          this.employee=response;
          this.empSpinner=false;
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
            this.component.closeLoader();
        }
    )

    this.siteService.searchSite().subscribe(
        response=>{
          console.log('ionViewDidLoad SitePage:');
          console.log(response.json()
          );
          this.sites=response.json();
          this.spinner=false;
          this.empSpinner=true;
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
            this.component.closeLoader();

        }
    );
    this.searchCriteria={
        checkInDateTimeFrom:new Date()
    }
      this.searchJobs(this.searchCriteria);

  }

  searchJobs(searchCriteria){
      this.component.showLoader('Getting Jobs');
      searchCriteria.CheckInDateTimeFrom = new Date(searchCriteria.checkInDateTimeFrom);
      this.jobService.getJobs(searchCriteria).subscribe(
          response=>{
              console.log("Jobs from search criteria");
              console.log(response);
              this.allJobs = response;
              this.component.closeLoader();
          },err=>{
              console.log("Error in getting josb");
              this.component.closeLoader();
          }
      )
  }


  getAllJobs(sDate){
    this.component.showLoader('Getting All Jobs');
    console.log("selected date");
    console.log(sDate);
    var currDate = new Date(sDate);
    var search={checkInDateTimeFrom:currDate};
    this.jobService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.allJobs = response;
      this.component.closeLoader();
    })
  }

    first(emp)
    {
        this.firstLetter=emp.charAt(0);
    }


    fabClick(fab)
    {
        if(fab=='ratecard')
        {
            this.navCtrl.push(CreateRateCardPage);
        }
        else if(fab=='job')
        {
            this.navCtrl.push(CreateJobPage);
        }
        else if(fab=='quotation')
        {
            this.navCtrl.push(CreateQuotationPage);
        }
        else if(fab=='employee')
        {
            this.navCtrl.push(CreateEmployeePage);
        }
    }

    showCalendar() {
        const dateSelected =
            this.datePickerProvider.showCalendar(this.modalCtrl);

        dateSelected.subscribe(date =>
        {
            // this.selectDate=date;
            this.searchCriteria.checkInDateTimeFrom = date;
            // this.getAllJobs(this.selectDate)
            this.searchJobs(this.searchCriteria);
            console.log("first date picker: date selected is", date)
        });

    }

    selectEmployee(emp,i){
      console.log("Selected Employee");
      console.log(emp.id+" "+ emp.name);
      this.searchCriteria={
          employeeId:emp.id
      };
      this.searchJobs(this.searchCriteria);
      this.empActive=true;
      this.empIndex=i;
    }

    activeSite(id,i)
    {
        // var search={siteId:id};
        this.index=i;
        console.log("Selected Site Id");
        console.log(id);
        this.selectSite=true;
        this.searchCriteria={
            siteId:id
        };
        this.searchJobs(this.searchCriteria);
        this.empSpinner=true;
        this.siteService.searchSiteEmployee(id).subscribe(
            response=> {
                console.log(response.json());
                if(response.json().length !==0)
                {
                    this.employee=response.json();
                    this.empSpinner=false;
                    this.empSelect=false;
                    this.selectSite=true;
                    console.log("Spinner:"+this.empSpinner);
                    console.log(this.employee);
                }
                else
                {
                    this.empSelect=true;
                    this.empSpinner=false;
                    this.employee=[]
                }
            },
            error=>{
                console.log(error);
                console.log(this.employee);
            })
    }

}
