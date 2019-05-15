import { Component } from '@angular/core';
import {NavController,NavParams,ViewController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Network} from "@ionic-native/network";
import {OfflinePage} from "../offline-page/offline-page";
import {DashboardPage} from "../dashboard/dashboard";
import {LoginPage} from "../login/login";


/**
 * Generated class for the Splash page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-offline-online-landing',
  templateUrl: 'offline-online-landing.html',
})
export class OfflineOnlineLanding {

    online:any;
    offline:any;

  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen, public network:Network, private navCtrl:NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad offline online landing');

      if(this.network.type!='none'){
          this.online = true;
          this.offline = false;

      }else{
          this.online = false;
          this.offline = true;
      }
      // this.splashScreen.hide();
      //
      // setTimeout(() => {
      //     this.viewCtrl.dismiss();
      // }, 4000);
  }

  goOffline(){
      this.navCtrl.setRoot(OfflinePage);
  }

  goOnline(){

      if(window.localStorage.getItem('session')){
          console.log("Session available");
          this.navCtrl.setRoot(DashboardPage);
      }else{
          console.log("Session not Available");
          // this.component.showToastMessage('Session not available, please login','bottom');
          this.navCtrl.setRoot(LoginPage);
      }
  }


}
