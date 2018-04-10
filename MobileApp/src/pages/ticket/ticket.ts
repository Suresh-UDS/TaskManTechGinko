import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {CreateTicket} from "./create-ticket";
import {ViewTicket} from "./view-ticket";


/**
 * Generated class for the Ticket page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class Ticket {

    tickets:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cs:componentService, private jobService:JobService) {
      this.tickets = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Ticket');
    this.cs.showLoader('Loading Tickets..');
    var searchCriteria={
        currPage:1
    }
    this.jobService.searchTickets(searchCriteria).subscribe(
        response=>{
            console.log("Getting tickets");
            console.log(response);
            this.tickets=response;
            this.cs.closeLoader();
        },error=>{
            this.cs.closeLoader();
        }
    )
  }

  createTicket(){
      this.navCtrl.push(CreateTicket);
  }

    viewTicket(ticket){
      this.navCtrl.push(ViewTicket,{ticket:ticket});
    }

}
