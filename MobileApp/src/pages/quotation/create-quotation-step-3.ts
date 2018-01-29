import {Component, ViewChild} from '@angular/core';
import {
    AlertController, Events, ModalController, NavController, NavParams, PopoverController,
    Select
} from 'ionic-angular';
import {authService} from "../service/authService";
import {QuotationPopoverPage} from "./quotation-popover";

@Component({
    selector: 'page-create-quotation-step3',
    templateUrl: 'create-quotation-step-3.html'
})
export class CreateQuotationPage3 {
    quotation:any;
    rate:any

    constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams:NavParams,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController) {
        this.quotation=this.navParams.get('quotation');
        this.rate=this.navParams.get('rate');
    }

    ionViewWillEnter(){

    }



}
