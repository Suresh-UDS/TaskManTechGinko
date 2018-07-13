import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{ViewController} from "ionic-angular";

/**
 * Generated class for the Checklist page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html',
})
export class Checklist {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Checklist');
  }

    dismiss(){
this.viewCtrl.dismiss();
    }



}
