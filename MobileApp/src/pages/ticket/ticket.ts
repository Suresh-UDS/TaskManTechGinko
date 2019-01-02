import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from "ionic-angular";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";
import {CreateTicket} from "./create-ticket";
import {ViewTicket} from "./view-ticket";
import{TicketFilter} from "./ticket-filter/ticket-filter";


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
    clientFilter:any;
    siteFilter:any;
  fromDate:any;
  toDate:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cs:componentService, private jobService:JobService, public modalCtrl:ModalController) {
      this.tickets = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Ticket');
    this.cs.showLoader('Loading Tickets..');
    var searchCriteria={
        currPage:1
    };
    this.jobService.searchTickets(searchCriteria).subscribe(
        response=>{
            this.cs.closeLoader();
            console.log("Getting tickets");
            console.log(response);
            this.tickets=response.transactions;

        },error=>{
            this.cs.closeLoader();
            console.log(error);
        }
    )
  }

  createTicket(){
      this.navCtrl.push(CreateTicket);
  }

    viewTicket(ticket){
      this.navCtrl.push(ViewTicket,{ticket:ticket});
    }

    presentModal() {
        let modal = this.modalCtrl.create(TicketFilter,{},{cssClass:'asset-filter',showBackdrop:true});
        modal.onDidDismiss(data=>{
            console.log("Modal Dismiss");
            console.log(data);
            this.clientFilter=data.project;
            this.siteFilter=data.site;
            this.fromDate = data.fromDate;
            this.toDate = data.toDate;
            this.applyFilter(data.project,data.site,data.fromDate,data.toDate);
        });
        modal.present();
    }


    applyFilter(project,site,fromDate,toDate){
        this.cs.showLoader("");
        var searchCriteria={
            siteId:site.id,
            projectId:project.id,
          fromDate:fromDate,
          toDate:toDate
        };

        console.log("filter",searchCriteria);

        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.cs.closeAll();
                this.cs.closeLoader();
                console.log("Filtering Tickets");
                console.log(response);
                this.tickets=response.transactions;
            },error=>{
              this.cs.closeLoader();
                this.cs.closeAll();
                console.log("Error in filtering tickets");
                console.log(error);
            }
        )

    }

}
