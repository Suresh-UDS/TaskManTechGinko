import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ModalController} from "ionic-angular";
import {AssetFilter} from "./asset-filter";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {AssetView} from "../asset-view/asset-view";
import {ScanQR} from "./scanQR";

/**
 * Generated class for the AssetList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-asset-list',
  templateUrl: 'asset-list.html',
})
export class AssetList {

    assetList:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController:ModalController, public qrScanner:QRScanner) {
    this.assetList = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetList')

      this.assetList = [
          {
              name:'Vaccum Cleaner',
              assetGroup:'UDS Housekeeping',
              status:'',
              location:'Updater Services Private Ltd.,',
              site:'Thuraipakkam',
              block:'A-block',
              floor:'First floor',
              zone:'IT-Bay',
              manufacturer:'Eureka-Forbes',
              model:'quickcleandx',
              serial:'B00F3ABSXU',
              acquiredDate:new Date(),
              purchasePrice:'₹3,599',
              currentPrice:'₹3,999',
              estimatedDisposePrice:'₹400',
              serviceProvider:'cloud tail India',
              warrantyType:'product warranty',
              warrantyEndDate:new Date(),
              img:'assets/imgs/vaccum-cleaner.jpg',
              ppms:[{
                  title:'Vacuum-cleaner Annual',
                  frequency:'Every 12 Months',
                  status:'InProgress',
                  scheduledDate: new Date()
              },{
                  title:'Vacuum-cleaner Weekly',
                  frequency:'Every Week',
                  status:'Completed',
                  scheduledDate:new Date()
              },{
                  title:'Vacuum-cleaner Monthly',
                  frequency:'Every Month',
                  status:'Completed',
                  scheduledDate:new Date()
              }],
              amcs:[{
                  title:'Vacuum-cleaner Annual',
                  frequency:'Every 12 Months',
                  status:'InProgress',
                  scheduledDate: new Date()
              },{
                  title:'Vacuum-cleaner Weekly',
                  frequency:'Every Week',
                  status:'Completed',
                  scheduledDate:new Date()
              },{
                  title:'Vacuum-cleaner Monthly',
                  frequency:'Every Month',
                  status:'Completed',
                  scheduledDate:new Date()
              }],
              tickets:[{
                  assignedOn:"2018-05-22",
                  assignedToName:"MADHURI R",
                  comments:"CLOSE ASAP",
                  createdBy:"388038",
                  createdDate:"2018-05-22",
                  description:"Issue with the Vaccum cup",
                  employeeEmpId:"388038",
                  employeeId:1715,
                  employeeName:"MAKVANA DISHA",
                  status:"Open",
                  title:"Cleaner Issue",
              },{
                  assignedOn:"2018-05-21",
                  assignedToName:"MADHURI R",
                  comments:"CLOSE ASAP",
                  createdBy:"388038",
                  createdDate:"2018-05-22",
                  description:"No Power supply",
                  employeeEmpId:"388038",
                  employeeId:1715,
                  employeeName:"MAKVANA DISHA",
                  status:"Open",
                  title:"Electrical ",
              }
              ]
          },
          {
              name:'KOEL Diesel Genset',
              assetGroup:'CMRL',
              status:'',
              location:'CMRL - Shenoy Nagar',
              site:'Shenoynagar',
              block:'A-block',
              floor:'Ground floor',
              zone:'Genset-area',
              manufacturer:'KOEL Green',
              model:'4AB 160M1',
              serial:'B00F3ABSXU',
              acquiredDate:new Date(),
              purchasePrice:'₹30,000',
              currentPrice:'₹30,000',
              estimatedDisposePrice:'₹0',
              serviceProvider:'KJ Enterprises',
              warrantyType:'Manufacturer',
              warrantyEndDate:new Date(),
              img:'assets/imgs/dg.jpg',
              ppms:[{
                  title:'KOEL Diesel Genset Annual',
                  frequency:'Every 12 Months',
                  status:'InProgress',
                  scheduledDate: new Date()
              },{
                  title:'KOEL Diesel Genset Weekly',
                  frequency:'Every Week',
                  status:'Completed',
                  scheduledDate:new Date()
              },{
                  title:'KOEL Diesel Genset Monthly',
                  frequency:'Every Month',
                  status:'Completed',
                  scheduledDate:new Date()
              }],
              amcs:[{
                  title:'KOEL Diesel Genset Annual',
                  frequency:'Every 12 Months',
                  status:'InProgress',
                  scheduledDate: new Date()
              },{
                  title:'KOEL Diesel Genset Weekly',
                  frequency:'Every Week',
                  status:'Completed',
                  scheduledDate:new Date()
              },{
                  title:'KOEL Diesel Genset Monthly',
                  frequency:'Every Month',
                  status:'Completed',
                  scheduledDate:new Date()
              }],
              tickets:[{
                  assignedOn:"2018-05-22",
                  assignedToName:"MADHURI R",
                  comments:"CLOSE ASAP",
                  createdBy:"388038",
                  createdDate:"2018-05-22",
                  description:"Issue diesel level not upto mark",
                  employeeEmpId:"388038",
                  employeeId:1715,
                  employeeName:"MAKVANA DISHA",
                  status:"Open",
                  title:"Diesel Level",
              },{
                  assignedOn:"2018-05-21",
                  assignedToName:"MADHURI R",
                  comments:"CLOSE ASAP",
                  createdBy:"388038",
                  createdDate:"2018-05-22",
                  description:"Oil leakage",
                  employeeEmpId:"388038",
                  employeeId:1715,
                  employeeName:"MAKVANA DISHA",
                  status:"Open",
                  title:"Oil Leakage ",
              }
              ]
          }
      ]
  }

  openFilters(){
      console.log("Opening filter modal");
      let modal = this.modalController.create(AssetFilter);
      modal.onDidDismiss(data=>{
          console.log("Modal dismissed");
          console.log(data);
      })
      modal.present();

  }

  scanQRCode(){
      window.document.querySelector('ion-app').classList.add('transparentBody')
      this.qrScanner.prepare().then((status:QRScannerStatus)=>{
          console.log("Opening Scanner");
          this.qrScanner.show();
          let scanSub = this.qrScanner.scan().subscribe((text:String)=>{
              console.log('Scanned Something',text);
              this.qrScanner.hide();
              scanSub.unsubscribe();
              window.document.querySelector('ion-app').classList.add('transparentBody')
              this.navCtrl.push(AssetView);
          });
          if(status.authorized){
              console.log("Permission Authorized");

          }else if(status.denied){
              console.log("Permission denied temporarily" );
              this.qrScanner.openSettings();
          }else{
              console.log("Permission denied");
          }
      })
          .catch((e:any)=>console.log("error is",e));
  }

  scanQR(){
      this.navCtrl.push(ScanQR)
  }

    viewAsset(asset){
      this.navCtrl.push(AssetView,{assetDetails:asset});
    }






}
