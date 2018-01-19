import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
import {authService} from "../service/authService";
import {DatePickerProvider} from "ionic2-date-picker";
declare var demo;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  @ViewChild('date') MyCalendar: ElementRef;

  dateView:any;
  constructor(public renderer: Renderer,public navCtrl: NavController,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider) {

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


}
