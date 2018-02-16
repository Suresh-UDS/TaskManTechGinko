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
    firstLetter:any;
    selectDate:any;
    selectSite:any;
  constructor(public renderer: Renderer,public myService:authService,private loadingCtrl:LoadingController,public navCtrl: NavController,public component:componentService,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider, private siteService:SiteService, private employeeService: EmployeeService, private jobService:JobService) {

    this.categories='overdue';
    this.selectDate=new Date();
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
    })


    this.employeeService.getAllEmployees().subscribe(
        response=>{
          console.log('ionViewDidLoad Employee list:');
          console.log(response);
          this.employee=response;
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
        }
    )

    this.siteService.searchSite().subscribe(
        response=>{
          console.log('ionViewDidLoad SitePage:');

          console.log(response.json()
          );
          this.sites=response.json();
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
        }
    )


    //this.getAllJobs()



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
            this.selectDate=date;
            this.getAllJobs(this.selectDate)
            console.log("first date picker: date selected is", date)
        });

    }

    activeSite(id)
    {
        var search={siteId:id};
        console.log("Selected Site Id");
        console.log(id);
        this.selectSite=true;
        this.siteService.searchSiteEmployee(id).subscribe(
            response=> {
                console.log(response.json());
                if(response.json().length !==0)
                {
                    this.employee=response.json();
                    console.log(this.employee);
                }
                else
                {
                    this.employee=[]
                }
            },
            error=>{
                console.log(error);
                console.log(this.employee);
            })
    }

}
