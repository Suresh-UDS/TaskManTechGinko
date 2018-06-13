import { Component } from '@angular/core';
import {NavController, NavParams, Popover, PopoverController} from "ionic-angular";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {Ticket} from "./ticket";
import {CreateJobPage} from "../jobs/add-job";
import {QuotationImagePopoverPage} from "../quotation/quotation-image-popover";


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
  constructor(public navCtrl: NavController, public navParams: NavParams,private cs:componentService, private jobService:JobService,private popoverCtrl:PopoverController) {
    // this.ticketDetails = this.navParams.data.ticket;
      console.log(this.navParams.data.ticket);
      this.ticketDetails ={};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTicket');
    // console.log(this.ticketDetails);
    this.getTicketDetails(this.navParams.data.ticket);
  }

  getTicketDetails(ticketDetails){
      this.jobService.getTicketDetails(ticketDetails.id).subscribe(
          response=>{
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
      )
  }

    closeTicket(){
      this.cs.showLoader("Closing Job");
      this.ticketDetails.status = "Closed";
      this.jobService.updateTicket(this.ticketDetails).subscribe(
          response=>{
              console.log(response);
              this.cs.closeLoader();
              this.cs.showToastMessage('You have closed this ticket','bottom');
              this.navCtrl.setRoot(Ticket);
          },error=>{
              this.cs.closeLoader();
              this.cs.showToastMessage('Error in closing ticket','bottom');
          }
      )
    }

    createJob(){
        this.navCtrl.push(CreateJobPage,{ticketDetails:this.ticketDetails});
    }


}
