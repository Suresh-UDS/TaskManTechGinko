import { Component } from '@angular/core';
import {NavController, NavParams,ViewController} from "ionic-angular";

/**
 * Generated class for the AddExpense page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpense {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpense');
  }

    dismiss(){
        let data={'foo':'bar'};
        this.viewCtrl.dismiss(data);
    }

}
