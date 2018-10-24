import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";
import {ViewQuotationPage} from "./viewQuotation";
import {componentService} from "../service/componentService";

@Component({
    selector: 'page-drafted-quotation',
    templateUrl: 'draftedQuotations.html'
})
export class DraftedQuotationPage {

    quotations:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService,
                private navParams: NavParams, private componentService: componentService) {
        this.quotations = this.navParams.get('quotations');
        console.log(this.quotations);
    }

    viewQuotation(quotation){
        console.log(quotation)
        this.navCtrl.push(ViewQuotationPage,{quotationDetails:quotation})
    }



}
