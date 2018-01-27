import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import * as moment from 'moment';
import {componentService} from "../service/componentService";
import {JobsPage} from "./jobs";

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
    constructor(public navCtrl: NavController,public component:componentService,public navParams:NavParams,public myService:authService, public authService: authService, private loadingCtrl:LoadingController) {
        this.jobDetails=this.navParams.get('job');

    }

    ionViewDidLoad() {
        this.empSelect=true;


        this.component.showLoader('Getting All Sites');
        this.myService.searchSite().subscribe(
            response=>{
                console.log('ionViewDidLoad Add jobs');

                console.log(response.json());
                this.sites=response.json();
                this.component.closeLoader();
            },
            error=>{
                console.log('ionViewDidLoad SitePage:'+error);
            }
        )

    }
    addJob()
    {
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
            "locationId":1
        }


        this.myService.createJob(this.newJob).subscribe(
            response=> {
            console.log(response);
            this.navCtrl.setRoot(JobsPage);
            },
            error=>{
                console.log(error);
            }
            )
    }

    getEmployee(id)
    {
        console.log('ionViewDidLoad Add jobs employee');
        this.empSelect=false;
        window.localStorage.setItem('site',id);
        console.log(this.empSelect);
        this.myService.searchSiteEmployee(id).subscribe(
            response=> {
                console.log(response.json());
                if(response.json().length>0)
                {
                    this.employee=response.json();
                }
                else
                {
                    this.employee="No Employee";
                }

            },
            error=>{
                console.log(error);
            })
    }
}
