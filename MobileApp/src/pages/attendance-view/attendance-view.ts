import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the AttendanceViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-attendance-view',
  templateUrl: 'attendance-view.html',
})
export class AttendanceViewPage {

  img:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private domSanitizer: DomSanitizer) {
    this.img=this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendanceViewPage');
  }

}
