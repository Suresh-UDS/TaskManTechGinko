import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {
    ActionSheetController, Events, Item, ItemSliding, LoadingController, ModalController,
    NavController, Platform
} from 'ionic-angular';
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
import {CompleteJobPage} from "../jobs/completeJob";
import {ViewJobPage} from "../jobs/view-job";
import {LoginPage} from "../login/login";
declare var demo;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'

})
export class DashboardPage {
  @ViewChild('date') MyCalendar: ElementRef;
  todaysJobs: any;
  allJobs:any;
  selectedSite:any;
  selectedEmployee:any;
  categories:any;
  loader:any;
  dateView:any;
  employee:any;
  sites:any;
  spinner=true;
  empSpinner=false;
  searchCriteria:any;
  index:any;
  all="all";
    ref:any;
    firstLetter:any;
    selectDate:any;
    selectSite=false;
    empSelect:any;
    empIndex:any;
    empActive=false;
    count=0;
    overdueCount:any;
    upcomingCount:any;
    completeCount:any;
    userType:any;
    openMore:any;
    closeMore:any;
    rateCard:any;
    addJob:any;
    addQuotation:any;
    platform:any;
    addEmployee:any;
    slideIndex:any;

  constructor(public renderer: Renderer,public plt: Platform,public myService:authService,private loadingCtrl:LoadingController,public navCtrl: NavController,public component:componentService,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider, private siteService:SiteService, private employeeService: EmployeeService, private jobService:JobService, public events:Events, private actionSheetCtrl:ActionSheetController) {


      this.rateCard=CreateQuotationPage;
      this.addJob=CreateJobPage;
      this.addQuotation=CreateQuotationPage;
      this.addEmployee=CreateEmployeePage

    this.categories='overdue';
    this.selectDate=new Date();
    this.searchCriteria={};
   /* this.categories = [
      'overdue','upcoming','completed'
      ];
      */

   this.events.subscribe('userType',(userType)=>{
       console.log("user type in dashboard");
       console.log(userType);
       this.userType = userType;
   });
   console.log("User Role in dashboard");
   console.log(window.localStorage.getItem('userRole'));
      this.userType=window.localStorage.getItem('userRole')
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

      if (this.plt.is('android')) {
          this.platform="android"
          console.log("=====Platform=====:"+this.platform);
      }
      else if (this.plt.is('ios')) {
          this.platform="ios"
          console.log("=====Platform=====:"+this.platform);
      }


      this.events.subscribe('userType',(userType)=>{
          console.log("user type in dashboard");
          console.log(userType);
          this.userType = userType;
      })
   // demo.initFullCalendar();
   //  this.siteService.searchSite().subscribe(response=>
   //  {
   //    console.log(response);
   //  },
   //  error=>
   //  {
   //    console.log(error);
   //  });


    // this.employeeService.getAllEmployees().subscribe(
    //     response=>{
    //       console.log('ionViewDidLoad Employee list:');
    //       console.log(response);
    //       this.employee=response;
    //       this.empSpinner=false;
    //       this.component.closeLoader();
    //     },
    //     error=>{
    //       console.log('ionViewDidLoad SitePage:'+error);
    //         this.component.closeLoader();
    //     }
    // )

    this.siteService.searchSite().subscribe(
        response=>{
          console.log('ionViewDidLoad SitePage:');
          console.log(response.json()
          );
          this.sites=response.json();
          this.spinner=false;
          // this.empSpinner=true;
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

  ionViewWillEnter(){

  }

  searchJobs(searchCriteria){
      if(this.selectedEmployee){
          console.log("employee selected");
          searchCriteria.employeeId = this.selectedEmployee.id;
      }
      if(this.selectedSite){
          console.log("site selected");
          searchCriteria.siteId = this.selectedSite;
      }
      if(this.selectDate){
          searchCriteria.checkInDateTimeFrom = this.selectDate;
      }
      searchCriteria.CheckInDateTimeFrom = new Date(searchCriteria.checkInDateTimeFrom);
      this.jobService.getJobs(searchCriteria).subscribe(
          response=>{
              console.log("Jobs from search criteria");
              console.log(response);
              this.allJobs = response.transactions;
              this.component.closeLoader();
              console.log("====Jobs=====:");
              console.log(this.allJobs);
              this.overdueCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='OVERDUE')
                  {
                      return data;
                  }

              }).length

              console.log("Count------:"+this.overdueCount);

              this.completeCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='COMPLETED')
                  {
                      return data;
                  }
              }).length

              console.log("Count------:"+this.completeCount);

              this.upcomingCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='OPEN' || data.status=='ASSIGNED' || data.status=='INPROGRESS')
                  {
                      return data;
                  }
              }).length

              console.log("Count------:"+this.upcomingCount);


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




    showCalendar() {
        const dateSelected =
            this.datePickerProvider.showCalendar(this.modalCtrl);

        dateSelected.subscribe(date =>
        {
            this.selectDate=date;
            console.log("Date selected");
            console.log(date);

            this.searchCriteria.checkInDateTimeFrom = date;
            // this.getAllJobs(this.selectDate)
            this.searchJobs(this.searchCriteria);
            console.log("first date picker: date selected is", date);
        });

    }

    selectEmployee(emp,i){
      console.log("Selected Employee");
      console.log(emp.id+" "+ emp.name);

      this.searchCriteria={
          employeeId:emp.id,
          CheckInDateTimeFrom:this.selectDate,
      };
      this.searchJobs(this.searchCriteria);
      this.empActive=true;
      this.empIndex=i;
    }

    activeSite(id,i)
    {
         var search={siteId:id};
         this.selectedSite = id;
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


    doRefresh(refresher,segment)
    {
        this.ref=true;
        if(segment=="all")
        {
            this.getJobs(this.ref);
            refresher.complete();
        }

    }


    getJobs(ref)
    {
        if(this.allJobs)
        {
            if(ref)
            {
                this.searchJobs(this.searchCriteria);
            }
            else
            {
                this.allJobs=this.allJobs;
            }
        }
        else
        {
            this.searchJobs(this.searchCriteria);
        }
    }


    // Slide
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
        this.count=0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    }

    compeleteJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    viewJob(job)
    {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(ViewJobPage,{job:job})
    }

    presentActionSheet(){
        let actionSheet = this.actionSheetCtrl.create({
            title:'Add',
            buttons:[
                {
                    text:'Quotation',
                    handler:()=>{
                        console.log("Quotation sheet Controller");
                        this.navCtrl.push(CreateQuotationPage);

                    }
                },
                {
                    text:'Job',
                    handler:()=>{
                    this.navCtrl.push(CreateJobPage);
                }
                },

                {
                    text:'Employee',
                    handler:()=>{
                        console.log('Complete job');
                    this.navCtrl.push(CreateEmployeePage);

                }
                },

                {
                    text:'Cancel',
                    role:'cancel',
                    handler:()=>{
                        console.log("Cancel clicker");
                    }
                }
            ]
        });

        actionSheet.present();
    }


}
