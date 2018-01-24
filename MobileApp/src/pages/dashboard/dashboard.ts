import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {DatePickerProvider} from "ionic2-date-picker";
declare var demo;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  @ViewChild('date') MyCalendar: ElementRef;
  todaysJobs: any;
  allJobs:any;
  categories:any;
  loader:any;
  dateView:any;
  constructor(public renderer: Renderer,private loadingCtrl:LoadingController,public navCtrl: NavController,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider) {

    this.categories = [
      'overdue','upcoming','completed'
      ];
  }

/*
  showCalendar2() {
    const dateSelected =
        this.datePickerProvider.showCalendar(this.modalCtrl);

    dateSelected.subscribe(date =>
        console.log("second date picker: date selected is", date));
  }
*/
  ionViewDidLoad()
  {
    demo.initFullCalendar();




    this.authService.searchSite().subscribe(response=>
    {
      console.log(response);
    },
    error=>
    {
      console.log(error);
    })
  }
  showLoader(msg){
    this.loader = this.loadingCtrl.create({
      content:msg
    });
    this.loader.present();
  }

  closeLoader(){
    this.loader.dismiss();
  }
  getAllJobs(){
    this.showLoader('Getting All Jobs');
    var search={};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.allJobs = response;
      this.closeLoader();
    })
  }
}
