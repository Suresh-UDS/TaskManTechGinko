import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {FabContainer, Item, ItemSliding, ModalController, NavController, NavParams} from "ionic-angular";
import {GetAssetReading} from "./get-asset-reading";
import {JobService} from "../service/jobService";
import {componentService} from "../service/componentService";
import {tick} from "@angular/core/testing";
import {ViewJobPage} from "../jobs/view-job";
import {CompleteJobPage} from "../jobs/completeJob";
import {ViewTicket} from "../ticket/view-ticket";
import {CreateTicket} from "../ticket/create-ticket";
import{GetAssetReadings} from "./get-asset-readings/get-asset-readings";
import {Camera, CameraOptions} from "@ionic-native/camera";
import { DatePicker } from '@ionic-native/date-picker';
import {AssetService} from "../service/assetService";
import{CalenderPage} from "../calender-page/calender-page";
import {CreateJobPage} from "../jobs/add-job";
import {DBService} from "../service/dbService";
import {FileTransferObject, FileUploadOptions, FileTransfer} from "@ionic-native/file-transfer";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";

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
  jobPage=0;
  count:any;
  readingPage=0;

    totalPages:0;
    page:1;


    fromDate:any;
    toDate:any;
    viewButton:any;
    searchCriteria:any;
    spinner:any;
    jobSearchCriteria:any;
    ticketSearchCriteria:any;
    readingSearchCriteria:any;
    fileTransfer: FileTransferObject = this.transfer.create();


    constructor(public dbService:DBService,public camera: Camera,@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,private transfer: FileTransfer,private modalCtrl:ModalController,private datePicker: DatePicker,private componentService:componentService,public navCtrl: NavController, public navParams: NavParams, public jobService:JobService, public assetService:AssetService) {

    this.assetDetails = this.navParams.data.assetDetails;
    this.categories = 'details';
    this.spinner=true;

  }
    showCalendar()
    {
        // let dateModal=this.modalCtrl.create(DateModal)
        // dateModal.present()
        this.navCtrl.push(CalenderPage,{assetDetails:this.assetDetails});
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetView');
    console.log(this.assetDetails);
    this.componentService.showLoader("");

      this.searchCriteria={
          assetId:this.assetDetails.id
      }

      this.jobSearchCriteria={
          assetId:this.assetDetails.id
      }

      this.ticketSearchCriteria={
          assetId:this.assetDetails.id
      }

      this.readingSearchCriteria={
          assetId:this.assetDetails.id
      }
      this.getAssetById();
  }

    getReadings(){
        // this.navCtrl.push(GetAssetReading,{assetDetails:this.assetDetails});

        let profileModal = this.modalCtrl.create(GetAssetReading, {assetDetails:this.assetDetails });
        profileModal.onDidDismiss(data => {
            console.log(data);
            // this.getReading(this.readingSearchCriteria);
            this.getReading();
        });
        profileModal.present();

    }

    // Segment Change
    segmentChange(categories,fab:FabContainer)
    {
        this.fromDate="";
        this.toDate="";
        fab.close();
        this.jobSearchCriteria={
            assetId:this.assetDetails.id
        }
        this.ticketSearchCriteria={
            assetId:this.assetDetails.id
        }
    }
    //

    addAssetImage() {

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.NATIVE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {

            imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/")
            console.log('imageData -' +imageData);

            let token_header=window.localStorage.getItem('session');
            let options: FileUploadOptions = {
                fileKey: 'uploadFile',
                fileName:'uploadFile',
                headers:{
                    'X-Auth-Token':token_header
                },
                params:{
                    title : this.assetDetails.title,
                    assetId : this.assetDetails.id,
                    type : "image"
                }
            };

            this.fileTransfer.upload(imageData, this.config.Url+'api/assets/uploadAssetPhoto', options)
                .then((data) => {
                    console.log(data.response);
                    console.log("image upload");
                    this.componentService.closeLoader();
                    this.navCtrl.pop();
                }, (err) => {
                    console.log(err);
                    console.log("image upload fail");
                    this.componentService.closeLoader();
                })



        })

    }


    // Pullto refresh
    doRefresh(refresher,segment)
    {
        this.componentService.showLoader("");
        if(segment=='jobs')
        {
            this.getJobs(this.jobSearchCriteria);
            refresher.complete();
            // this.componentService.showLoader("");
        }
        else if(segment=='tickets')
        {
            this.getTickets(this.searchCriteria);
            refresher.complete()
            // this.componentService.showLoader("");
        }
    }


    //job
    getJobs(searchCriteria)
    {
        // var searchCriteria={
        //     assetId:this.assetDetails.id
        // }
        this.spinner = true;
        //offline
        this.dbService.getJobs(this.assetDetails.id).then(
            (res)=>{
                this.componentService.closeLoader()
                console.log(res)
                this.assetDetails.jobs = res;
            },
            (err)=>{

            }
        )


        //Online
        // this.jobService.getJobs(searchCriteria).subscribe(
        //     response=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader();
        //         console.log("Getting Jobs response");
        //         console.log(response);
        //         this.assetDetails.jobs = response.transactions;
        //         this.page = response.currPage;
        //         this.totalPages = response.totalPages;
        //         console.log(this.assetDetails.jobs)
        //     },
        //     error=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader();
        //         console.log(error)
        //         console.log("Getting Jobs errors")
        //     })
    }

    jobScroll(infiniteScroll) {
        console.log('Begin async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria = {
            currPage: this.page + 1,
            assetId:this.assetDetails.id
        };
        if (this.page > this.totalPages) {
            console.log("End of all pages");
            infiniteScroll.complete();
            this.componentService.showToastMessage('Todays jobs Loaded', 'bottom');

        } else {
            console.log("Getting pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(() => {
                this.jobService.getJobs(searchCriteria).subscribe(
                    response => {
                        console.log('ionViewDidLoad jobs list:');
                        console.log(response);
                        console.log(response.transactions);
                        for (var i = 0; i < response.transactions.length; i++) {
                            this.assetDetails.jobs.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.componentService.closeLoader();
                    },
                    error => {
                        console.log('ionViewDidLoad Jobs Page:' + error);
                    }
                )
                infiniteScroll.complete();
            }, 1000);
        }
    }

    readingScroll(infiniteScroll)
    {
        console.log('Reading Page async operation');
        console.log(infiniteScroll);
        console.log(this.totalPages);
        console.log(this.page);
        var searchCriteria = {
            currPage: this.page + 1,
            assetId:this.assetDetails.id
        };
        if (this.page > this.totalPages) {
            console.log("End of all pages");
            infiniteScroll.complete();
            this.componentService.showToastMessage('Reading list Loaded', 'bottom');

        } else {
            console.log("Getting  pages");
            console.log(this.totalPages);
            console.log(this.page);
            setTimeout(() => {
                this.assetService.viewReading(searchCriteria).subscribe(
                    response => {
                        console.log('ionViewDidLoad readings list:');
                        console.log(response);
                        console.log(response.transactions);
                        for (var i = 0; i < response.transactions.length; i++) {
                            this.assetDetails.jobs.push(response.transactions[i]);
                        }
                        this.page = response.currPage;
                        this.totalPages = response.totalPages;
                        this.componentService.closeLoader();
                    },
                    error => {
                        console.log('ionViewDidLoad Readings  Page:' + error);
                    }
                )
                infiniteScroll.complete();
            }, 1000);
        }
    }


    viewJob(job)
    {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(ViewJobPage,{job:job})
    }

    compeleteJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    open(itemSlide: ItemSliding, item: Item,c)
    {
        this.count=c;
        if(c==1)
        {
            this.count=0;
            console.log('------------:'+this.count);
            this.close(itemSlide);
        }
        else
        {
            this.count=1;
            console.log('------------:'+this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
        }

    }
    close(item: ItemSliding) {
        this.count=0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    }

    // Create Job

    createJob()
    {
        this.navCtrl.push(CreateJobPage,{assetDetails : this.assetDetails});
    }


    //



    // Date search
    selectFromDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            allowFutureDates:false
        }).then(
            date => {
                this.fromDate=date;
                console.log('Got date: ', date);
                if(this.fromDate && this.toDate)
                {
                    console.log('view button true');
                    this.viewButton=true;
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }
    selectToDate()
    {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
            allowFutureDates:false
        }).then(
            date => {
                this.toDate=date;
                console.log('Got date: ', date);
                if(this.fromDate && this.toDate)
                {
                    console.log('view button true');
                    this.viewButton=true;
                }

            },
            err => console.log('Error occurred while getting date: ', err)
        );

    }
    dateSearch(fromDate,toDate,categories) {
        // this.componentService.showLoader("")
        console.log("From Date:" + fromDate.toISOString());
        console.log("To Date:" + toDate.toISOString());

        if(categories == 'jobs')
        {
            this.jobSearchCriteria={
                checkInDateTimeFrom:fromDate.toISOString(),
                checkInDateTimeTo:toDate.toISOString(),
                assetId:this.assetDetails.id
            };

            this.getJobs(this.jobSearchCriteria)
        }
        else if(this.categories == 'tickets')
        {
            this.ticketSearchCriteria={
                fromDate:fromDate.toISOString(),
                toDate:toDate.toISOString(),
                assetId:this.assetDetails.id
            };
            this.getTickets(this.ticketSearchCriteria);
        }
        else if(this.categories == 'readings')
        {
            console.log("From Date:" +fromDate.toISOString());
                console.log("To Date:" +toDate.toISOString());
            // this.componentService.showLoader("")
                this.readingSearchCriteria={
                    readingFromDate:fromDate.toISOString(),
                    readingToDate:toDate.toISOString(),
                    assetId:this.assetDetails.id
                };

           // this.getReading(this.readingSearchCriteria);
            this.getReading();
           // this.componentService.closeLoader();
        }

    }
    //



    getAssetById(){
        this.componentService.closeLoader();
        //Online
        this.assetService.getAssetById(this.assetDetails.id).subscribe(
            response=>{
                this.componentService.closeLoader();
                console.log("Asset by id");
                console.log(response);
                this.assetDetails = response;
            },err=>{
                this.componentService.closeLoader();
                console.log("Error in getting asset by id");
                console.log(err);
            }
        )

    }


    // PPM
    getAssetPPMSchedule()
    {
        this.spinner = true;
        // offline
        this.dbService.getPPM(this.assetDetails.id).then(
            (res)=>{
                this.componentService.closeLoader()
                console.log(res)
                this.assetDetails.ppms = res;
            },
            (err)=>{

            }
        )

        //Online
        // this.assetService.getAssetPPMSchedule(this.assetDetails.id).subscribe(
        //     response=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader();
        //         console.log("Get asset PPM response");
        //         console.log(response);
        //         this.assetDetails.ppms = response;
        //     },
        //     error=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader();
        //         console.log("Get asset PPM error");
        //         console.log(error);
        //     })
    }


    // AMC
    getAssetAMCSchedule()
    {
        this.spinner = true;

        //offline
        this.dbService.getAMC(this.assetDetails.id).then(
            (res)=>{
                this.componentService.closeLoader()
                console.log(res)
                this.assetDetails.amcs = res;
            },
            (err)=>{

            }
        )


        //Online
        // this.assetService.getAssetAMCSchedule(this.assetDetails.id).subscribe(
        //     response=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader()
        //         console.log("Get asset AMC response");
        //         this.assetDetails.amcs = response;
        //         console.log(this.assetDetails.amcs);
        //     },
        //     error=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader()
        //         console.log("Get asset AMC error");
        //         console.log(error);
        //     })
    }

    // Config
    getAssetConfig(){
        this.spinner=true;

        //offline
        this.dbService.getConfig(this.assetDetails.assetType,this.assetDetails.id).then(
            (res)=>{
                this.componentService.closeLoader()
                console.log(res)
                this.assetDetails.config = res;
                console.log(this.assetDetails.config)
            },
            (err)=>{

            }
        )


        // online
        // console.log(this.assetDetails.config);
        // this.assetService.getAssetConfig(this.assetDetails.assetType,this.assetDetails.id).subscribe(
        //     response=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader()
        //         console.log("Asset config");
        //         console.log(response);
        //         this.assetDetails.config = response;
        //     },err=>{
        //         this.spinner = false;
        //         this.componentService.closeLoader();
        //         console.log("Error in getting asset config");
        //         console.log(err);
        //     })
    }

    // Reading
    getReading(){
        this.assetDetails.reading=null;
        this.spinner=true;
        // this.assetService.viewReading(searchCriteria).subscribe(
        this.dbService. getViewReading(this.assetDetails.type,this.assetDetails.id).then(
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

    // Reading Date Search
    readingDateSearch(readingFromDate,readingToDate) {
        // this.componentService.showLoader("")
        console.log("reading From Date:" + readingFromDate.toISOString());
        console.log("reading To Date:" + readingToDate.toISOString());
        var searchCriteria={
            fromDate:readingFromDate.toISOString(),
            toDate:readingToDate.toISOString(),
            assetId:this.assetDetails.id
        };
    }





    // Tickets
    getTickets(searchCriteria)
    {
        this.spinner = true;
        this.jobService.searchTickets(searchCriteria).subscribe(
            response=>{
                this.spinner = false;
                this.componentService.closeLoader()
                console.log("Getting tickets response");
                console.log(response);
                this.assetDetails.tickets = response.transactions;
                console.log(this.assetDetails.tickets)
            },
            error=>{
                this.spinner = false;
                this.componentService.closeLoader()
                console.log(error)
                console.log("Getting Ticket errors")
            })
    }

    //create Ticket
    createTicket()
    {
        this.navCtrl.push(CreateTicket,{assetDetails : this.assetDetails});
    }

}
