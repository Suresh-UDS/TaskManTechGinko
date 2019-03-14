import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import * as moment from 'moment';
import {componentService} from "../service/componentService";
import {JobsPage} from "./jobs";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {SiteService} from "../service/siteService";
import {EmployeeService} from "../service/employeeService";

declare var demo;

@Component({
  selector: 'page-job',
  templateUrl: 'add-job.html'
})
export class CreateJobPage {

    jobDetails:any;

    title:any;
    description:any;
    location:any;
    startDate:any;
    startTime:any;
    newJob:any;
    endDate:any;
    endTime:any;
    plannedStartTime:any;
    plannedEndTime:any;
    plannedHours:any;
    userId:any;
    sites:any;
    siteName:any;
    siteId:any;
    sId:any;
    empSelect:any;
    employee:any;
    employ:any;
    eMsg:any;
    field:any;
    checklists:any;
    empPlace:any;
    msg:any;
    ticket:any;
    assetDetails:any;
    category:any;
    constructor(public navCtrl: NavController,public component:componentService,public navParams:NavParams,public myService:authService, public authService: authService, private loadingCtrl:LoadingController, private jobService: JobService, private attendanceService: AttendanceService, private siteService: SiteService, private employeeService:EmployeeService) {
        this.jobDetails=this.navParams.get('job');
        this.assetDetails = this.navParams.get('assetDetails')
        console.log(this.navParams.get('ticketDetails'));
        if(this.navParams.get('ticketDetails')){
            this.ticket = this.navParams.get('ticketDetails');
            this.getEmployee(this.ticket.siteId)
        }
        this.jobService.loadCheckLists().subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    console.log(response);
                }

            }
        )

        this.empPlace="Employee"

    }

    ionViewDidLoad() {
        this.empSelect=true;
        if(this.ticket){
            this.title = this.ticket.title;
            this.description = this.ticket.description;
            this.siteName = this.ticket.siteId;
        }

        this.component.showLoader('Getting All Sites');
        this.siteService.searchSite().subscribe(
            response=>{
                if(response.errorStatus){
                    this.component.closeAll();
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    console.log('ionViewDidLoad Add jobs');
                    console.log(response);
                    this.sites=response;
                    this.component.closeAll();
                }

            },
            error=>{
                console.log('ionViewDidLoad SitePage:'+error);
                this.component.closeAll();
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }

                this.component.showToastMessage(this.msg,'bottom');
            }
        )

    }
    addJob()
    {

        if(this.title && this.description && this.siteName && this.employ && this.startDate && this.endDate)
        {
            this.component.showLoader("Creating job");
            this.eMsg="";
            this.siteId=window.localStorage.getItem('site')
            var SDate = moment(this.startDate).local().format('YYYY-MM-DD HH:mm:ss');
            var EDate = new Date(this.endDate);

            this.startTime = moment(this.startDate).subtract(5,'hours').toDate();
            this.endTime = moment(this.endDate).subtract(5,'hours').toDate();


            this.plannedStartTime =moment(this.startTime).subtract(30,'minutes').toDate();
            this.plannedEndTime= moment(this.endTime).subtract(30,'minutes').toDate();


            var momentStartTime = moment(this.plannedStartTime);
            var momentEndTime = moment(this.plannedEndTime);
            var duration = moment.duration(momentStartTime.diff(momentEndTime));
            var hours = duration.asHours();
            this.plannedHours = Math.abs(hours);

            this.userId=localStorage.getItem('employeeUserId');
            this.newJob={
                "title":this.title,
                "description":this.description,
                "plannedStartTime":this.plannedStartTime,
                "plannedEndTime":this.plannedEndTime,
                "plannedHours":this.plannedHours,
                "jobStatus":"ASSIGNED",
                "comments":"test",
                "siteId":this.siteId,
                "employeeId":this.employ,
                "userId":this.userId,
                "locationId":1,
                "active":'Y',
                "jobType":this.category,


            };

            if(this.ticket){
                this.newJob={
                    "title":this.title,
                    "description":this.description,
                    "plannedStartTime":this.plannedStartTime,
                    "plannedEndTime":this.plannedEndTime,
                    "plannedHours":this.plannedHours,
                    "jobStatus":"ASSIGNED",
                    "comments":"test",
                    "siteId":this.siteId,
                    "employeeId":this.employ,
                    "userId":this.userId,
                    "locationId":1,
                    "ticketId":this.ticket.id,
                    "active":'Y',
                    "jobType":this.category,
                }
            }
            else if(this.assetDetails)
            {
                this.newJob={
                    "title":this.title,
                    "description":this.description,
                    "plannedStartTime":this.plannedStartTime,
                    "plannedEndTime":this.plannedEndTime,
                    "plannedHours":this.plannedHours,
                    "jobStatus":"ASSIGNED",
                    "comments":"test",
                    "siteId":this.siteId,
                    "employeeId":this.employ,
                    "userId":this.userId,
                    "locationId":1,
                    "assetId":this.assetDetails.id,
                    "active":'Y',
                    "jobType":this.category,
                }
            }




            this.jobService.createJob(this.newJob).subscribe(
                response=> {
                    if(response.errorStatus){
                        console.log("errorstatus",response.errorMessage);
                        demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                      this.component.closeAll();
                    }else{
                        this.component.closeAll();
                        console.log(response);
                        this.navCtrl.setRoot(JobsPage);
                    }

                },
                error=>{
                    this.component.closeAll();
                    console.log(error);
                    if(error.type==3)
                    {
                        this.msg='Server Unreachable'
                    }

                    this.component.showToastMessage(this.msg,'bottom');
                }
                )
        }
        else
        {
            console.log("============else");

            if(!this.title)
            {
                console.log("============title");
                this.eMsg="title";
                this.field="title";
            }
            else if(!this.description)
            {
                console.log("============desc");
                this.eMsg="description";
                this.field="description";
            }
            else if(!this.siteName)
            {
                console.log("============site");
                this.eMsg="siteName";
                this.field="siteName";
            }
            else if(!this.employ && this.empPlace=="Employee")
            {
                console.log("============employ");
                this.eMsg="employ";
                this.field="employ";
            }
            else if(!this.startDate)
            {
                console.log("============sdate");
                this.eMsg="startDate";
                this.field="startDate";
            }
            else if(!this.startTime)
            {
                console.log("============stime");
                this.eMsg="startTime";
                this.field="startTime";
            }
            else if(!this.endDate)
            {
                console.log("============edate");
                this.eMsg="endDate";
                this.field="endDate";
            }
            else if(!this.endTime)
            {
                console.log("============etime");
                this.eMsg="endTime";
                this.field="endTime";
            }
            else if(!this.title && !this.description && !this.siteName && !this.employ && !this.startDate && !this.startTime && !this.endDate && !this.endTime)
            {
                console.log("============all");
                this.eMsg="all";
            }

        }
    }

    getEmployee(id)
    {
        if(id)
        {
        console.log('ionViewDidLoad Add jobs employee');

        console.log(this.siteName);

        window.localStorage.setItem('site',id);
        console.log(this.empSelect);
        var search={
            // currPage:1,
            list:true,
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
}
