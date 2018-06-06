import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";

/**
 * Generated class for the EmployeeFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-employee-filter',
  templateUrl: 'employee-filter.html',
})
export class EmployeeFilter {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeeFilter');
  }

    dismiss()
    {
      let data={'foo':'bar'};
      this.viewCtrl.dismiss(data);
    }

}
