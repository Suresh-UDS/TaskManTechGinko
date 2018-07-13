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

    checkListItems:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
       this.checkListItems= this.navParams.get('checkListItems');
       console.log("checklistItems");
       console.log(this.checkListItems);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Checklist');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }



}
