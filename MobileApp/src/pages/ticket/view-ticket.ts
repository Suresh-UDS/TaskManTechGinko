import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {Ticket} from "./ticket";
import {CreateJobPage} from "../jobs/add-job";


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
  constructor(public navCtrl: NavController, public navParams: NavParams,private cs:componentService, private jobService:JobService) {
    this.ticketDetails = this.navParams.data.ticket;
    this.ticketDetails.status = "Closed";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTicket');
    console.log(this.ticketDetails);
  }

    closeTicket(){
      this.cs.showLoader("Closing Job");
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
