import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {GetAssetReading} from "./get-asset-reading";
import {JobService} from "../service/jobService";

/**
 * Generated class for the AssetView page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-asset-view',
  templateUrl: 'asset-view.html',
})
export class AssetView {

  assetDetails:any;
  categories:any;
  tickets:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public jobService:JobService) {
    this.assetDetails = this.navParams.data.assetDetails;
    this.categories = 'details';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetView');

     this.tickets = [{
         assignedOn:"2018-05-22",
         assignedToName:"MADHURI R",
         comments:"CLOSE ASAP",
         createdBy:"388038",
         createdDate:"2018-05-22",
         description:"Issue with the Vaccum cup",
         employeeEmpId:"388038",
         employeeId:1715,
         employeeName:"MAKVANA DISHA",
         status:"Open",
         title:"Cleaner Issue",
     },{
         assignedOn:"2018-05-21",
         assignedToName:"MADHURI R",
         comments:"CLOSE ASAP",
         createdBy:"388038",
         createdDate:"2018-05-22",
         description:"No Power supply",
         employeeEmpId:"388038",
         employeeId:1715,
         employeeName:"MAKVANA DISHA",
         status:"Open",
         title:"Electrical ",
     }
     ]
  }

    getReadings(){
        this.navCtrl.push(GetAssetReading,{assetDetails:this.assetDetails});
    }



}
