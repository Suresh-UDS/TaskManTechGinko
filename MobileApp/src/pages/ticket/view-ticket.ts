import { Component } from '@angular/core';
import {NavController, NavParams, Popover, PopoverController} from "ionic-angular";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {Ticket} from "./ticket";
import {CreateJobPage} from "../jobs/add-job";
import {QuotationImagePopoverPage} from "../quotation/quotation-image-popover";
import{ViewJobPage} from "../jobs/view-job";
import{AlertController} from "ionic-angular";

declare var demo;


/**
 * Generated class for the ViewTicket page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-ticket',
  templateUrl: 'view-ticket.html',
})
export class ViewTicket {

  ticketDetails:any;
  ticketImage:any;
  remarks:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private cs:componentService,
              private jobService:JobService,private popoverCtrl:PopoverController,private alertCtrl:AlertController) {
    // this.ticketDetails = this.navParams.data.ticket;
      console.log("ticket");
      console.log(this.navParams.data.ticket);
      this.ticketDetails ={};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTicket');
    // console.log(this.ticketDetails);
    this.getTicketDetails(this.navParams.data.ticket);
  }

  getTicketDetails(ticketDetails){
      this.cs.showLoader("Getting Ticket Details");
      this.jobService.getTicketDetails(ticketDetails.id).subscribe(
          response=>{
              if(response.errorStatus){
                  this.cs.closeAll();
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
              }else{
                  this.cs.closeAll();
                  console.log(response);
                  this.ticketDetails = response;
                  if(this.ticketDetails.image){
                      this.jobService.getTicketImages(response.id,response.image).subscribe(
                          response=>{
                              console.log(response);
                              this.ticketImage = response._body;
                          }
                      )
                  }
              }

          }
      )
  }

    closeTicket(){
      this.cs.showLoader("Closing Job");
      this.ticketDetails.status = "Closed";
      this.ticketDetails.remarks=this.remarks;
      this.jobService.updateTicket(this.ticketDetails).subscribe(
          response=>{
              if(response.errorStatus){
                  this.cs.closeAll();
                  demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
              }else{
                  console.log(response);
                  this.cs.closeLoader();
                  this.cs.showToastMessage('You have closed this ticket','bottom');
                  this.navCtrl.setRoot(Ticket);
              }

          },error=>{
              this.cs.closeLoader();
              this.cs.showToastMessage('Error in closing ticket','bottom');
          }
      )
    }

    createJob(){
        this.navCtrl.push(CreateJobPage,{ticketDetails:this.ticketDetails});
    }


    viewJob(ticketDetails){
            var jobDetails={
                id:ticketDetails.jobId,
                ticketId:ticketDetails.id
            }
            this.navCtrl.push(ViewJobPage,{job:jobDetails});
    }


    presentPrompt() {
        let alert = this.alertCtrl.create({
            title: 'Remarks',
            inputs: [
                {
                    name: 'Remarks',
                    placeholder: 'Remarks here...'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'ok',
                    handler: data => {
                        console.log("Remarks Data");
                        console.log(data);
                        this.remarks=data.Remarks;
                        this.closeTicket();
                    }
                }
            ]
        });
        alert.present();
    }


}
