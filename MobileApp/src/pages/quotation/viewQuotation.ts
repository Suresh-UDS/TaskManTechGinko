import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";

@Component({
    selector: 'page-view-quotation',
    templateUrl: 'viewQuotation.html'
})
export class ViewQuotationPage {

    quotation:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService, private navParams: NavParams) {
        this.quotation = this.navParams.get('quotationDetails');
        console.log(this.quotation);
    }





}
