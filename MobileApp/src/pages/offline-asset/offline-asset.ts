import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {FabContainer, Item, ItemSliding, ModalController, NavController, NavParams} from "ionic-angular";
// import {GetAssetReading} from "./get-asset-reading";
import {JobService} from "../service/jobService";
import {componentService} from "../service/componentService";
import {tick} from "@angular/core/testing";
import {ViewJobPage} from "../jobs/view-job";
import {CompleteJobPage} from "../jobs/completeJob";
import {ViewTicket} from "../ticket/view-ticket";
import {CreateTicket} from "../ticket/create-ticket";
import {Camera, CameraOptions} from "@ionic-native/camera";
import { DatePicker } from '@ionic-native/date-picker';
import {AssetService} from "../service/assetService";
import{CalenderPage} from "../calender-page/calender-page";
import {CreateJobPage} from "../jobs/add-job";
import {DBService} from "../service/dbService";
import {FileTransferObject, FileUploadOptions, FileTransfer} from "@ionic-native/file-transfer";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import{OfflineGetassetreadings} from "../offline-getassetreadings/offline-getassetreadings";
import {OfflineCompleteJob} from "../offline-complete-job/offline-complete-job";
import {DatabaseProvider} from "../../providers/database-provider";

/**
 * Generated class for the OfflineAsset page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-offline-asset',
  templateUrl: 'offline-asset.html',
})
export class OfflineAsset {
    assetDetails: any;
    categories: any;
    tickets: any;
    jobPage = 0;
    count: any;

    totalPages: 0;
    page: 1;


    fromDate: any;
    toDate: any;
    viewButton: any;
    searchCriteria: any;
    spinner: any;
    jobSearchCriteria: any;
    ticketSearchCriteria: any;
    readingSearchCriteria: any;
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(public dbService: DBService, public camera: Camera, @Inject(MY_CONFIG_TOKEN) private config: ApplicationConfig,
                private transfer: FileTransfer, private modalCtrl: ModalController, private datePicker: DatePicker,
                private componentService: componentService, public navCtrl: NavController, public navParams: NavParams,
                public jobService: JobService, public assetService: AssetService, public dbProvider: DatabaseProvider) {
        this.assetDetails = this.navParams.data.assetDetails;
        this.categories = 'details';
        this.spinner = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Offline AssetView');
        console.log(this.assetDetails);
        // this.componentService.showLoader("");

        this.searchCriteria = {
            assetId: this.assetDetails.id
        };

        this.jobSearchCriteria = {
            assetId: this.assetDetails.id
        };

        this.ticketSearchCriteria = {
            assetId: this.assetDetails.id
        };

        this.readingSearchCriteria = {
            assetId: this.assetDetails.id
        };
        // this.getAssetById();
    }

    // Segment Change
    segmentChange(categories, fab: FabContainer) {
        this.fromDate = "";
        this.toDate = "";
        if(fab){
            fab.close();
        }
        this.jobSearchCriteria = {
            assetId: this.assetDetails.id
        };
        this.ticketSearchCriteria = {
            assetId: this.assetDetails.id
        }
    }

    //

    getPPMJobs(searchCriteria) {
        // var searchCriteria={
        //     assetId:this.assetDetails.id
        // }
      this.assetDetails.PPMJobs = null;
        this.spinner = true;
        //offline
        this.dbProvider.getAssetPPMJobsData(this.assetDetails.id).then(
            (res) => {
                this.spinner=false;
                this.componentService.closeLoader();
                console.log(res);
                this.assetDetails.PPMJobs = res;
            },
            (err) => {
                this.spinner=false;

            }
        )



    }
    getAMCJobs(searchCriteria) {
        // var searchCriteria={
        //     assetId:this.assetDetails.id
        // }
      this.assetDetails.AMCJobs = null;
        this.spinner = true;
        //offline
        this.dbProvider.getAssetAMCJobsData(this.assetDetails.id).then(
            (res) => {
                this.spinner=false;
                this.componentService.closeLoader();
                console.log(res);
                this.assetDetails.AMCJobs= res;
            },
            (err) => {
                this.spinner=false;

            }
        )



    }

    viewJob(job) {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(ViewJobPage, {job: job})
    }

    compeleteJob(job) {
        this.navCtrl.push(OfflineCompleteJob, {job: job})
    }

    open(itemSlide: ItemSliding, item: Item, c) {
        this.count = c;
        if (c == 1) {
            this.count = 0;
            console.log('------------:' + this.count);
            this.close(itemSlide);
        }
        else {
            this.count = 1;
            console.log('------------:' + this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
        }

    }

    close(item: ItemSliding) {
        this.count = 0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    }

    // Create Job

    createJob() {
        this.navCtrl.push(CreateJobPage, {assetDetails: this.assetDetails});
    }

    getAssetPPMSchedule() {
        this.spinner = true;
        // offline
        this.dbProvider.getAssetPPM(this.assetDetails.id).then(
            (res) => {
                this.spinner = false;
                console.log(res);
                this.assetDetails.ppms = res;
            },
            (err) => {
                this.spinner = false;
            }
        )

    }

    getAssetAMCSchedule() {
        this.spinner = true;

        //offline
        this.dbProvider.getAssetAMC(this.assetDetails.id).then(
            (res) => {
                this.spinner = false;
                this.componentService.closeLoader();
                console.log(res);
                this.assetDetails.amcs = res;
            },
            (err) => {
                this.spinner = false;
            }
        )


    }

    getAssetConfig(){
        this.spinner=true;

        //offline
        this.dbProvider.getAssetConfigData(this.assetDetails.assettype,this.assetDetails.id).then(
            (res)=>{
                this.spinner = false;
                console.log(res);
                this.assetDetails.config = res;
                console.log(this.assetDetails.config);
            },
            (err)=>{
                this.spinner = false;
                console.log(err);
            }
        )


    }

    getReadings(){
        // this.navCtrl.push(GetAssetReading,{assetDetails:this.assetDetails});

        let profileModal = this.modalCtrl.create(OfflineGetassetreadings, {assetDetails:this.assetDetails });
        profileModal.onDidDismiss(data => {
            console.log(data);
            // this.getReading(this.readingSearchCriteria);
            this.getReading(this.readingSearchCriteria);
        });
        profileModal.present();

    }

    getReading(readingSearchCriteria){
        this.assetDetails.reading=null;
        this.spinner=true;
            this.dbProvider.getAssetReadings(readingSearchCriteria.assetId).then(
            response=>
            {
                console.log("View Reading Response");
                console.log(response);
                this.spinner=false;
                // this.assetDetails.reading = response.transactions;
                this.assetDetails.reading = response;
            },error=>
            {
                console.log("Error in View Reading");
                console.log(error);
                this.spinner=false;
            }
        )
    }

    getTickets(searchCriteria)
    {
        this.spinner = true;
        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.spinner = false;
                this.componentService.closeLoader();
                console.log("Getting tickets response");
                console.log(response);
                this.assetDetails.tickets = response.transactions;
                console.log(this.assetDetails.tickets)
            },
            error=>{
                this.spinner = false;
                this.componentService.closeLoader();
                console.log(error);
                console.log("Getting Ticket errors")
            })
    }

    //create Ticket
    createTicket()
    {
        this.navCtrl.push(CreateTicket,{assetDetails : this.assetDetails});
    }
}
