import { Component } from '@angular/core';
import {AlertController, Events, NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CreateQuotationPage2} from "./create-quotation-step-2";

@Component({
    selector: 'page-create-quotation',
    templateUrl: 'create-quotation.html'
})
export class CreateQuotationPage {

    quotationDetails:{
        title:any,
        description:any,
        rateCard:[
            {
                type:any,
                uom:any,
                name:any;
                cost:any
            }
            ]
    };

    title:any;
    description:any;
    rateCardType:any;
    rateCardUom:any;
    rateCardName:any;
    rateCardCost:any;

    uom:any;

    empSelect:any;

    allSites:any;
    siteEmployees:any;
    rateCardTypes:any;

    selectedSite:any;

    showRateInformation:any;
    errorMsg:any;


    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController) {

        this.quotationDetails ={
            title:'',
            description:'',
            rateCard:[
                {
                    type:'',
                    uom:'',
                    name:'',
                    cost:''
                }
            ]
        };
        this.rateCardType = {};

        this.showRateInformation=false;

        this.selectedSite=null;
        console.log(window.localStorage.getItem('employeeUserId'));
        console.log(window.localStorage.getItem('employeeId'));
        console.log(window.localStorage.getItem('employeeFullName'));



    }
    setFormValidation(id) {
        id.validate({
            errorPlacement: function(error, element) {
                element.closest('div').addClass('has-error');
            }
        });
    }
    ionViewWillEnter(){
        this.authService.searchSite().subscribe(response=>{
            console.log(response.json());
            this.allSites = response.json();
        })

        this.getRateCardTypes();
    }

    ionViewDidEnter(){
        console.log(document.getElementById('LoginValidation'));
        this.setFormValidation(document.getElementById('LoginValidation'));
    }

    getSiteEmployees(siteId){
        this.authService.searchSiteEmployee(siteId).subscribe(response=>{
            console.log(response.json());
            this.siteEmployees = response.json();
        })
    }

    saveQuotation(title,description){

        if(title)
        {
            var quotation = {
                "title":this.title,
                "description":this.description
            }
            console.log(quotation)
            this.navCtrl.push(CreateQuotationPage2,{quotationDetails:quotation});
        }
        else
        {
            this.errorMsg="Title Required";
        }


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
        this.quotationDetails.rateCard.push(rateCard);
        console.log(this.quotationDetails);
    }




}
