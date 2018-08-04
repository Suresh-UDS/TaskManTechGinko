import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';

@Component({
  selector: 'page-attendance-popover',
  templateUrl: 'attendance-popover.html'
})
export class AttendancePopoverPage {

  img:any;

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController,public navParams: NavParams) {
    this.img=this.navParams.get('i');
  }

}
