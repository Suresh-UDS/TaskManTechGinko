import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import{SiteService} from "../../service/siteService";
import{componentService} from "../../service/componentService";
import{EmployeeService} from "../../service/employeeService";
import { DatePicker } from '@ionic-native/date-picker';


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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public siteService:SiteService,public component:componentService,
              public employeeService:EmployeeService,public datePicker:DatePicker, public cs: componentService) {
      this.empPlace='Employee';
      this.fromDate = new Date();
      this.toDate = new Date();
      this.viewButton = true;
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
            allowFutureDates:false,
        }).then(
            date => {
                this.fromDate=date;
                console.log('Got date: ', date);

                if(this.fromDate && this.toDate)
                {
                   if(this.fromDate<this.toDate){
                       console.log('view button true');
                       this.viewButton=true;
                   }else{
                        this.cs.showToastMessage("From date has to be greater than to date",'bottom');
                        this.viewButton = false;

                   }
                }else{
                    console.log("From date and to date not available");
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
            allowFutureDates:false,
        }).then(
            date => {
                this.toDate=date;
                console.log('Got date: ', date);

                if(this.fromDate){
                    if(this.toDate){
                        if(this.fromDate<this.toDate){
                            console.log('view button true');
                            this.viewButton=true;
                        }else{
                            console.log("from date is greater than to date");
                            this.cs.showToastMessage("From date has to be greater than to date",'bottom');
                            this.viewButton = false;

                        }
                    }

                }else{
                    this.cs.showToastMessage("Please select from date first!!!",'bottom');
                }
                if(this.fromDate && this.toDate)
                {
                    console.log('view button true');
                    this.viewButton=true;
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
    this.viewCtrl.dismiss({project:this.selectedProject,site:this.selectedSite,fromDate:this.fromDate,toDate:this.toDate});
  }




}
