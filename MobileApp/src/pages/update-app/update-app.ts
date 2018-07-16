import { Component } from '@angular/core';
import {MenuController, NavController, NavParams, ViewController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AppVersion} from "@ionic-native/app-version";
import {Market} from "@ionic-native/market";

/**
 * Generated class for the Splash page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-update-app',
  templateUrl: 'update-app.html',
})
export class UpdateApp {

    appPackageName:any;
    appVersionNumber:any;
  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen, private appVersion:AppVersion, private market:Market, private menuCtrl:MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad update app');
      this.menuCtrl.swipeEnable(false);


      // this.splashScreen.hide();
      //
      // setTimeout(() => {
      //     this.viewCtrl.dismiss();
      // }, 4000);

      this.appVersion.getPackageName().then(response=>{
          this.appPackageName=response;
      });

      this.appVersion.getVersionNumber().then(response=>{
          this.appVersionNumber = response;
      });


  }

  gotoPlayStore(){
      this.market.open(this.appPackageName);
  }

}
