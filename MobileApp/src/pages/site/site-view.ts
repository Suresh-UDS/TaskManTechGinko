import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {AttendanceService} from "../service/attendanceService";

@Component({
  selector: 'page-site-view',
  templateUrl: 'site-view.html'
})
export class SiteViewPage {

  siteName:any;
  siteDetail:any;
  categories:any;
  jobs:any;
  attendances:any;
  ref=false;
  job="job";
  attendance="attendance";
  constructor(public navCtrl: NavController,public component:componentService,public navParams:NavParams,public myService:authService,public authService:authService, public toastCtrl: ToastController,

              private jobService:JobService, private attendanceService: AttendanceService) {
  this.categories='detail';
    this.siteDetail=this.navParams.get('site')
    console.log('ionViewDidLoad SiteViewPage');
    console.log(this.siteDetail.name);
  }

  ionViewDidLoad()
  {
  }


    showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'middle'
        });

        toast.present(toast);
    }

  doRefresh(refresher,segment)
  {
    this.ref=true;
    if(segment=="job")
    {
      this.getJobs(this.ref);
      refresher.complete();
    }
    else if(segment=="attendance")
    {
      console.log("------------- segment attandance");
      this.getAttendance(this.ref);
      refresher.complete();
    }

  }

  getJobs(ref)
  {
    if(this.jobs)
    {
      if(ref)
      {
        this.loadJobs();
      }
      else
      {
        this.jobs=this.jobs;
      }
    }
    else
    {
      this.loadJobs();
    }
  }

  loadJobs()
  {
    this.component.showLoader('Getting All Jobs');
    var search={siteId:this.siteDetail.id};
    this.jobService.getJobs(search).subscribe(response=>{
      console.log("Job Refresher");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }

  getAttendance(ref)
  {
    if(this.attendances)
    {
      if(ref)
      {
        console.log("------------- segment attandance ref true");
        this.loadAttendance();
      }
      else
      {
        this.attendances=this.attendances;
      }
    }
    else
    {
      this.loadAttendance();
    }
  }


  loadAttendance()
  {
      this.component.showLoader('Getting Attendance');
      var search={siteId:this.siteDetail.id};
      //TODO
      //Add Search criteria to attendance
      this.attendanceService.getSiteAttendances(this.siteDetail.id).subscribe(response=>{
        console.log("Loader Attendance");
        console.log(response.json());
        this.attendances = response.json();
        this.component.closeLoader();
      })
  }





}
