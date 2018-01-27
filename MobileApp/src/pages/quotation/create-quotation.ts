import { Component } from '@angular/core';
import {Events, NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";

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

    rateCardType:any;
    uom:any;

    allSites:any;
    siteEmployees:any;
    rateCardTypes:any;

    selectedSite:any;

    step: any;
    stepCondition: any;
    stepDefaultCondition: any;
    currentStep: any;
    showRateInformation:any;

    constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public evts: Events, public authService:authService) {

    // Step Wizard Settings
        this.step = 1;//The value of the first step, always 1
        this.stepCondition = false;//Set to true if you don't need condition in every step
        this.stepDefaultCondition = this.stepCondition;//Save the default condition for every step
        //You can subscribe to the Event 'step:changed' to handle the current step
        this.evts.subscribe('step:changed', step => {
            //Handle the current step if you need
            this.currentStep = step[0];
            //Set the step condition to the default value
            this.stepCondition = this.stepDefaultCondition;
        });
        this.evts.subscribe('step:next', () => {
            //Do something if next
            console.log('Next pressed: ', this.currentStep);
        });
        this.evts.subscribe('step:back', () => {
            //Do something if back
            console.log('Back pressed: ', this.currentStep);
        });

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
        this.authService.createQuotation(quotation).subscribe(response=>{
            console.log(response);
        })
    }

    getRateCardTypes(){
        this.authService.getRateCardTypes().subscribe(response=>{
            this.rateCardTypes = response;
        })
    }

    showAdd(type){
        this.showRateInformation = true;
        this.rateCardType = type.title;
        this.uom = type.uom;
    }



}
