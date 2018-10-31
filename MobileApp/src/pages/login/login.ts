import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";
import {authService} from "../service/authService";
import {DashboardPage} from "../dashboard/dashboard";
import {TabsPage} from "../tabs/tabs";
import {componentService} from "../service/componentService";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Toast } from '@ionic-native/toast';
import {EmployeeService} from "../service/employeeService";
import{SQLite} from "@ionic-native/sqlite";

<<<<<<< HEAD
declare var demo;

=======
// import{SQLite,SQLitePorter} from "@ionic-native/sqlite-porter";
>>>>>>> Release-2.0-Inventory
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username:any;
  password:any;
  msg:any;
  now:any;
  field:any;
  eMsg:any;
  type : FormGroup;
  module:any;
  permission:any;
  constructor(public navCtrl: NavController,public component:componentService,private formBuilder: FormBuilder,public menuCtrl:MenuController, public toastCtrl:ToastController,private toast: Toast,
              public navParams: NavParams,public myService:authService, public employeeService: EmployeeService,
              public events:Events,private sqlite:SQLite) {
      this.permission=[
          {module:null,
              action:null}
      ];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.swipeEnable(false);
    this.now = new Date().getTime();
  }

  signin()
  {
      console.log('form submitted');
      if(this.username && this.password) {
        this.component.showLoader('Login');
        this.myService.login(this.username, this.password).subscribe(response => {
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
            }else{
                console.log(response);
                console.log(response);
                console.log("user role");
                console.log(response.user.userRoleName.toUpperCase());
                if(response.user){
                    console.log("user role found");
                    window.localStorage.setItem('userRole',response.user.userRoleName.toUpperCase());
                    if(response.user.userRole.rolePermissions){
                        var rolePermissions = [];
                        for (let rp of response.user.userRole.rolePermissions){
                            rolePermissions.push(rp.moduleName+rp.actionName)
                        }
                        this.events.publish('permissions:set',rolePermissions);
                        window.localStorage.setItem('rolePermissions',JSON.stringify(response.user.userRole.rolePermissions));
                    }
                    this.events.publish('userType',response.user.userRole.rolePermissions);
                }else{
                    console.log("User role not found, marking as admin");
                    this.events.publish('userType','ADMIN');
                    window.localStorage.setItem('userRole','ADMIN');
                }
                this.events.publish('user:logedin',response.employee.fullName);
                window.localStorage.setItem('session', response.token);
                window.localStorage.setItem('userGroup', response.employee.userUserGroupName);
                window.localStorage.setItem('employeeId', response.employee.id);
                window.localStorage.setItem('employeeFullName', response.employee.fullName);
                window.localStorage.setItem('employeeEmpId', response.employee.empId);
                window.localStorage.setItem('employeeUserId', response.employee.userId);
                window.localStorage.setItem('employeeDetails', JSON.stringify(response));

                var employee = response.employee;

                if (response) {
                    window.location.reload();
                    this.navCtrl.setRoot(TabsPage);
                    this.component.closeLoader();
                }

                else {
                    this.component.closeLoader();
                    // this.component.showToastMessage(this.msg,'center');
                }

                /*if(employee.userUserGroupName == "Admin"){
                 console.log("Admin user ");
                 this.navCtrl.setRoot(SiteListPage);
                 }else if(employee.userUserGroupName == "Client"){
                 console.log("Client User");
                 }else if(employee.userUserGroupName == "Employee"){
                 console.log("Employee user")
                 this.navCtrl.setRoot(EmployeeSiteListPage);
                 }else {
                 this.navCtrl.setRoot(SiteListPage);

                 }
                 */
            }

            },
            error => {

              this.component.closeLoader();
              console.log(error);

               if(error.type==2)
               {
                    this.msg = 'Invalid UserName and Password';
                    this.password = "";
               }
               if(error.type==3)
               {
                    this.msg = 'Server Unreachable';
                    this.password = "";
               }

                this.component.showToastMessage(this.msg,'center');
               /*
                this.toast.show(this.msg, '3000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    }
                );
                */
            }
        );

      }
      else
      {
          if(this.username)
          {
              this.eMsg="password";
              this.field="password";
          }
          else if(this.password)
          {
              this.eMsg="username";
              this.field="username";
          }
          else  if(!this.username && !this.password )
          {
              this.eMsg="all";
          }
      }

  }
  ionViewDidEnter(){
    //this.callValidation();
  }



}
