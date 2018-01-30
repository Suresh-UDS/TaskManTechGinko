import {Component, ViewChild} from '@angular/core';
import {
    AlertController, Events, ModalController, NavController, NavParams, PopoverController,
    Select
} from 'ionic-angular';
import {authService} from "../service/authService";
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage3} from "./create-quotation-step-3";

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
    siteDetails:any;
    quotation:any;
    rates:any

    clientEmailId:any;
    sentByUserId:any;
    sentByUserName:any;
    sentToUserId:any;
    sentToUserName:any;
    createdByUserId:any;
    createdByUserName:any;
    approvedByUserId:any;
    approvedByUserName:any;
    authorisedByUserId:any;
    authorisedByUserName:any;
    constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams:NavParams,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController) {

       console.log(this.navParams.get('quotationDetails'));
       var quotationDetails = this.navParams.get('quotationDetails');
       this.quotation=this.navParams.get('quotationDetails');
        this.rateCardType = {};
        this.rates =[];
        this.showRateInformation=false;

        this.selectedSite=null;
        console.log(window.localStorage.getItem('employeeUserId'));
        console.log(window.localStorage.getItem('employeeId'));
        console.log(window.localStorage.getItem('employeeFullName'));
        var employeeDetails = JSON.parse(window.localStorage.getItem('employeeDetails'));
        this.sentByUserId = employeeDetails.employee.id;
        this.sentByUserName = employeeDetails.employee.fullName;

    }

    selectSite(site){
        this.selectedSite = site;
        this.authService.getClientDetails(site.id).subscribe(
            response=>{
                console.log(response);
                this.sentToUserId = response.id;
                this.sentToUserName = response.name;
                this.clientEmailId = response.email;
            }
        )
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

    addRates(eve) {
        let popover = this.popoverCtrl.create(QuotationPopoverPage);
        popover.present({
            ev:eve
        });

        popover.onDidDismiss(data=>
        {
            this.rates.push(data);
            console.log(this.rates);
        })
    }

    remove(index)
    {
        this.rates.pop(index)
    }

    saveRates()
    {
        var quotationDetails = {
            "title":this.quotation.title,
            "description":this.quotation.description,
            "rateCardDetails":this.rates,
            "sentByUserId":this.sentByUserId,
            "sentByUserName":this.sentByUserName,
            "sentToUserId":this.sentToUserId,
            "sentToUserName":this.sentToUserName,
            "createdByUserId":this.sentByUserId,
            "createdByUserName":this.sentByUserName,
            "clientEmailId": this.clientEmailId,
            "siteId":this.selectedSite.id,
            "siteName":this.selectedSite.name
        }

        this.authService.createQuotation(quotationDetails).subscribe(
            response=>{
                console.log(response);

            }
        )


        // this.navCtrl.push(CreateQuotationPage3,{rate:this.rates,quotation:this.quotation,site:this.selectedSite})
    }

}
