import { Component } from '@angular/core';
import {Events, NavController, PopoverController} from 'ionic-angular';
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage} from "./create-quotation";
import {authService} from "../service/authService";
import {ApprovedQuotationPage} from "./approvedQuotations";
import {ArchivedQuotationPage} from "./archivedQuotations";
import {DraftedQuotationPage} from "./draftedQuotations";
import {SubmittedQuotationPage} from "./submittedQuotations";
import {QuotationService} from "../service/quotationService";

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
    approvedQuotationpage:ApprovedQuotationPage;
    archivedQuotationPage:ArchivedQuotationPage;
    draftedQuotationsPage:DraftedQuotationPage;
    submittedQuotationsPage:SubmittedQuotationPage;

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService, private quotationService: QuotationService,public events:Events) {
      this.draftedQuotationsCount= 0;
      this.approvedQuotationsCount=0;
      this.submittedQuotationsCount=0;
      this.archivedQuotationsCount=0;
      this.getQuotations();
      this.draftedQuotations=[];
      this.approvedQuotations=[];
      this.submittedQuotations=[];
      this.archivedQuotations=[];

      this.events.subscribe('permissions:set',(permission)=>{
          console.log("Event permissions");
          console.log(permission)
      })
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(QuotationPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  quotationView()
  {
    this.navCtrl.setRoot(QuotationPage)

  }

  gotoApprovedQuotation(){
      this.navCtrl.push(ApprovedQuotationPage,{'quotations':this.approvedQuotations});
  }

  gotoArchivedQuotation(){
       this.navCtrl.push(ArchivedQuotationPage,{'quotations':this.archivedQuotations});
  }

  gotoSubmittedQuotation(){
      this.navCtrl.push(SubmittedQuotationPage,{'quotations':this.submittedQuotations});
  }
  gotoDraftedQuotation(){
      this.navCtrl.push(DraftedQuotationPage,{'quotations':this.draftedQuotations});
  }

  getQuotations(){
      this.quotationService.getQuotations(window.localStorage.getItem('employeeId')).subscribe(
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
                      this.draftedQuotations.push(this.quotations[i]);
                  }else if(this.quotations[i].isArchived == true){
                      console.log("archived");
                      console.log(this.quotations[i].isArchived)
                      this.archivedQuotations.push(this.quotations[i]);
                      this.archivedQuotationsCount++;
                  }else if(this.quotations[i].isApproved == true){
                      console.log("approved");
                      console.log(this.quotations[i].isApproved)
                      this.approvedQuotations.push(this.quotations[i]);
                      this.approvedQuotationsCount++;
                  }else if(this.quotations[i].isSubmitted == true){
                      console.log("submitted");
                      console.log(this.quotations[i].isSubmitted)
                      this.submittedQuotations.push(this.quotations[i]);
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
