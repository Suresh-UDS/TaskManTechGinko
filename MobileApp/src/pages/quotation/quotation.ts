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
import {SiteService} from "../service/siteService";

declare var demo;

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage {
  siteActive: boolean;
  index: any;

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

    allProjects:any;
    selectedProject:any;
    selectedSite:any;
    sites:any;
    page:1;
    pageSort:15;
  projectActive: any;
  projectindex: any;
  chooseClient = true;
  siteSpinner = false;
  showSites = false;
  empSpinner=false;
  chooseSite=true;
  showEmployees=false;

  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, private authService: authService,
              private quotationService: QuotationService,public events:Events,public siteService:SiteService) {
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
    this.draftedQuotationsCount= 0;
    this.approvedQuotationsCount=0;
    this.submittedQuotationsCount=0;
    this.archivedQuotationsCount=0;
    this.draftedQuotations=[];
    this.approvedQuotations=[];
    this.submittedQuotations=[];
    this.archivedQuotations=[];
      var searchCriteria={
         currPage:this.page,
          pageSort:this.pageSort

      };
      this.quotationService.getQuotations(searchCriteria).subscribe(
          response=>{
              if(response.errorStatus){
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  console.log(response);

                  this.quotations=[];
                  this.quotations = response;
                  console.log(this.quotations)
                  for(var i=0; i<this.quotations.length;i++){
                      if(this.quotations[i].status=="pending"){
                          console.log("drafted");
                          console.log(this.quotations[i].status)
                          this.draftedQuotationsCount =0;
                          this.draftedQuotationsCount++;
                          this.draftedQuotations = [];
                          this.draftedQuotations.push(this.quotations[i]);
                      }else if(this.quotations[i].status == "approved" || this.quotations[i].status == "rejected"){
                          console.log("approved");
                          console.log(this.quotations[i].isApproved)
                          this.approvedQuotations = [];
                          this.approvedQuotations.push(this.quotations[i]);
                          this.approvedQuotationsCount = 0;
                          this.approvedQuotationsCount++;
                      }else if(this.quotations[i].status == "Waiting for approval"){
                          console.log("submitted");
                          console.log(this.quotations[i].status)
                          this.submittedQuotations = [];
                          this.submittedQuotations.push(this.quotations[i]);
                          this.submittedQuotationsCount = 0;
                          this.submittedQuotationsCount++;
                      }else{
                          console.log("all false");
                          console.log(this.quotations[i].isDrafted)
                      }
                  }
              }

          }
      )
  }


  createQuotation(){
      this.navCtrl.push(CreateQuotationPage);
  }

  createPDF(){
      this.quotationService.createPDF().subscribe(
          response=>
          {
              if(response.errorStatus){
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  console.log("PDF")
                  console.log(response)
              }

          },
          error=>
          {
              console.log("PDF ERROR")
              console.log(error)
          })

  }

  ionViewDidLoad(){
      this.getProjects();
  }

  getProjects(){
      this.siteService.getAllProjects().subscribe(
          response=>{
              if(response.errorStatus){
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  this.allProjects = response;
                  this.selectedProject = response[0];
                  // this.getSites(this.selectedProject.id[0]);
              }

          }
      )
  }

  getSites(projectId,i){
    this.projectActive = true;
    this.projectindex = i;
    this.siteSpinner=true;
    this.chooseClient = false;
    this.showSites = false;

    this.siteService.findSites(projectId).subscribe(
          response=>{
              if(response.errorStatus){
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                this.siteSpinner=false;
                this.showSites = true;
                this.showEmployees=false;
                this.chooseSite = true;
                  console.log(response);
                  this.sites = response;
                  this.selectedSite = response[1];
              }

          }
      )
  }

  searchQuotations(siteId,i){
    this.draftedQuotationsCount= 0;
    this.approvedQuotationsCount=0;
    this.submittedQuotationsCount=0;
    this.archivedQuotationsCount=0;
    this.draftedQuotations=[];
    this.approvedQuotations=[];
    this.submittedQuotations=[];
    this.archivedQuotations=[];
    this.index = i;
    this.projectActive = true;
    this.siteActive = true;
    console.log("siteId",siteId);
      this.quotationService.searchQuotations({siteId:siteId}).subscribe(
          response=>{
              if(response.errorStatus){
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
              }else{
                  console.log(response);

                  this.quotations=[];
                  this.quotations = response;
                  console.log(this.quotations);
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


          }
      )
  }


}
