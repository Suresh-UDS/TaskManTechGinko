import { Component } from '@angular/core';
import {NavController,NavParams,ViewController} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";


/**
 * Generated class for the Splash page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class Splash {

  constructor(public viewCtrl: ViewController, public splashScreen: SplashScreen) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Splash');

      // this.splashScreen.hide();
      //
      // setTimeout(() => {
      //     this.viewCtrl.dismiss();
      // }, 4000);


  }

}
