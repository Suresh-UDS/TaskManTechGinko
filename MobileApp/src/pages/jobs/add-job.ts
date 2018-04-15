import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import * as moment from 'moment';
import {componentService} from "../service/componentService";
import {JobsPage} from "./jobs";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";
import {SiteService} from "../service/siteService";

@Component({
  selector: 'page-add-job',
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
    constructor(public navCtrl: NavController,public component:componentService,public navParams:NavParams,public myService:authService, public authService: authService, private loadingCtrl:LoadingController, private jobService: JobService, private attendanceService: AttendanceService, private siteService: SiteService) {
        this.jobDetails=this.navParams.get('job');
        console.log(this.navParams.get('ticketDetails'));
        if(this.navParams.get('ticketDetails')){
            this.ticket = this.navParams.get('ticketDetails');
        }
        this.jobService.loadCheckLists().subscribe(
            response=>{
                console.log(response);

            }
        )

        this.empPlace="Employee"

    }

    ionViewDidLoad() {
        this.empSelect=true;
        if(this.ticket){
            this.title = this.ticket.title;
            this.description = this.ticket.description;

        }

        this.component.showLoader('Getting All Sites');
        this.siteService.searchSite().subscribe(
            response=>{
                console.log('ionViewDidLoad Add jobs');

                console.log(response.json());
                this.sites=response.json();
                this.component.closeLoader();
            },
            error=>{
                console.log('ionViewDidLoad SitePage:'+error);
                this.component.closeLoader();
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
        if(this.title && this.description && this.siteName && this.employ && this.startDate && this.startTime && this.endDate && this.endTime)
        {
            this.eMsg="";
            this.siteId=window.localStorage.getItem('site')
            console.log( this.siteId);
            var sDate = moment(this.startDate).format("MM/DD/YYYY");
            var sTime = moment(this.startTime).format("hh:mm A");

            var startDateTimeMoment = moment(sDate+' '+sTime,"MM/DD/YYYY hh:mm A");
            var eDate = moment(this.endDate).format("MM/DD/YYYY");
            var eTime = moment(this.endTime).format("hh:mm A");
            var endDateTimeMoment = moment(eDate+' '+eTime,"MM/DD/YYYY hh:mm A");
            this.plannedStartTime = startDateTimeMoment.toDate();
            this.plannedStartTime = this.plannedStartTime.toISOString();
            this.plannedEndTime = endDateTimeMoment.toDate().toISOString();
            this.plannedHours = 2;
            this.userId=localStorage.getItem('employeeUserId')
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
                "ticketId":this.ticket.id
            }


            this.jobService.createJob(this.newJob).subscribe(
                response=> {
                console.log(response);
                this.navCtrl.setRoot(JobsPage);
                },
                error=>{
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

        window.localStorage.setItem('site',id);
        console.log(this.empSelect);
        this.siteService.searchSiteEmployee(id).subscribe(
            response=> {
                console.log(response.json());
                if(response.json().length !==0)
                {
                    this.empSelect=false;
                    this.empPlace="Employee"
                    this.employee=response.json();
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
