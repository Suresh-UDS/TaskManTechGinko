import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {AttendancePopoverPage} from "./attendance-popover";
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  empID:any;
  attendances:any;

  constructor(public navCtrl: NavController,public myService:authService,public popoverCtrl: PopoverController) {
        this.myService.getAllAttendances().subscribe(response=>{
            console.log("All attendances");
            console.log(response);
            this.attendances = response;
        })
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

    markAttendance(){
      console.log(window.localStorage.getItem('userGroup'));
      if(window.localStorage.getItem('userGroup')=='Admin'){
          console.log("Admin login");
          this.navCtrl.setRoot(SiteListPage);
      }else if(window.localStorage.getItem('userGroup') == 'Employee'){
          console.log("Empoyee login");
          this.navCtrl.setRoot(EmployeeSiteListPage);
      }else if(window.localStorage.getItem('userGroup') == 'client'){
          console.log("Client login");
          this.navCtrl.setRoot(SiteListPage);
      }else{
          console.log("Others login");
          this.navCtrl.setRoot(SiteListPage);
      }
    }




}
