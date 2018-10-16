import {Component, Inject} from '@angular/core';
import {NavController, NavParams, PopoverController,ViewController} from "ionic-angular";
import {SiteService} from "../service/siteService";
import {JobService} from "../service/jobService";
import {Ticket} from "./ticket";
import {componentService} from "../service/componentService";
import {EmployeeService} from "../service/employeeService";
import {FileTransferObject, FileTransfer, FileUploadOptions} from "@ionic-native/file-transfer";
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../service/app-config";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {QuotationImagePopoverPage} from "../quotation/quotation-image-popover";

declare var demo;


/**
 * Generated class for the CreateTicket page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-ticket',
  templateUrl: 'create-ticket.html',
})
export class CreateTicket {

    sites:any;
    private title: any;
    private description: any;
    private siteName: any;
    private employ: any;
    private eMsg: any;
    private siteId: any;
    private userId: any;
    private newTicket: any;
    private comments: any;
    private msg: any;
    private field: any;
    private empPlace: any;
    private empSelect: any;
    private employee: any;
    private severities: any;
    private severity: any;
    ticketImage:any;
    takenImages:any;
    fileTransfer: FileTransferObject = this.transfer.create();
    assetDetails:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public siteService:SiteService,public camera:Camera,public popoverCtrl: PopoverController,
                public jobService:JobService, public cs:componentService, public employeeService:EmployeeService,@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig,
                private transfer: FileTransfer,viewCtrl:ViewController) {
      this.sites=[];
      this.employee=[];
      this.severities = ['Low','Medium','High'];
      this.severity = this.severities[0];
      this.takenImages=[];
      this.assetDetails = this.navParams.get('assetDetails')
      this.empPlace="Employee"

        if(this.assetDetails && this.assetDetails.id>0){
          this.siteName = this.assetDetails.siteName;
          this.getEmployee(this.assetDetails.siteId);
        }

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTicket');
    this.getSites();

  }

  getSites(){
      var search={
          currPage:1
      };
      this.cs.showLoader('Loading Sites..');
      var searchCriteria = {
          findAll:true,
          currPage:1,
          sort:10,
          sortByAsc:true,
          report:true
      };

      this.siteService.searchSites(searchCriteria).subscribe(
          response=>{
              this.sites=response.transactions;
              this.cs.closeLoader();
          },error=>{
              this.cs.closeLoader();
          }
      )
  }

    getEmployee(id)
    {
        if(id)
        {
            console.log('ionViewDidLoad Add jobs employee');

            window.localStorage.setItem('site',id);
            console.log(this.empSelect);
            var searchCriteria = {
                currPage : 1,
                siteId:id
            };
            this.employeeService.searchEmployees(searchCriteria).subscribe(
                response=> {
                    console.log(response);
                    if(response.transactions!==0)
                    {
                        this.empSelect=false;
                        this.empPlace="Employee";
                        this.employee=response.transactions;
                        console.log(this.employee);
                    }
                    else
                    {
                        this.empSelect=true;
                        this.empPlace="No Employee";
                        this.employee=[]
                    }
                },
                error=>{
                    console.log(error);
                    console.log(this.employee);
            })

        }
        else
        {
            this.employee=[];
        }
    }

  createTicket(){
          if(this.title && this.description && this.siteName && this.employ )
          {
              this.eMsg="";
              this.siteId=window.localStorage.getItem('site')
              console.log( this.siteId);
              this.userId=localStorage.getItem('employeeUserId')
              this.newTicket={
                  "title":this.title,
                  "description":this.description,
                  "comments":this.comments,
                  "siteId":this.siteId,
                  "employeeId":this.employ,
                  "userId":this.userId,
                  "severity":this.severity,

              };

              if(this.assetDetails)
              {
                  this.newTicket.assetId = this.assetDetails.id;
              }

              this.jobService.createTicket(this.newTicket).subscribe(
                  response=> {
                      if(response.errorStatus){
                          demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                      }else{
                          console.log(response);

                          //Ticket image upload on successfully creating ticket.
                          if(this.takenImages.length>0){
                              for(var i=0;i<this.takenImages.length;i++){
                                  let token_header=window.localStorage.getItem('session');
                                  let options: FileUploadOptions = {
                                      fileKey: 'ticketFile',
                                      fileName:response.employeeEmpId+'_ticketImage_'+response.id,
                                      headers:{
                                          'X-Auth-Token':token_header
                                      },
                                      params:{
                                          ticketId:response.id
                                      }
                                  };

                                  this.fileTransfer.upload(this.takenImages[i], this.config.Url+'api/ticket/image/upload', options)
                                      .then((data) => {
                                          console.log(data);
                                          console.log("image upload");
                                          this.cs.closeLoader();
                                      }, (err) => {
                                          console.log(err);
                                          console.log("image upload fail");
                                          this.cs.closeLoader();
                                      })
                              }


                          }

                          this.navCtrl.setRoot(Ticket);
                      }
                      },

                  error=>{
                      console.log(error);
                      if(error.type==3)
                      {
                          this.msg='Server Unreachable'
                      }

                      this.cs.showToastMessage(this.msg,'bottom');
                  }
              )
          }
          else
          {
              console.log("============else");

              if(!this.title)
              {
                  console.log("============title");
                  this.eMsg="title";
                  this.field="title";
              }
              else if(!this.description)
              {
                  console.log("============desc");
                  this.eMsg="description";
                  this.field="description";
              }
              else if(!this.siteName)
              {
                  console.log("============site");
                  this.eMsg="siteName";
                  this.field="siteName";
              }
              else if(!this.employ && this.empPlace=="Employee")
              {
                  console.log("============employ");
                  this.eMsg="employ";
                  this.field="employ";
              }

              else if(!this.title && !this.description && !this.siteName && !this.employ )
              {
                  console.log("============all");
                  this.eMsg="all";
              }

          }
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

  viewImage(index,img)
    {
        let popover = this.popoverCtrl.create(QuotationImagePopoverPage,{i:img,ind:index},{cssClass:''});
        popover.present({

        });

        popover.onDidDismiss(data=>
        {

            this.takenImages.pop(data);
        })
    }



}
