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
  emp: any;
  employeeActive: any;
  empIndex: any;
  siteActive: any;
  site: any;
  index: any;
  projectindex: any;
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

    projectActive:any;
    siteSpinner =false;
    chooseClient = true;
    showSites = false;

  empSpinner=false;
  chooseSite=true;
  showEmployees=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public siteService:SiteService,public component:componentService,
              public employeeService:EmployeeService,public datePicker:DatePicker) {
    this.siteList=[];
    this.employee=[];
    this.empPlace='Employee';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketFilter');
      this.component.showLoader('Getting Project');
      this.siteService.getAllProjects().subscribe(
          response=>{
              console.log("====project======");
              console.log(response);
              this.clientList=response;
              this.selectedProject = this.clientList[0];
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

  dismiss(){
<<<<<<< HEAD
      this.viewCtrl.dismiss({project:this.selectedProject,site:this.selectedSite});
=======
      // let data={'foo':'bar'};
      this.viewCtrl.dismiss();
>>>>>>> Release-2.0-Inventory
  }
  selectSite(project,i){

      this.projectActive = true;
      this.projectindex=i;
      this.siteSpinner =true;
      this.chooseClient = false;
      this.showSites = false;

      this.selectedProject=project;
      this.scrollSite=true;
      console.log("projectID",project);
      this.siteService.findSitesByProject(project.id).subscribe(
          response=>{
              console.log("site by project id");
              console.log(response);
              this.siteList=response;
              this.siteSpinner= false;
            this.showSites = true;
            this.showEmployees=false;
            this.chooseSite = true;
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

    highLightSite(site,i){
    /*  console.log('Selected Site in ticket-filter');
      console.log(site);
      this.activeSite=index;
      this.selectedSite=site;
        this.getEmployee(site.id);*/

      if(site)
      {
        console.log('ionViewDidLoad Add jobs employee');
        // window.localStorage.setItem('site',site);
        // console.log(this.empSelect);
        this.index = i;
        this.projectActive = true;
        this.siteActive = true;
        // this.siteName = site.name;
        this.site = site;
        this.empSpinner=true;
        this.chooseSite=false;
        this.showEmployees=false;
        var search={
          currPage:1,
          siteId:this.site.id
        }
        this.employeeService.searchEmployees(search).subscribe(
          response=> {
            console.log("employeeRespons",response);
            this.empSpinner=false;
            this.showEmployees=true;
            if(response.transactions!==0)
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

  activeEmployee(emp,i)
  {
    this.empIndex = i;
    this.employeeActive = true;
    this.emp = emp;
    console.log( this.emp);
  }

    getEmployee(id)
    {

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
                    console.log('view button true');
                    this.viewButton=true;
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




}
