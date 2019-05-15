import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import{componentService} from "../../service/componentService";
import{AssetService} from "../../service/assetService";
import{SiteService} from "../../service/siteService";
import{JobService} from "../../service/jobService";
import{EmployeeService} from "../../service/employeeService";
import { DatePicker } from '@ionic-native/date-picker';

declare var demo;

/**
 * Generated class for the AssetFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-job-filter',
    templateUrl: 'job-filter.html',
})
export class JobFilter{
  emp: any;
  employeeActive: boolean;
  empIndex: any;
  index: any;
  siteActive: any;
  site: any;


  clientList:any;
    siteList:any;
    assetGroup:any;
    selectedProject:any;
    selectedSite:any;
    msg:any;
    scrollSite:any;
    activeSite:any;
    selectedAssetGroup:any;
    searchCriteria:any;
    empSelect:any;
    employee:any;
    employ:any;
    eMsg:any;
    empPlace:any;


    fromDate:any;
    toDate:any;
    viewButton:any;

    page:1;
    totalPages:0;
    pageSort:15;
    count=0;
  chooseClient = true;
  projectActive: any;
  siteSpinner = false;
  showSites = false;
  projectindex: any;
  chooseSite = true;
  empSpinner=false;
  showEmployees=false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public component:componentService,
                public siteService:SiteService, public assetService:AssetService,private jobService:JobService,private employeeService:EmployeeService,
                private   datePicker:DatePicker) {
        this.assetGroup = [
            {name:"CMRL"},
            {name:"UDS House Keeping Assets"},
            {name:"UDS Electrical Assets"},
            {name:"UDS Plumbing Assets"}
        ];
        this.empPlace='Employee';

        this.emp = null;
        this.selectedSite = null;
        this.selectedProject = null;
        this.fromDate = new Date();
        this.toDate = new Date();

        this.searchCriteria = {
            projectId:null,
            siteId:null,
            employeeId:null,
            checkInDateTimeFrom:new Date(),
            checkInDateTimeTo: new Date()

        }

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AssetFilter');
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
                    this.msg='Server Unreachable';
                }
                this.component.showToastMessage(this.msg,'bottom');
                this.component.closeLoader();
            }
        )

      /*this.fromDate = new Date();
        this.toDate = new Date();
        console.log("current date",this.fromDate);*/

    }

    selectSite(project,i)
    {
      this.projectActive=true;
      this.projectindex = i;
      this.siteSpinner= true;
      this.chooseClient= false;
      this.showSites = false;
        this.selectedProject = project;
        this.scrollSite = true;
        this.showEmployees = false;
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
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }
                this.component.showToastMessage(this.msg,'bottom');
            }
        )
    }

    highLightSite(i,site){
        console.log("Selected Site");
        console.log(site);
        this.activeSite= i;
        this.selectedSite = site;
      if(site)
      {
        this.index = i;
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

    dismiss(){
        let data={'foo':'bar'};
        this.viewCtrl.dismiss(data);
    }

    filterAssets(){
        this.searchCriteria = {
            siteId:this.selectedSite.id,
            projectId:this.selectedProject.id,
        };
        this.viewCtrl.dismiss(this.searchCriteria);
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

    getEmployee(id)
    {

    }

    filter(){
        this.viewCtrl.dismiss();
    }

    filterJob(){
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


/**
 * Generated class for the JobFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
