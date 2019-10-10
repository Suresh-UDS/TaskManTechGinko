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
  searchCriteria:any;
  page:1;
  totalPages:0;
  pageSort:15;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cs:componentService, private jobService:JobService, public modalCtrl:ModalController) {
      this.tickets = [];
      this.fromDate = new Date();
      this.toDate = new Date();
      this.searchCriteria = {
          siteId:0,
          projectId:0,
          fromDate:this.fromDate,
          toDate : this.toDate,
          employeeId:0,
          currPage:1,
          sortByAsc:true,
          sort:10,
          report:true
      }
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
            this.page = response.currPage;
            this.totalPages = response.totalPages;

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
        var projectDetails = null;
        var siteDetails = null;
        let modal = this.modalCtrl.create(TicketFilter,{},{cssClass:'asset-filter',showBackdrop:true});
        modal.onDidDismiss(searchCriteria=>{
            console.log("Search criteria jobs");
            console.log(searchCriteria);
            if(searchCriteria){
                this.applyFilter(searchCriteria);
            }
            
        });
        modal.present();
    }


    applyFilter(searchCriteria){
        this.cs.showLoader("Applying Filter");
        console.log("filter",searchCriteria);
        this.tickets = [];
        this.cs.showLoader("Loading Tickets..");
        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.cs.closeAll();
                this.cs.closeLoader();
                console.log("Filtering Tickets");
                console.log(response);
                this.tickets=response.transactions;
                this.page = response.currPage;
                this.totalPages = response.totalPages;
            },error=>{
              this.cs.closeLoader();
                this.cs.closeAll();
                console.log("Error in filtering tickets");
                console.log(error);
            }
        )

    }

    doInfiniteAllJobs(infiniteScroll){
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        this.searchCriteria.currPage= this.page+1;

        this.jobService.searchTickets(this.searchCriteria).subscribe(
            response=>{
                console.log("Filtering Tickets");
                console.log(response);
                for(var i=0;i<response.transactions.length;i++){
                    this.tickets.push(response.transactions[i]);
                }
                this.page = response.currPage;
                this.totalPages = response.totalPages;
            },error=>{
                console.log("Error in filtering tickets");
                console.log(error);
            }
        )

    }

}
