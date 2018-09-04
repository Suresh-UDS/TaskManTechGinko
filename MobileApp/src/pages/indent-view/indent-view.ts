import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

/**
 * Generated class for the IndentView page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-indent-view',
  templateUrl: 'indent-view.html',
})
export class IndentView {
  details:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.navParams.get('indentDetails');
    this.details=this.navParams.get('indentDetails');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndentView');
  }

}
