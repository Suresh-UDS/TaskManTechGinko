import {Component, ViewChild} from '@angular/core';
import {
    AlertController, Events, ModalController, NavController, NavParams, PopoverController,
    Select
} from 'ionic-angular';
import {authService} from "../service/authService";
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage3} from "./create-quotation-step-3";
import {QuotationPage} from "./quotation";
import {componentService} from "../service/componentService";

@Component({
    selector: 'page-create-quotation-step2',
    templateUrl: 'create-quotation-step-2.html'
})
export class CreateQuotationPage2 {
    title:any;
    description:any;
    rateCardType:any;
    uom:any;
    val=0;
    index:any;
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
    grandTotal=0;

    constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams:NavParams,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController, public componentService:componentService) {

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
            this.grandTotal=this.grandTotal+data.total;
            console.log(this.rates);
        })
    }

    remove(index)
    {
        console.log(this.grandTotal);
        this.grandTotal=this.grandTotal-this.rates[index].total;
        console.log(this.grandTotal);
        this.rates.pop(index);

    }
    addTotal(i,no,cost)
    {
        this.index=i;
        console.log("add total");
        this.grandTotal = Math.abs(this.grandTotal-this.rates[i].total);
        this.rates[i].total=no*cost;
        console.log(this.rates[i].total);
        console.log(no+" * "+cost );
        console.log(this.grandTotal);
        this.grandTotal =this.grandTotal+this.rates[i].total ;
        console.log("add total-------:"+this.grandTotal);

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
            "siteName":this.selectedSite.name,
            "grandTotal":this.grandTotal,
            "isDrafted":true
        };

        this.authService.createQuotation(quotationDetails).subscribe(
            response=>{
                console.log(response);
                this.componentService.showToastMessage('Quotation Successfully Drafted');
                this.navCtrl.push(QuotationPage);

            },err=>{
                this.componentService.showToastMessage('Error in drafting quotation, your changes cannot be saved!');
            }
        )


        // this.navCtrl.push(CreateQuotationPage3,{rate:this.rates,quotation:this.quotation,site:this.selectedSite})
    }

    sendQuotation(){

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
            "siteName":this.selectedSite.name,
            "grandTotal":this.grandTotal,
            "isSubmitted":true
        };

        this.authService.editQuotation(quotationDetails).subscribe(
            response=>{
                console.log(response);


            }
        )

    }

}
