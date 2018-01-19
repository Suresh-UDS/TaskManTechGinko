import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage {

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController) {

  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(QuotationPopoverPage);
    popover.present({
      ev: myEvent
    });
  }
}
