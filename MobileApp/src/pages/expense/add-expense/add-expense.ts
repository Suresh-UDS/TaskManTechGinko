import {Component, Inject} from '@angular/core';
import {ModalController, NavController, NavParams, PopoverController, ViewController} from "ionic-angular";
import {DatePickerProvider} from "ionic2-date-picker";
import {DatePicker} from "@ionic-native/date-picker";
import {SiteService} from "../../service/siteService";
import {componentService} from "../../service/componentService";
import {ExpenseService} from "../../service/expenseService";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {QuotationImagePopoverPage} from "../../quotation/quotation-image-popover";
import {SelectSearchableComponent} from 'ionic-select-searchable';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import {ApplicationConfig, MY_CONFIG_TOKEN} from "../../service/app-config";
import { File } from '@ionic-native/file';
import { ExpensePage } from '../expense';

declare  var demo ;


/**
 * Generated class for the AddExpense page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpense {
  takenImages: any;
  receiptNumber: any;
  description: any;
  reimbursable: any;
  billable: any;
  selectedAmount: any;
  selectedPaymentType: any;
  selectedCategory: any;
  selectedDate: any;
  transactionMode: any;
  selectedSite: any;
    expense_type: any;
  selectOptions: { cssClass: string; };
  siteList: any;
  scrollSite: boolean;
  msg: string;
  selectedProject: any;
  clientList: any;
  searchCriteria: any;
  selectDate: Date;
  previousAmount: any;
    mode:any;
    expenseDetails:any;

    fileTransfer: FileTransferObject = this.transfer.create();


    constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
              private datePicker: DatePicker, private modalCtrl: ModalController,private siteService:SiteService,
              private component: componentService, private expenseService: ExpenseService,public camera:Camera,
              public popoverCtrl: PopoverController, private transfer: FileTransfer, private file: File,@Inject(MY_CONFIG_TOKEN) private config:ApplicationConfig)
  {
    this.expenseDetails = {};
    this.takenImages = [];
    this.transactionMode = 'debit';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpense');
    this.component.showLoader('Getting Project');
    this.selectOptions = {
      cssClass: 'selectbox-popover'
    }
    this.siteService.getAllProjects().subscribe(
      response => {
        this.component.closeLoader();
        console.log("project");
        console.log(response);
        this.clientList = response;
        this.selectedProject = this.clientList[0];
        this.selectSite(this.selectedProject);
        console.log('select default value:');
      },
      error => {
        this.component.closeLoader();
        if (error.type == 3) {
          this.msg = 'Server Unreachable'
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )

    this.expenseService.getExpenseCategories().subscribe(
      response=>{
        console.log("Expense categories");
        console.log(response);
        this.expense_type = response;
      },
      error=>{
        if (error.type ==3){
          this.msg = 'server Unreachable'
        }
        this.component.showToastMessage(this.msg,'bottom');
      }
    )
  }


  portChange(event: {
    component: SelectSearchableComponent,
    value: any
  }) {
    console.log('selectProject:', event.value.name);
  }

  siteChange(event:{
    component: SelectSearchableComponent,
    value: any
  }){
    this.selectedProject = event.value;
    this.siteService.findSitesByProject(event.value.id).subscribe(
      response => {
        console.log("Site By ProjectId");
        console.log(response);
        this.siteList = response;
        console.log(this.siteList);
      },
      error => {
        if (error.type == 3) {
          this.msg = 'Server Unreachable';
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )
  }

  selectSite(project) {
    this.selectedProject = project;
    this.scrollSite = true;
    this.siteService.findSitesByProject(project.id).subscribe(
      response => {
        console.log("Site By ProjectId");
        console.log(response);
        this.siteList = response;
        console.log(this.siteList);
      },
      error => {
        if (error.type == 3) {
          this.msg = 'Server Unreachable';
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )
  }

  getLatestRecordBySite(site){

    this.selectedSite = site;

    this.expenseService.getLatestRecordBySite(this.selectedSite.id).subscribe(
      response=> {
        console.log("Checking balance amount");
        console.log(response);
        this.previousAmount = response.balanceAmount;
      },err=>{
        console.log("Error in getting balance amount");
        console.log(err);
      }
    )
  }



  dismiss(){
        let data={'foo':'bar'};
        this.viewCtrl.dismiss(data);
    }


  saveExpense() {

    this.component.showLoader("Saving Expense");
    console.log("Selected site");
    console.log(this.selectedSite);

      if(this.selectedProject){
        this.expenseDetails.projectId = this.selectedProject.id;
      }

      if(this.selectedSite){
        this.expenseDetails.siteId = this.selectedSite.id;
      }


    if(this.transactionMode== "debit"){
        this.expenseDetails.mode = "debit";
      }else if(this.transactionMode == "credit"){
        this.expenseDetails.mode = "credit";
      }


        if(this.transactionMode == "debit"){
          this.expenseDetails.expenseDate = new Date(this.selectDate);
        }else {
          this.expenseDetails.creditedDate = new Date(this.selectDate);
        }


      if(this.selectedCategory && this.transactionMode =="debit"){
        this.expenseDetails.expenseCategory = this.selectedCategory;
      }

      if(this.selectedPaymentType){
        this.expenseDetails.paymentType = this.selectedPaymentType;
      }

      this.expenseDetails.currency = "INR";

      if(this.receiptNumber){
        this.expenseDetails.receiptNumber= this.receiptNumber;
      }

      if(this.selectedAmount){
        if(this.transactionMode == "debit"){
          this.expenseDetails.debitAmount = this.selectedAmount;
        }else if(this.transactionMode == "credit"){
          this.expenseDetails.creditAmount = this.selectedAmount;
        }
      }

      if(this.billable){
        this.expenseDetails.billable = this.billable;
      }else {
        this.expenseDetails.billable = false;
      }

      if(this.reimbursable){
        this.expenseDetails.reimbursable = this.reimbursable;
      }else {
        this.expenseDetails.reimbursable = false;
      }

      if(this.description){
        this.expenseDetails.description = this.description;
      }



    if(this.transactionMode == "debit") {
        console.log("Before saving expense");
        console.log(this.expenseDetails);
          this.expenseService.saveExpenses(this.expenseDetails).subscribe(
            response=>{
              console.log("save Expense Details");
              console.log(response);
              this.component.closeAll();
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                }else {
                    //Upload Images
                    if(this.takenImages.length>0){
                      this.component.showLoader('Uploading Images');
                      for (let i in this.takenImages) {

                        console.log("image loop");
                        console.log(i);
                        console.log(this.takenImages[i]);
                        console.log(this.takenImages[i].file);
                        var employeeId = Number;
                        let token_header = window.localStorage.getItem('session');
                        let options: FileUploadOptions = {
                            fileKey: 'uploadFile',
                            fileName: response.id+ '_expenseFile',
                            headers: {
                                'X-Auth-Token': token_header
                            },
                            params: {
                                title: response.id+ '_expenseFile',
                                expenseId: response.id,
                                type: 'image',
                            }
                        };
                        console.log(options);
                        console.log("File details");
                        console.log(this.takenImages[i]);

                        this.fileTransfer.upload(this.takenImages[i], this.config.Url + 'api/expenses/uploadImage', options)
                            .then((data) => {
                                console.log(data);
                                console.log("image upload");
                                this.component.closeLoader();
                                demo.showSwal('success-message-and-ok','Success','Expense Added Successfully and Uploaded Images ');
                                this.navCtrl.setRoot(ExpensePage);
                            }, (err) => {
                                console.log(err);
                                console.log("image upload fail");
                                this.component.closeLoader();
                            })

                     }
                    }else{
                      this.component.closeAll();
                      demo.showSwal('success-message-and-ok','Success','Expense Added Successfully');
                      this.navCtrl.setRoot(ExpensePage);
                    }
                    
                }

            },err=>{
              console.log("Error in save expense");
              console.log(err);
              this.component.showToastMessage("Error in save expense transaction ",'bottom');
            }
          )

    }else if (this.transactionMode == "credit"){
        console.log("before saving expenses");
        console.log(this.expenseDetails);

        this.expenseService.saveExpenses(this.expenseDetails).subscribe(
          response=>{
            console.log("save Expense Details");
            console.log(response);
            this.component.closeAll();
            if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);

            }else{

                //Upload Images
                if(this.takenImages && this.takenImages>0){
                  this.component.showLoader("Uploading Images");
                  for(let i in this.takenImages) {
                    console.log("image loop");
                    console.log(i);
                    console.log(this.takenImages[i]);
                    console.log(this.takenImages[i].file);
                    var employeeId=Number;
                    let token_header=window.localStorage.getItem('session');
                    let options: FileUploadOptions = {
                        fileKey: 'expenseFile',
                        fileName:new Date().getTime()+'_expenseFile',
                        headers:{
                            'X-Auth-Token':token_header
                        },
                        params:{
                            title:new Date().getTime()+'_expenseFile' ,
                            expenseId:response.id,
                            type:'image',
                        }
                    };

                    this.fileTransfer.upload(this.takenImages[i], this.config.Url+'api/expenses/uploadFile', options)
                        .then((data) => {
                            console.log(data);
                            console.log("image upload");
                            this.component.closeLoader();
                            demo.showSwal('success-message-and-ok','Success','Amount Credited Successfully and Uploaded Images ');
                            this.navCtrl.setRoot(ExpensePage);
                        }, (err) => {
                            console.log(err);
                            console.log("image upload fail");
                            this.component.closeLoader();
                        })

                }

                }else{
                  this.component.closeAll();
                  demo.showSwal('success-message-and-ok','Success','Amount Credited Successfully');
                  this.navCtrl.setRoot(ExpensePage);
                }
            }
          },err=>{
            console.log("Error in save expense");
            console.log(err);
            this.component.showToastMessage("Error in save expense transaction ",'bottom');
          }
        )
    }


    console.log("Expense details");
      console.log(this.expenseDetails);



  }

  showCalendar() {
      this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
        allowFutureDates:false
      }).then(
        date=>{
          this.selectDate = date;
          console.log("date:",date);
        },
          err=>console.log("Error occured while getting date:"+err)
      );
  }


  viewCamera(){
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
    let popover = this.popoverCtrl.create(QuotationImagePopoverPage,{i:img,ind:index},{cssClass:'view-img',showBackdrop:false});
    popover.present({

    });


    popover.onDidDismiss(data=>
    {
      // this.takenImages.pop(data);
    })
  }
}
