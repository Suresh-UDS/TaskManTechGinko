import { Component } from '@angular/core';
import {
    ActionSheetController, Button, IonicPage, Item, ItemSliding, LoadingController, ModalController, NavController,
    NavParams,
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
import{EmployeeFilter} from "./employee-filter/employee-filter";
import {ImageViewerController} from "ionic-img-viewer";

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
    count=0;
clientFilter:any;
siteFilter:any;

  constructor(public navCtrl: NavController,public component:componentService,public myService:authService, public navParams: NavParams, private  authService: authService, public camera: Camera,public imageViewerCtrl: ImageViewerController,
              private loadingCtrl:LoadingController, private geolocation:Geolocation, private toast: Toast,
              private geoFence:Geofence, private employeeService: EmployeeService, private actionSheetCtrl: ActionSheetController,
              private modalCtrl:ModalController) {

      this.employees = [];

  }

    onClick(imageToView) {
        const viewer = this.imageViewerCtrl.create(imageToView)
        viewer.present();
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

    open(itemSlide: ItemSliding, item: Item,c,menu:Button)
    {
        this.count=c;
        if(c==1)
        {
            this.count=0;
            menu.setElementStyle("display", "block")
        }
        else
        {
            this.count=1;
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-120px, 0px, 0px)")
            menu.setElementStyle("display", "none")
        }

    }
    close(item: ItemSliding,menu:Button) {
        this.count=0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
        menu.setElementStyle("display", "block")
    }

    drag(menu,e)
    {

        let percent = e.getSlidingPercent();
        console.log("Drag:"+percent);
        if(percent==1)
        {
            menu.setElementStyle("display", "none")

        }
        else
        {
            menu.setElementStyle("display", "block")
        }
    }

    markLeft(emp){
        console.log("Mark employee left");
        this.component.showToastMessage('Employee Mark left is in beta, please try again later','bottom');
    }
    transferEmployee(emp){
        console.log("Transfer employee ");
        this.component.showToastMessage('Transfer employee is in beta, please try again later','bottom');
    }
    relieveEmployee(emp){
        console.log("Relieve Employee");
        this.component.showToastMessage('Relieve employee is in beta, please try again later','bottom');
    }

    presentModal() {
        let modal = this.modalCtrl.create(EmployeeFilter,{},{cssClass:'asset-filter',showBackdrop:true});
       modal.onDidDismiss(data=>{
           console.log("Modal Dismiss");
           console.log(data);
           this.clientFilter=data.project;
           this.siteFilter=data.site;
           this.applyFilter(data.project,data.site);
       });
        modal.present();
    }


    applyFilter(project,site)
    {
        this.component.showLoader("");
        var searchCriteria = {
            siteId:site.id,
            projectId:project.id
        };


        this.employeeService.searchEmployees(searchCriteria).subscribe(
            response=>{
                this.component.closeAll();
                console.log("successfully applied filter");
                console.log(response);
                this.employees=response.transactions;
            },error=>{
                this.component.closeAll();
                console.log("error in applying filter");
                console.log(error);
            }
        )



    }



}
