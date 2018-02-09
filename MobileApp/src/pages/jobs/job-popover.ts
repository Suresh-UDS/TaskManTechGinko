import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-job-popover',
  templateUrl: 'job-popover.html'
})
export class JobPopoverPage {

  img:any;
  index:any;

  constructor(public navCtrl: NavController,public viewCtrl: ViewController,public popoverCtrl: PopoverController,public navParams: NavParams) {
    this.img=this.navParams.get('i');
    this.index=this.navParams.get('ind');
  }
  deleteImg(index)
  {
    this.viewCtrl.dismiss(index);
  }
}
