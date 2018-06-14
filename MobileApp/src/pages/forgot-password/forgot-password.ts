import { Component } from '@angular/core';
import {Events, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {authService} from "../service/authService";
import {Toast} from "@ionic-native/toast";
import {FormBuilder, FormGroup} from "@angular/forms";
import {componentService} from "../service/componentService";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgot-password.html'
})
export class ForgotPassword {
    username:any;
    password:any;
    newPassword:any;
    oldPassword:any;
    msg:any;
    now:any;
    field:any;
    eMsg:any;
    type : FormGroup;
    module:any;
    permission:any;

  constructor(public navCtrl: NavController,public component:componentService,private formBuilder: FormBuilder,public menuCtrl:MenuController, public toastCtrl:ToastController,private toast: Toast,public navParams: NavParams,public myService:authService, public events:Events) {
        this.username = window.localStorage.getItem('employeeUserId')
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Reset password page');
        this.menuCtrl.swipeEnable(false);
        this.now = new Date().getTime();
    }

    resetPassword(){
        {
            console.log('form submitted');
            if(this.oldPassword&& this.newPassword) {
                this.component.showLoader('Updating Password');
                var changePasswordData = {
                    userId:Number(this.username),
                    newPassword:this.newPassword,
                    oldPassword:this.oldPassword
                };
                this.myService.resetPassword(changePasswordData).subscribe(
                    response=>{
                        console.log(response);
                        this.component.closeLoader();
                        this.logout();
                        this.component.showToastMessage('Password successfully changed, please login..','bottom');
                    },err=>{
                        console.log(err);
                        this.component.closeLoader();
                        this.component.showToastMessage('Error in changing password, please try agian..','bottom');
                    }
                )

            }
            else
            {
                if(this.oldPassword)
                {
                    this.eMsg="Old Password";
                    this.field="oldPassword";
                }
                else if(this.newPassword){
                    this.eMsg="New password";
                    this.field="newPassword";
                }
                else  if(!this.oldPassword && !this.newPassword )
                {
                    this.eMsg="all";
                }
            }

        }
    }

    logout(){
        this.navCtrl.setRoot(LoginPage);
        window.localStorage.clear();
    }

}
