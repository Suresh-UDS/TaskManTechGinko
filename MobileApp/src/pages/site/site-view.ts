import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";

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

  constructor(public navCtrl: NavController,public component:componentService,public navParams:NavParams,public myService:authService,public authService:authService) {
  this.categories='detail';
    this.siteDetail=this.navParams.get('site')
    console.log('ionViewDidLoad SiteViewPage');
    console.log(this.siteDetail.name);
  }

  ionViewDidLoad() {
      this.getJobs();
      this.getAttendance()
  }

  getJobs()
  {
    this.component.showLoader('Getting All Jobs');
    var search={siteId:this.siteDetail.id};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.jobs = response;
      this.component.closeLoader();
    })
  }

  getAttendance()
  {
    this.component.showLoader('Getting Attendance');
    var search={siteId:this.siteDetail.id};
    //TODO
    //Add Search criteria to attendance
    this.authService.getSiteAttendances(this.siteDetail.id).subscribe(response=>{
      console.log("Attendance");
      console.log(response);
      this.attendances = response.json();
      this.component.closeLoader();
    })
  }


}
