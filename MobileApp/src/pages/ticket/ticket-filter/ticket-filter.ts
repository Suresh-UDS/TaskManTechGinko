import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import{SiteService} from "../../service/siteService";
import{componentService} from "../../service/componentService";
import{EmployeeService} from "../../service/employeeService";
import { DatePicker } from '@ionic-native/date-picker';

declare var demo;

/**
 * Generated class for the TicketFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticket-filter',
  templateUrl: 'ticket-filter.html',
})
export class TicketFilter {
    selectedProject:any;
    scrollSite:any;
    siteList:any;
    msg:any;
    activeSite:any;
    selectedSite:any;
    empSelect:any ;
    empPlace:any;
    employee:any;
    fromDate:any;
    toDate:any;
    viewButton:any;
    clientList:any;
    chooseClient = true;
    projectActive: any;
    siteSpinner = false;
    showSites = false;
    projectindex: any;
    chooseSite = true;
    empSpinner=false;
    showEmployees=false;
    emp: any;
    employeeActive: boolean;
    empIndex: any;
    index: any;
    siteActive: any;
    site: any;
    searchCriteria:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public siteService:SiteService,public component:componentService,
              public employeeService:EmployeeService,public datePicker:DatePicker, public cs: componentService) {
      this.empPlace='Employee';
      this.fromDate = new Date();
      this.toDate = new Date();
      this.viewButton = true;

      this.searchCriteria = {
        projectId:null,
        siteId:null,
        employeeId:null,
        checkInDateTimeFrom:new Date(),
        checkInDateTimeTo: new Date(),

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketFilter');
      this.component.showLoader('Getting Project');
      this.siteService.getAllProjects().subscribe(
          response=>{
              console.log("====project======");
              console.log(response);
              this.clientList=response;
              // this.selectedProject = this.clientList[0];
              // this.selectSite(this.selectedProject);
              console.log('select default value:');
              this.component.closeLoader();
          },
          error=>{
              if(error.type==3)
              {
                  this.msg='Server Unreachable'
              }
              this.component.showToastMessage(this.msg,'bottom');
              this.component.closeLoader();
          }
      )

  }


  selectSite(project,i){
    this.projectActive=true;
    this.projectindex = i;
    this.siteSpinner= true;
    this.chooseClient= false;
    this.showSites = false;
    this.selectedProject = project;
    this.scrollSite = true;
    this.showEmployees = false;
      this.scrollSite=true;
      this.siteService.findSitesByProject(project.id).subscribe(
          response=>{
            this.siteSpinner=false;
            this.showSites = true;
            this.chooseSite = true;
            console.log("====Site By ProjectId======");
            console.log(response);
            this.siteList=response;
            console.log(this.siteList);
          },
          error=>{
              if(error.type==3){
                  this.msg='server unreachable';
              }
              this.component.showToastMessage(this.msg,'bottom');
          }
      )
  }

    highLightSite(index,site){
      console.log('Selected Site in ticket-filter');
      console.log(site);
      this.activeSite=index;
      this.selectedSite=site;
      if(site)
      {
        this.index = index;
        this.projectActive = true;
        this.siteActive = true;
        // this.siteName = site.name;
        this.site = site;
        this.empSpinner=true;
        this.chooseSite=false;
        this.showEmployees=false;

        console.log('ionViewDidLoad Add jobs employee');

        window.localStorage.setItem('site',this.site.id);
        console.log(this.empSelect);
        var search={
          currPage:1,
          siteId:this.site.id
        };
        this.employeeService.searchEmployees(search).subscribe(
          response=> {
            this.empSpinner=false;
            this.showEmployees=true;
            console.log(response);
            if(response.transactions!==0)
            {
              this.empSelect=false;
              this.empPlace="Employee";
              this.employee=response.transactions;
              console.log(this.employee);
            }
            else
            {
              this.empSelect=true;
              this.empPlace="No Employee";
              this.employee=[]
            }
          },
          error=>{
            console.log(error);
            console.log(this.employee);
          })

      }
      else
      {
        this.employee=[];
      }
  }

  activeEmployee(emp,i)
  {
    this.empIndex = i;
    this.employeeActive = true;
    this.emp = emp;
    console.log( this.emp);
  }

    getEmployee(id)
    {
        if(id)
        {
            console.log('ionViewDidLoad Add jobs employee');

            window.localStorage.setItem('site',id);
            console.log(this.empSelect);
            var search={
                currPage:1,
                siteId:id
            }
            this.employeeService.searchEmployees(search).subscribe(
                response=> {
                    console.log(response);
                    if(response.transactions!==null)
                    {
                        this.empSelect=false;
                        this.empPlace="Employee"
                        this.employee=response.transactions;
                        console.log(this.employee);
                    }
                    else
                    {
                        this.empSelect=true;
                        this.empPlace="No Employee"
                        this.employee=[]
                    }
                },
                error=>{
                    console.log(error);
                    console.log(this.employee);
                })

        }
        else
        {
            this.employee=[];
        }
    }

    selectFromDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
            allowFutureDates:false
        }).then(
            date => {
                this.fromDate=date;
                console.log('Got date: ', date);
                console.log(this.fromDate);
                if(this.fromDate && this.toDate)
                {
                    if(this.fromDate<this.toDate){
                        console.log('view button true');
                        this.viewButton=true;
                    }else{
                        this.viewButton = false;
                        demo.showSwal('warning-message-and-confirmation-ok','From date cannot be greater than To date');
                    }
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }
    selectToDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
            allowFutureDates:false
        }).then(
            date => {
                this.toDate=date;
                console.log('Got date: ', date);
                if(this.fromDate && this.toDate)
                {
                    if(this.fromDate<this.toDate){
                        console.log('view button true');
                        this.viewButton=true;
                    }else{
                        this.viewButton = false;
                        demo.showSwal('warning-message-and-confirmation-ok','From date cannot be greater than To date');
                    }
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }

    dateSearch(fromDate,toDate) {
        // this.componentService.showLoader("")
        console.log("From Date:" + fromDate);
        console.log("To Date:" + toDate);

    }

    dismissFilter(){
        this.viewCtrl.dismiss();
    }

  dismiss(){
    console.log("searchCriteria" );
        console.log(this.selectedSite);
        console.log(this.selectedProject);
        console.log(this.emp);
        console.log(this.fromDate);
        console.log(this.toDate);
        if(this.selectedProject && this.selectedProject.id>0){
            this.searchCriteria.projectId = this.selectedProject.id;
        }
        if(this.selectedSite && this.selectedSite.id>0){
            this.searchCriteria.siteId = this.selectedSite.id;
        }
        if(this.emp && this.emp.id>0){
            this.searchCriteria.employeeId = this.emp.id;
        }

        console.log("SEarch criteria");
        console.log(this.searchCriteria);
        this.searchCriteria.checkInDateTimeFrom = this.fromDate;
        this.searchCriteria.checkInDateTimeTo = this.toDate;
        this.viewCtrl.dismiss(this.searchCriteria);
  }




}
