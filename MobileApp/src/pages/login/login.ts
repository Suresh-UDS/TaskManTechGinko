import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";
import {authService} from "../service/authService";
import {DashboardPage} from "../dashboard/dashboard";
import {TabsPage} from "../tabs/tabs";
import {componentService} from "../service/componentService";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username:any;
  password:any;

  constructor(public navCtrl: NavController,public component:componentService,public menuCtrl:MenuController, public toastCtrl:ToastController,public navParams: NavParams,public myService:authService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.swipeEnable(false);
  }

  signin()
  {
    this.component.showLoader('Getting All Sites');
      this.myService.login(this.username,this.password).subscribe(response=>
      {
        console.log(response);
        console.log(response.json());
        window.localStorage.setItem('session',response.json().token);
        window.localStorage.setItem('userGroup',response.json().employee.userUserGroupName);
        window.localStorage.setItem('employeeId',response.json().employee.id);
        window.localStorage.setItem('employeeFullName',response.json().employee.fullName);
        window.localStorage.setItem('employeeEmpId',response.json().employee.empId);
        window.localStorage.setItem('employeeUserId',response.json().employee.userId);
        var employee = response.json().employee;

        if (response.status == 200) {
          this.navCtrl.setRoot(TabsPage);
          this.component.closeLoader();
        }

        else {
            this.component.closeLoader();
          console.log(response);
          let toast = this.toastCtrl.create({
            message:response.json().msg,
            showCloseButton: true,
            closeButtonText: "Ok",
            position: 'bottom',
            cssClass: ""
          });

          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });

          toast.present();

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
      },
      error=>{
        this.component.closeLoader();
        console.log(error);
        let toast = this.toastCtrl.create({
          message:error.json().msg,
          showCloseButton: true,
          closeButtonText: "Ok",
          position: 'bottom',
          cssClass: ""
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }
      );

  }




}
