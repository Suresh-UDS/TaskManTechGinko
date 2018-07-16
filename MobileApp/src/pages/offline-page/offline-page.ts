import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{OfflineAttendance} from "../employee/offline-attendance";
import{OfflineAttendanceSites} from "../employee/offline-attendance-sites";
import {OfflineAsset} from "../offline-asset/offline-asset";



/**
 * Generated class for the OfflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-offline-page',
  templateUrl: 'offline-page.html',
})
export class OfflinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflinePage');
  }

  attendancePage()
  {
    this.navCtrl.push(OfflineAttendanceSites);
  }
  offlineAsset(){
    this.navCtrl.push(OfflineAsset);
  }

}
