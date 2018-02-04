import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {QuotationPage} from "./quotation";
import {QuotationService} from "../service/quotationService";

@Component({
    selector: 'page-view-quotation',
    templateUrl: 'viewQuotation.html'
})
export class ViewQuotationPage {

    quotation:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService, private navParams: NavParams, private componentService:componentService, private quotationService: QuotationService) {
        this.quotation = this.navParams.get('quotationDetails');
        console.log(this.quotation);
    }

    sendQuotation(quotation){
        this.quotationService.sendQuotation(quotation).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Sent Successfully');
                this.navCtrl.push(QuotationPage);
            },err=>{
                console.log("Unable to send quotation, please try again later")
                this.componentService.showToastMessage('Error in sending Quotation, Please try again later');
            }
        )
    }

    approveQuotation(quotation){
        this.quotationService.approveQuotation(this.quotation).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Approved');
                this.navCtrl.push(QuotationPage);
            },err=>{
                console.log("Unable to send quotation");
                console.log(err);
                this.componentService.showToastMessage('Error in sending Quotation, please try again later');
            }
        )
    }





}
