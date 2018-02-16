import { Component } from '@angular/core';
import {
    ActionSheetController, IonicPage, LoadingController, NavController, NavParams,
    ToastController
} from 'ionic-angular';
import {AttendanceListPage} from "../attendance-list/attendance-list";
import {authService} from "../service/authService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {Geofence} from "@ionic-native/geofence";
import {componentService} from "../service/componentService";
import {EmployeeDetailPage} from "./employee-detail";
import {CreateEmployeePage} from "./create-employee";
import {EmployeeService} from "../service/employeeService";
import {Toast} from "@ionic-native/toast";

/**
 * Generated class for the EmployeeList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-list',
  templateUrl: 'employee-list.html',
})
export class EmployeeListPage {

  employees:any;
    firstLetter:any;
    page:1;
    totalPages:0;
    pageSort:15;

  constructor(public navCtrl: NavController,public component:componentService,public myService:authService, public navParams: NavParams, private  authService: authService, public camera: Camera,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toast: Toast,
              private geoFence:Geofence, private employeeService: EmployeeService, private actionSheetCtrl: ActionSheetController) {

      this.employees = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Employee list');
    this.component.showLoader('Getting Employees');
    var searchCriteria = {
        currPage:this.page,
        pageSort: this.pageSort
    };
      this.employeeService.searchEmployees(searchCriteria).subscribe(
          response=>{
              console.log('ionViewDidLoad Employee list:');
              console.log(response);
              console.log(response.transactions);
              this.employees = response.transactions;
              console.log(this.employees);
              this.page = response.currPage;
              this.totalPages = response.totalPages;
              this.component.closeLoader();
          },
          error=>{
              console.log('ionViewDidLoad Employee Page:'+error);
          }
      )

  }

    viewEmployee(emp)
    {
        this.navCtrl.push(EmployeeDetailPage,{emp:emp})
    }

    first(emp)
    {
        // console.log(emp)
        this.firstLetter=emp.charAt(0);
    }
    createEmployee($event)
    {
        this.navCtrl.push(CreateEmployeePage)
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
          this.component.showToastMessage('All Employees Loaded', 'bottom');

      }else{
          console.log("Getting pages");
          console.log(this.totalPages);
          console.log(this.page);
          setTimeout(()=>{
              this.employeeService.searchEmployees(searchCriteria).subscribe(
                  response=>{
                      console.log('ionViewDidLoad Employee list:');
                      console.log(response);
                      console.log(response.transactions);
                      for(var i=0;i<response.transactions.length;i++){
                          this.employees.push(response.transactions[i]);
                      }
                      this.page = response.currPage;
                      this.totalPages = response.totalPages;
                      this.component.closeLoader();
                  },
                  error=>{
                      console.log('ionViewDidLoad Employee Page:'+error);
                  }
              )
              infiniteScroll.complete();
          },1000);
      }


    }

    presentActionSheet(employee){
        let actionSheet = this.actionSheetCtrl.create({
            title:'Employee Actions',
            buttons:[
                {
                    text:'Mark Left',

                    handler:()=>{
                        console.log("Mark Employee Left");
                        // this.navCtrl.push(ViewJobPage,{job:job})
                    }
                },
                {
                    text:'Site Transfer',
                    handler:()=>{
                        console.log('Transfer Employee');
                    }
                },

                {
                    text:'Relieve Employee',
                    handler:()=>{
                        console.log('Relieve employee with another employee ');
                    }
                },

                {
                    text:'Cancel',
                    role:'cancel',
                    handler:()=>{
                        console.log("Cancel clicker");
                    }
                }
            ]
        });

        actionSheet.present();
    }


}
