import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {SiteListPage} from "../site-list/site-list";
import {EmployeeSiteListPage} from "../site-employeeList/site-employeeList";
import {authService} from "../service/authService";
import {DashboardPage} from "../dashboard/dashboard";
import {TabsPage} from "../tabs/tabs";


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

  constructor(public navCtrl: NavController,public menuCtrl:MenuController, public navParams: NavParams,public myService:authService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.swipeEnable(false);
  }

  signin()
  {

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
        this.navCtrl.setRoot(TabsPage);

    /*  if(employee.userUserGroupName == "Admin"){
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
      });

  }




}
