import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {LoadingController, ModalController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {DatePickerProvider} from "ionic2-date-picker";
import {componentService} from "../service/componentService";
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
  employee:any;
  sites:any;
    firstLetter:any;
  constructor(public renderer: Renderer,public myService:authService,private loadingCtrl:LoadingController,public navCtrl: NavController,public component:componentService,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider) {

    this.categories='overdue';

   /* this.categories = [
      'overdue','upcoming','completed'
      ];
      */
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


    this.myService.getAllEmployees().subscribe(
        response=>{
          console.log('ionViewDidLoad Employee list:');
          console.log(response);
          this.employee=response;
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
        }
    )

    this.myService.searchSite().subscribe(
        response=>{
          console.log('ionViewDidLoad SitePage:');

          console.log(response.json()
          );
          this.sites=response.json();
          this.component.closeLoader();
        },
        error=>{
          console.log('ionViewDidLoad SitePage:'+error);
        }
    )


    this.getAllJobs()



  }

  getAllJobs(){
    this.component.showLoader('Getting All Jobs');
    var search={};
    this.authService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.allJobs = response;
      this.component.closeLoader();
    })
  }

    first(emp)
    {
        this.firstLetter=emp.charAt(0);
    }


}
