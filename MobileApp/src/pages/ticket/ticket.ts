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
<<<<<<< HEAD
    clientFilter:any;
    siteFilter:any;
=======
    spinner:boolean;
>>>>>>> Release-2.0-Inventory
  constructor(public navCtrl: NavController, public navParams: NavParams, private cs:componentService, private jobService:JobService, public modalCtrl:ModalController) {
      this.tickets = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Ticket');
    this.spinner=true;
    // this.cs.showLoader('Loading Tickets..');
    var searchCriteria={
        currPage:1
    };
    this.jobService.searchTickets(searchCriteria).subscribe(
        response=>{
<<<<<<< HEAD
            this.cs.closeLoader();
            console.log("Getting tickets");
            console.log(response);
            this.tickets=response.transactions;

        },error=>{
            this.cs.closeLoader();
            console.log(error);
=======
            this.spinner=false;
            console.log("Getting tickets");
            console.log(response);
            this.tickets=response.transactions;
            // this.cs.closeLoader();
        },error=>{
            this.spinner=false;
            console.log(error);
            // this.cs.closeLoader();
>>>>>>> Release-2.0-Inventory
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
            this.applyFilter(data.project,data.site);
        });
        modal.present();
    }


    applyFilter(project,site){
        this.cs.showLoader("");
        var searchCriteria={
            siteId:site.id,
            projectId:project.id,
        };

        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.cs.closeAll();
                console.log("Filtering Tickets");
                console.log(response);
                this.tickets=response.transactions;
            },error=>{
                this.cs.closeAll();
                console.log("Error in filtering tickets");
                console.log(error);
            }
        )

    }

}
