import { Component } from '@angular/core';
import {NavController, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage {

    quotations:any;
    approvedQuotations:any;
    submittedQuotations:any;
    draftedQuotations:any;
    archivedQuotations:any;
    approvedQuotationsCount:any;
    submittedQuotationsCount:any;
    draftedQuotationsCount:any;
    archivedQuotationsCount:any;
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService) {
      this.draftedQuotationsCount= 0;
      this.approvedQuotationsCount=0;
      this.submittedQuotationsCount=0;
      this.archivedQuotationsCount=0;
      this.getQuotations();
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(QuotationPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  quotationView()
  {
    this.navCtrl.push(QuotationPage)

  }

  getQuotations(){
      this.authService.getQuotations().subscribe(
          response=>{
              console.log(response);

                this.quotations=[];
              this.quotations = response;
              console.log(this.quotations)
              for(var i=0; i<this.quotations.length;i++){
                  if(this.quotations[i].isDrafted == true){
                      console.log("drafted");
                      console.log(this.quotations[i].isDrafted)
                      this.draftedQuotationsCount++;
                  }else if(this.quotations[i].isArchived == true){
                      console.log("archived");
                      console.log(this.quotations[i].isArchived)

                      this.archivedQuotationsCount++;
                  }else if(this.quotations[i].isApproved == true){
                      console.log("approved");
                      console.log(this.quotations[i].isApproved)

                      this.approvedQuotationsCount++;
                  }else if(this.quotations[i].isSubmitted == true){
                      console.log("submitted");
                      console.log(this.quotations[i].isSubmitted)

                      this.submittedQuotationsCount++;
                  }else{
                      console.log("all false");
                      console.log(this.quotations[i].isDrafted)
                  }
              }
          }
      )
  }



  createQuotation(){
      this.navCtrl.push(CreateQuotationPage);
  }


}
