import { Component } from '@angular/core';
import {NavController, NavParams, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {QuotationPage} from "./quotation";
import {QuotationService} from "../service/quotationService";
import {AttendancePopoverPage} from "../attendance/attendance-popover";

@Component({
    selector: 'page-view-quotation',
    templateUrl: 'viewQuotation.html'
})
export class ViewQuotationPage {

    quotation:any;
    index:any;
    grandTotal=0;
    rates:any;
    cloudFrontUrl:any;
    images:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService,
                private navParams: NavParams, private componentService:componentService, private quotationService: QuotationService) {
        this.quotation = this.navParams.get('quotationDetails');
        console.log(this.quotation);
        this.rates =[];
        this.images = [];
        this.cloudFrontUrl = "http://d1l2i6capbtjhi.cloudfront.net/prod/quotations/";

        if(this.quotation.images && this.quotation.images.length>0){
            for(var j=0; j<this.quotation.images.length;j++){
                console.log(this.quotation.images[j]);
                this.images.push(this.cloudFrontUrl+this.quotation.images[j]);
            }
        }

        if(this.quotation.grandTotal){
            console.log("Grand total available");
        }else{
            console.log("Grand total not available");
            console.log(this.quotation.rateCardDetails.length);
            if(this.quotation.rateCardDetails.lenght>0){
                for(var i=0;i<this.quotation.rateCardDetails.length;i++){
                    // this.grandTotal = Math.abs(this.grandTotal-this.quotation.rateCardDetails[i].total);
                    this.quotation.rateCardDetails[i].total = this.quotation.rateCardDetails[i].qty*this.quotation.rateCardDetails[i].cost;
                    if(this.quotation.grandTotal){
                        this.quotation.grandTotal=this.quotation.grandTotal+this.quotation.rateCardDetails[i].total;
                    }else{
                        this.quotation.grandTotal=0;
                        this.quotation.grandTotal=this.quotation.grandTotal+this.quotation.rateCardDetails[i].total;
                    }
                }
            }
        }


    }

    addTotal(i,qty,cost)
    {
        this.index=i;
        console.log("add total");
        this.grandTotal = Math.abs(this.grandTotal-this.rates[i].total);
        this.rates[i].total=qty*cost;
        console.log(this.rates[i].total);
        console.log(qty+" * "+cost );
        console.log(this.grandTotal);
        this.grandTotal =this.grandTotal+this.rates[i].total ;
        console.log("add total-------:"+this.grandTotal);

    }



    sendQuotation(quotation){
        var selectedQuotation = quotation;
        selectedQuotation.isSubmitted = true;
        selectedQuotation.submitted = true;
        selectedQuotation.mode="edit";
        this.quotationService.createQuotation(selectedQuotation).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Sent Successfully','bottom');
                this.navCtrl.setRoot(QuotationPage);
            },err=>{
                console.log(err);
                console.log("Unable to send quotation, please try again later")
                this.componentService.showToastMessage('Error in sending Quotation, Please try again later','bottom');
            }
        )
    }

    approveQuotation(quotation){
        this.quotationService.approveQuotation(quotation).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Approved','bottom');
                this.navCtrl.setRoot(QuotationPage);
            },err=>{
                console.log("Unable to send quotation");
                console.log(err);
                this.componentService.showToastMessage('Error in sending Quotation, please try again later','bottom');
            }
        )
    }

    viewImage(img)
    {
        let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:img},{cssClass:'view-img',showBackdrop:false});
        popover.present({
        });
    }

    rejectQuotation(quotation){
        this.quotationService.rejectQuotation(quotation).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Rejected','bottom');
                this.navCtrl.setRoot(QuotationPage);
            },error2 => {
                console.log("Unable to send Quotation");
                console.log(error2);
                this.componentService.showToastMessage('Error in sending Quotation, please try again later','bottom');
            }
        )
    }



}
