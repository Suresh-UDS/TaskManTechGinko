import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';

@Component({
  selector: 'page-attendance-popover',
  templateUrl: 'attendance-popover.html'
})
export class AttendancePopoverPage {

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController) {

  }

}
