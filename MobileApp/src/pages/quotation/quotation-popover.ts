import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';

@Component({
  selector: 'page-quotation-popover',
  templateUrl: 'quotation-popover.html'
})
export class QuotationPopoverPage {

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController) {

  }

}
