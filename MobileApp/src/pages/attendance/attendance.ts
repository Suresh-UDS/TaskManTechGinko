import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {AttendancePopoverPage} from "./attendance-popover";

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  empID:any;

  constructor(public navCtrl: NavController,public myService:authService,public popoverCtrl: PopoverController) {

  }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(AttendancePopoverPage);
        popover.present({
            ev: myEvent
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Attendance');
        this.empID=window.localStorage.getItem('employeeId');
        console.log('Employ id:'+this.empID);


    }




}
