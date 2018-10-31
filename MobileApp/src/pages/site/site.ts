import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteViewPage} from "./site-view";
import {SiteService} from "../service/siteService";

@Component({
    selector: 'page-site',
    templateUrl: 'site.html'
})
export class SitePage {

    isLoading:boolean;
<<<<<<< HEAD

    userId:any;
    employeeId: any;
    sites:any;
    msg:any;
=======

  userId:any;
  employeeId: any;
  sites:any;
  msg:any;

    fakeUsers: Array<any> = new Array(12);

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {
>>>>>>> Release-2.0-Inventory

    fakeUsers: Array<any> = new Array(12);

<<<<<<< HEAD
    constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

    }

    ionViewDidLoad() {
        this.isLoading=true;
        this.employeeId=window.localStorage.getItem('employeeId');
        console.log('ionViewDidLoad SitePage');
        // this.component.showLoader('Getting All Sites');
        this.searchSites();
    }
=======
  ionViewDidLoad() {
      this.isLoading=true;
    this.employeeId=window.localStorage.getItem('employeeId');
    console.log('ionViewDidLoad SitePage');
    // this.component.showLoader('Getting All Sites');
    this.siteService.searchSite().subscribe(
      response=>{
          this.isLoading=false;
        console.log('ionViewDidLoad SitePage:');

        console.log(response.json()
        );
        this.sites=response.json();
          // this.component.closeLoader();
      },
      error=>{
        console.log('ionViewDidLoad SitePage:'+error);
          // this.component.closeLoader();
          if(error.type==3)
          {
              this.msg='Server Unreachable'
          }

          this.component.showToastMessage(this.msg,'bottom');
      }
    )
  }
>>>>>>> Release-2.0-Inventory

    viewSite(site)
    {
        console.log('ionViewDidLoad site method:');
        console.log(site);
        this.navCtrl.push(SiteViewPage,{site:site});
    }

    searchSites(){
        var searchCriteria = {
            findAll:true,
            currPage:1,
            sort:10,
            sortByAsc:true,
            report:true
        };

        this.siteService.searchSites(searchCriteria).subscribe(
            response=>{
                this.sites=response.transactions;
                this.isLoading=false;
                this.component.closeLoader();
            },
            error=> {
                console.log('ionViewDidLoad SitePage:' + error);
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }

                this.component.showToastMessage(this.msg,'bottom');

            }
        );
    }

}

