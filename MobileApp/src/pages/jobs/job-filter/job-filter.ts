import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import{componentService} from "../../service/componentService";
import{AssetService} from "../../service/assetService";
import{SiteService} from "../../service/siteService";
import{JobService} from "../../service/jobService";
import{EmployeeService} from "../../service/employeeService";

import { DatePicker } from '@ionic-native/date-picker';
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
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public component:componentService,
                public siteService:SiteService, public assetService:AssetService,private jobService:JobService,private employeeService:EmployeeService,
                private   datePicker:DatePicker) {
        this.assetGroup = [
            {name:"CMRL"},
            {name:"UDS House Keeping Assets"},
            {name:"UDS Electrical Assets"},
            {name:"UDS Plumbing Assets"}
        ]
        this.empPlace='Employee';
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
                this.selectSite(this.selectedProject);
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

    selectSite(project)
    {
        this.selectedProject = project;
        this.scrollSite = true;
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
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

    highLightSite(index,site){
        console.log("Selected Site");
        console.log(site);
        this.activeSite= index;
        this.selectedSite = site;
        this.getEmployee(site.id);
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
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
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
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
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

    filter(){
        this.viewCtrl.dismiss();
    }

    filterJob(){
        this.searchCriteria = {
            siteId:this.selectedSite.id,
            projectId:this.selectedProject.id,
        };
        this.viewCtrl.dismiss(this.searchCriteria);
    }




}


/**
 * Generated class for the JobFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
