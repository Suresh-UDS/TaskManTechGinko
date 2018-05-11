import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {SiteService} from "../service/siteService";
import {JobService} from "../service/jobService";
import {Ticket} from "./ticket";
import {componentService} from "../service/componentService";
import {EmployeeService} from "../service/employeeService";


/**
 * Generated class for the CreateTicket page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-ticket',
  templateUrl: 'create-ticket.html',
})
export class CreateTicket {

    sites:any;
    private title: any;
    private description: any;
    private siteName: any;
    private employ: any;
    private eMsg: any;
    private siteId: any;
    private userId: any;
    private newTicket: any;
    private comments: any;
    private msg: any;
    private field: any;
    private empPlace: any;
    private empSelect: any;
    private employee: any;
    private severities: any;
    private severity: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public siteService:SiteService, public jobService:JobService, public cs:componentService, public employeeService:EmployeeService) {
      this.sites=[];
      this.employee=[];
      this.severities = ['Low','Medium','High'];
      this.severity = this.severities[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTicket');
    this.getSites();

  }

  getSites(){
      var search={
          currPage:1
      };
      this.cs.showLoader('Loading Sites..');
      this.siteService.searchSite().subscribe(
          response=>{
              this.sites = response.json();
              this.cs.closeLoader();
          },error=>{
              this.cs.closeLoader();
          }
      )
  }

    getEmployee(id)
    {
        if(id)
        {
            console.log('ionViewDidLoad Add jobs employee');

            window.localStorage.setItem('site',id);
            console.log(this.empSelect);
            var searchCriteria = {
                currPage : 1,
                siteId:id
            };
            this.employeeService.searchEmployees(searchCriteria).subscribe(
                response=> {
                    console.log(response);
                    if(response.transactions!==0)
                    {
                        this.empSelect=false;
                        this.empPlace="Employee";
                        this.employee=response.transactions;
                        console.log(this.employee);
                    }
                    else
                    {
                        this.empSelect=true;
                        this.empPlace="No Employee";
                        this.employee=[]
                    }
                },
                error=>{
                    console.log(error);
                    console.log(this.employee);
            })

        }
        else
        {
            this.employee=[];
        }
    }

  createTicket(){
          if(this.title && this.description && this.siteName && this.employ )
          {
              this.eMsg="";
              this.siteId=window.localStorage.getItem('site')
              console.log( this.siteId);
              this.userId=localStorage.getItem('employeeUserId')
              this.newTicket={
                  "title":this.title,
                  "description":this.description,
                  "comments":this.comments,
                  "siteId":this.siteId,
                  "employeeId":this.employ,
                  "userId":this.userId,
                  "severity":this.severity,

              }


              this.jobService.createTicket(this.newTicket).subscribe(
                  response=> {
                      console.log(response);
                      this.navCtrl.setRoot(Ticket);
                  },
                  error=>{
                      console.log(error);
                      if(error.type==3)
                      {
                          this.msg='Server Unreachable'
                      }

                      this.cs.showToastMessage(this.msg,'bottom');
                  }
              )
          }
          else
          {
              console.log("============else");

              if(!this.title)
              {
                  console.log("============title");
                  this.eMsg="title";
                  this.field="title";
              }
              else if(!this.description)
              {
                  console.log("============desc");
                  this.eMsg="description";
                  this.field="description";
              }
              else if(!this.siteName)
              {
                  console.log("============site");
                  this.eMsg="siteName";
                  this.field="siteName";
              }
              else if(!this.employ && this.empPlace=="Employee")
              {
                  console.log("============employ");
                  this.eMsg="employ";
                  this.field="employ";
              }

              else if(!this.title && !this.description && !this.siteName && !this.employ )
              {
                  console.log("============all");
                  this.eMsg="all";
              }

          }
  }

}
