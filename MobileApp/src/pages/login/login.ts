import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";
import {authService} from "../service/authService";
import {DashboardPage} from "../dashboard/dashboard";
import {TabsPage} from "../tabs/tabs";
import {componentService} from "../service/componentService";
import { Toast } from '@ionic-native/toast';


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
  msg:any;
  now:any;

  constructor(public navCtrl: NavController,public component:componentService,public menuCtrl:MenuController,
              public toastCtrl:ToastController,public navParams: NavParams,public myService:authService, public toast:Toast) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.swipeEnable(false);
    this.now = new Date().getTime();
  }

  signin()
  {
    this.component.showLoader('Login');
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
        window.localStorage.setItem('employeeDetails',JSON.stringify(response.json()));
        var employee = response.json().employee;

        if (response.status == 200) {
          this.navCtrl.setRoot(TabsPage);
          this.component.closeLoader();
        }

      /*  else {
            this.component.closeLoader();
          console.log(response);
          let toast = this.toastCtrl.create({
            message:'Login Failure',
            showCloseButton: true,
            closeButtonText: "Ok",
            position: 'bottom',
            cssClass: ""
          });

          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });

          toast.present();

        }*/

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
        if(error.type==2)
        {
            this.msg='Invalid UserName and Password'
        }
        if(error.type==3)
        {
          this.msg='Server Unreachable'
        }

        // let toast = this.toastCtrl.create({
        //   message:this.msg,
        //   showCloseButton: true,
        //   closeButtonText: "Ok",
        //   position: 'bottom',
        //   cssClass: ""
        // });
        //
        // toast.present();
        //
        // toast.onDidDismiss(() => {
        //   console.log('Dismissed toast');
        // });
          this.toast.show(this.msg,'5000','center').subscribe(
              toast=>{
                console.log(toast);
              }
          )

        }
      );

  }




}
