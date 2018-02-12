import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";
import {ViewQuotationPage} from "./viewQuotation";

@Component({
    selector: 'page-approved-quotation',
    templateUrl: 'approvedQuotations.html'
})
export class ApprovedQuotationPage {

    quotations:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService, private navParams: NavParams) {
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }

    viewQuotation(quotation){
        this.navCtrl.push(ViewQuotationPage,{quotationDetails:quotation})
    }




}
