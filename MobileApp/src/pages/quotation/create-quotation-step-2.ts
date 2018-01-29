import { Component } from '@angular/core';
import {AlertController, Events, NavController, NavParams, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";

@Component({
    selector: 'page-create-quotation-step2',
    templateUrl: 'create-quotation-step-2.html'
})
export class CreateQuotationPage2 {

   title:any;
   description:any;
    rateCardType:any;
    uom:any;

    empSelect:any;

    allSites:any;
    siteEmployees:any;
    rateCardTypes:any;

    selectedSite:any;

    showRateInformation:any;

    constructor(public navCtrl: NavController,public navParams:NavParams,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController) {

       console.log(this.navParams.get('quotation'));
        this.rateCardType = {};

        this.showRateInformation=false;

        this.selectedSite=null;
        console.log(window.localStorage.getItem('employeeUserId'));
        console.log(window.localStorage.getItem('employeeId'));
        console.log(window.localStorage.getItem('employeeFullName'));

    }

    ionViewWillEnter(){
        this.authService.searchSite().subscribe(response=>{
            console.log(response.json());
            this.allSites = response.json();
        })

        this.getRateCardTypes();
    }

    getSiteEmployees(siteId){
        this.authService.searchSiteEmployee(siteId).subscribe(response=>{
            console.log(response.json());
            this.siteEmployees = response.json();
        })
    }

    saveQuotation(quotation){
        console.log(quotation)
        this.authService.createQuotation(quotation).subscribe(response=>{
            console.log(response);
        })
    }

    getRateCardTypes(){
        this.authService.getRateCardTypes().subscribe(response=>{
            console.log("Rate Card types");
            console.log(this.rateCardTypes);
            this.rateCardTypes = response;
        })
    }

    showAdd(type){
        this.showRateInformation = true;
        this.rateCardType = type.title;
        this.uom = type.uom;
    }

    selectUOMType(type){
        var rateCard = {
            type:'',
            uom:'',
            name:'',
            cost:''
        };

        rateCard.type = type.name;
        rateCard.uom = type.uom;
        // this.quotationDetails.rateCard.push(rateCard);
        // console.log(this.quotationDetails);
    }




}
