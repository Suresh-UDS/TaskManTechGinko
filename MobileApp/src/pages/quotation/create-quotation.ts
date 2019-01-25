import { Component } from '@angular/core';
import {AlertController, Events, NavController, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CreateQuotationPage2} from "./create-quotation-step-2";
import {SiteService} from "../service/siteService";
import {QuotationService} from "../service/quotationService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {JobPopoverPage} from "../jobs/job-popover";
import {QuotationImagePopoverPage} from "./quotation-image-popover";

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
                cost:any;
                number:any;
            }
            ]
    };

    title:any;
    description:any;
    rateCardType:any;
    rateCardUom:any;
    rateCardName:any;
    rateCardCost:any;
    takenImages:any;
    uom:any;

    empSelect:any;

    allSites:any;
    siteEmployees:any;
    rateCardTypes:any;

    selectedSite:any;

    showRateInformation:any;
    eMsg:any;


    constructor(public navCtrl: NavController,public camera: Camera,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController,
                private siteService: SiteService, private quotationService: QuotationService) {

        this.takenImages = [];
        this.quotationDetails ={
            title:'',
            description:'',
            rateCard:[
                {
                    type:'',
                    uom:'',
                    name:'',
                    cost:'',
                    number:''
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
        this.siteService.searchSite().subscribe(response=>{
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
        this.siteService.searchSiteEmployee(siteId).subscribe(response=>{
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
            this.eMsg="title";
        }


    }

    getRateCardTypes(){
        this.quotationService.getRateCardTypes().subscribe(response=>{
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
            cost:'',
            number:''
        };

        rateCard.type = type.name;
        rateCard.uom = type.uom;
        this.quotationDetails.rateCard.push(rateCard);
        console.log(this.quotationDetails);
    }

    viewImage(index,img)
    {
        let popover = this.popoverCtrl.create(QuotationImagePopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:true});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {
            this.takenImages.pop(data);
        })
    }
    viewCamera() {

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.NATIVE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {

            console.log('imageData -' +imageData);
            imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")

            this.takenImages.push(imageData);


        })

    }


}
