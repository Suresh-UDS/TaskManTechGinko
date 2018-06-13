import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import{NewInvite} from '../new-invite/new-invite';


@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgot-password.html'
})
export class ForgotPassword {

  constructor(public navCtrl: NavController) {

  }

}
