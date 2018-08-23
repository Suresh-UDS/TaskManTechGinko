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

    userId:any;
    employeeId: any;
    sites:any;
    msg:any;

    fakeUsers: Array<any> = new Array(12);

    constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

    }

    ionViewDidLoad() {
        this.isLoading=true;
        this.employeeId=window.localStorage.getItem('employeeId');
        console.log('ionViewDidLoad SitePage');
        // this.component.showLoader('Getting All Sites');
        this.searchSites();
    }

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

