import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {SiteViewPage} from "../site-view/site-view";
import {componentService} from "../service/componentService";

@Component({
  selector: 'page-site',
  templateUrl: 'site.html'
})
export class SitePage {

  userId:any;
  employeeId: any;
  sites:any;


  constructor(public navCtrl: NavController,public myService:authService,public component:componentService) {

  }

  ionViewDidLoad() {
    this.employeeId=window.localStorage.getItem('employeeId');
    console.log('ionViewDidLoad SitePage');
    this.component.showLoader('Getting All Sites');
    this.myService.searchSite().subscribe(
      response=>{
        console.log('ionViewDidLoad SitePage:');

        console.log(response.json()
        );
        this.sites=response.json();
          this.component.closeLoader();
      },
      error=>{
        console.log('ionViewDidLoad SitePage:'+error);
      }
    )
  }

    viewSite(site)
    {
        console.log('ionViewDidLoad site method:');
        console.log(site);
        this.navCtrl.push(SiteViewPage,{site:site});
    }

}
