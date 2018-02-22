import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {AttendancePopoverPage} from "./attendance-popover";
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";
import {componentService} from "../service/componentService";
import {AttendanceService} from "../service/attendanceService";

@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html'
})
export class AttendancePage {

  empID:any;
  attendances:any;
  searchCriteria:any;

    page:1;
    totalPages:0;
    pageSort:15;

  constructor(public navCtrl: NavController,public myService:authService,public attendanceService:AttendanceService,public popoverCtrl: PopoverController, public component: componentService) {
        this.component.showLoader('');
        this.searchCriteria ={
            // checkInDateTimeFrom: new Date(),
            currPage:this.page,
            pageSort: this.pageSort
        }

        this.attendanceService.searchAttendances(this.searchCriteria).subscribe(response=>{
            console.log("All attendances");
            console.log(response);
            this.attendances = response.transactions;
            this.page = response.currPage;
            this.totalPages = response.totalPages;
            this.component.closeLoader();
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

    viewImage(img)
    {
        let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:img},{cssClass:'view-img',showBackdrop:true});
        popover.present({

        });
    }

    doInfinite(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria ={
            currPage:this.page+1
        };
        if(this.page>this.totalPages){
            console.log("End of all pages");
            infiniteScroll.complete();
            this.component.showToastMessage('All Attendances Loaded', 'bottom');

        }else{
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(()=>{
                this.attendanceService.searchAttendances(searchCriteria).subscribe(
                    response=>{
                        console.log('ionViewDidLoad Employee list:');
                        console.log(response);
                        console.log(response.transactions);
                        for(var i=0;i<response.transactions.length;i++){
                            this.attendances.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.component.closeLoader();
                    },
                    error=>{
                        console.log('error in attendance Page:'+error);
                    }
                )
                infiniteScroll.complete();
            },1000);
        }


    }


}
