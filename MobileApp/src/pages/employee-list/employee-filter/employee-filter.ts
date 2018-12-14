import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import{SiteService} from "../../service/siteService";
import{componentService} from "../../service/componentService";
import{EmployeeService} from "../../service/employeeService";
import { DatePicker } from '@ionic-native/date-picker';


/**
 * Generated class for the EmployeeFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-filter',
  templateUrl: 'employee-filter.html',
})
export class EmployeeFilter {
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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public siteService:SiteService,public component:componentService,
            public  employeeService:EmployeeService,public datePicker:DatePicker) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeFilter');
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

    dismiss()
    {
      this.viewCtrl.dismiss();
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
                this.component.closeLoader();
                console.log("====Site By ProjectId======");
                console.log(response);
                this.siteList=response;
                console.log(this.siteList);
            },
            error=>{
                this.component.closeLoader();
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
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
        this.getEmployee(site.id);
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
            allowFutureDates:false
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
        this.viewCtrl.dismiss({project:this.selectedProject,site:this.selectedSite});
    }



}
