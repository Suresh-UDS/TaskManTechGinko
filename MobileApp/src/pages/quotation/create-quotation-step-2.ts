import {Component, Inject, ViewChild} from '@angular/core';
import {
    AlertController, Events, ModalController, NavController, NavParams, PopoverController,
    Select
} from 'ionic-angular';
import {authService} from "../service/authService";
import {QuotationPopoverPage} from "./quotation-popover";
import {CreateQuotationPage3} from "./create-quotation-step-3";
import {QuotationPage} from "./quotation";
import {componentService} from "../service/componentService";
import {QuotationService} from "../service/quotationService";
import {SiteService} from "../service/siteService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {QuotationImagePopoverPage} from "./quotation-image-popover";
import {FileTransferObject, FileTransfer, FileUploadOptions} from "@ionic-native/file-transfer";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
declare var demo;


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
    siteDetails:any;
    showRateInformation:any;
    quotation:any;
    rates:any;

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
    quotationDetails:any;
    selectOptions:any;
    takenImages:any;
    quotationImg:any;
    open=false;
    openSites:any;
    viewSiteName:any;
    selectSiteIndex:any;
    qty:any;


    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(public navCtrl: NavController,public camera: Camera,public modalCtrl: ModalController,public navParams:NavParams,public popoverCtrl: PopoverController, public evts: Events, public authService:authService, public alertCtrl: AlertController, public componentService:componentService,
                private quotationService: QuotationService, private siteService: SiteService,private transfer: FileTransfer,@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig
                ) {

        this.takenImages = [];
        this.quotationImg=this.navParams.get('quotationImg');
       console.log(this.navParams.get('quotationDetails'));
       var quotationDetails = this.navParams.get('quotationDetails');
       console.log("Quotation");
       console.log(this.navParams.get('quotationDetails'));
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

    ionViewDidLoad()
    {
        this.selectOptions={
            cssClass: 'selectbox-popover'
        }
    }

    selectSite(site){
        console.log("Selected Site");
        this.selectedSite = site;
        this.siteDetails = site;
        console.log(this.selectedSite);
        this.authService.getClientDetails(site.id).subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    console.log(response);
                    this.sentToUserId = response.id;
                    this.sentToUserName = response.name;
                    this.clientEmailId = response.email;
                }

            }
        )
    }

    ionViewWillEnter(){
        this.siteService.searchSite().subscribe(response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
                console.log(response);
                this.allSites = response;
                this.selectedSite=this.allSites[0].name;
                this.siteDetails= this.allSites[0];
            }

        })

        this.getRateCardTypes();
    }

    getSiteEmployees(siteId){
        this.siteService.searchSiteEmployee(siteId).subscribe(response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
                console.log(response);
                this.siteEmployees = response;
            }

        })
    }

    saveQuotation(quotation){
        console.log(quotation);
        this.quotationService.createQuotation(quotation).subscribe(response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
                console.log(response);
            }

        })
    }

    getRateCardTypes(){
        this.quotationService.getRateCardTypes().subscribe(response=>{
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
            }else{
                console.log("Rate Card types");
                console.log(this.rateCardTypes);
                this.rateCardTypes = response;
            }

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
        let popover = this.popoverCtrl.create(QuotationPopoverPage,{},{enableBackdropDismiss: false,cssClass:'quotation-popover' });
        popover.present({
            ev:eve
        });

        popover.onDidDismiss(data=>
        {
            console.log("Popover dismiss");
            if(data)
            {
                console.log("Grand total");
                this.rates.push(data);
                this.grandTotal=this.grandTotal+data.cost;
                console.log(this.rates);
            }
            else
            {
                console.log("error in grand total");
                console.log(data);
            }

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
        this.grandTotal = Math.abs(this.grandTotal-this.rates[i].cost);
        this.rates[i].cost=no*cost;
        console.log(this.rates[i].cost);
        console.log(no+" * "+cost );
        console.log(this.grandTotal);
        this.grandTotal =this.grandTotal+this.rates[i].cost ;
        console.log("add total-------:"+this.grandTotal);

    }


    saveRates(mode)
    {
        console.log("quotation");
        console.log(this.quotation);
        if(this.rates.length!=0)
        {

            if(this.siteDetails){
                console.log("Save quotation with site id");
                this.quotationDetails = {
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
                    "siteId":this.siteDetails.id,
                    "projectId":this.siteDetails.projectId,
                    "projectName":this.siteDetails.projectName,
                    "siteName":this.siteDetails.name,
                    "grandTotal":this.grandTotal,
                    "mode":mode
                };
                if(mode == 'submit'){
                    console.log(mode);
                    this.quotationDetails.submitted=true;
                    this.quotationDetails.isSubmitted=true;
                    this.quotationDetails.isDrafted=false;
                    this.quotationDetails.drafted=false;

                }else{
                    console.log(mode);
                    this.quotationDetails.drafted=true;
                    this.quotationDetails.isDrafted=true;
                    this.quotationDetails.submitted=false;
                    this.quotationDetails.isSubmitted=false;
                }

                this.saveQuotationDetails(this.quotationDetails);
            }else{
                console.log("Save Quotation without site id");


                this.quotationDetails = {
                    "title":this.quotation.title,
                    "description":this.quotation.description,
                    "rateCardDetails":this.rates,
                    "sentByUserId":this.sentByUserId,
                    "sentByUserName":this.sentByUserName,
                    "sentToUserId":this.sentToUserId,
                    "sentToUserName":this.sentToUserName,
                    "createdByUserId":this.sentByUserId,
                    "createdByUserName":this.sentByUserName,
                    "grandTotal":this.grandTotal,
                    "drafted":true
                };
                this.presentAlert(this.quotationDetails,'Save Without Selecting Site');
            }


        }
        else
        {
            demo.showSwal('basic','Add Quotation')

        }
    }

    submitQuotation()
    {
        if(this.rates.length!=0)
        {

            if(this.siteDetails){
                console.log("Save quotation with site id");
                this.quotationDetails = {
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
                    "siteId":this.siteDetails.id,
                    "projectId":this.siteDetails.projectId,
                    "projectName":this.siteDetails.projectName,
                    "siteName":this.siteDetails.name,
                    "grandTotal":this.grandTotal,
                    "drafted":true,
                    "mode":"submit"
                };

                this.saveQuotationDetails(this.quotationDetails)
            }else{
                console.log("Save Quotation without site id");


                this.quotationDetails = {
                    "title":this.quotation.title,
                    "description":this.quotation.description,
                    "rateCardDetails":this.rates,
                    "sentByUserId":this.sentByUserId,
                    "sentByUserName":this.sentByUserName,
                    "sentToUserId":this.sentToUserId,
                    "sentToUserName":this.sentToUserName,
                    "createdByUserId":this.sentByUserId,
                    "createdByUserName":this.sentByUserName,
                    "grandTotal":this.grandTotal,
                    "drafted":true
                };
                this.presentAlert(this.quotationDetails,'Save Without Selecting Site');
            }


        }
        else
        {
            demo.showSwal('basic','Add Quotation')

        }
    }

    saveQuotationDetails(quotationDetails)
    {
        console.log("Quotation Details");
        console.log(quotationDetails);
        console.log("selected site in save Rates");
        // console.log(this.selectedSite,quotationDetails.type);
        console.log("Before saving quotation");
        console.log(quotationDetails);
        this.quotationService.createQuotation(quotationDetails).subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    console.log(response);
                    if(this.takenImages.length>0){
                        for(let i in this.takenImages) {
                            console.log("image loop");
                            console.log(i);
                            console.log(this.takenImages[i]);
                            console.log(this.takenImages[i].file);
                            let token_header=window.localStorage.getItem('session');
                            let options: FileUploadOptions = {
                                fileKey: 'quotationFile',
                                fileName:response._id+'_quotation',
                                headers:{
                                    'X-Auth-Token':token_header
                                },
                                params:{
                                    quotationId:response._id,
                                }
                            };

                            this.fileTransfer.upload(this.takenImages[i], this.config.Url+'api/quotation/image/upload', options)
                                .then((data) => {
                                    console.log(data);
                                    var data_response = JSON.parse(data.response);
                                    console.log(data_response);
                                    console.log("image upload");
                                }, (err) => {
                                    console.log(err);
                                    console.log("image upload fail");
                                })

                        }
                    }

                    if(response.drafted){
                        this.componentService.showToastMessage('Quotation Successfully Drafted','bottom');
                    }else if(response.submitted){
                        this.componentService.showToastMessage('Quotation Submitted Sucessfully','bottom');
                    }
                    this.navCtrl.setRoot(QuotationPage);

                }
                },
               err=>{
                this.componentService.showToastMessage('Error in drafting quotation, your changes cannot be saved!','bottom');
                console.log(err);
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
            "isSubmitted":true,
            "mode":"create"
        };

        this.quotationService.editQuotation(quotationDetails).subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else{
                    console.log("Edit Quotation");
                    console.log(response);
                }

            },err=>{
                console.log("Error in edit quotation");
                console.log(err);
            }
        )

    }


    presentAlert(quotation,msg) {
        let alert = this.alertCtrl.create({
            message: msg,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.saveQuotationDetails(quotation)
                    }
                }
            ]
        });
        alert.present();
    }

    viewImage(index,img)
    {
        let popover = this.popoverCtrl.create(QuotationImagePopoverPage,{i:img,ind:index},{cssClass:''});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {
            // this.takenImages.pop(data);
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
            imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

            this.takenImages.push(imageData);


        })

    }
    viewSite(site,i)
    {
        console.log("Selecting site");
        console.log(site);
        console.log(i);
        this.selectedSite=site.name;
        this.siteDetails = site;
        this.openSites=true;
        this.selectSiteIndex=i;
    }


}
