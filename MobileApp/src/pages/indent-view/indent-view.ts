import { Component } from '@angular/core';
import {NavController, NavParams,AlertController,ViewController} from "ionic-angular";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
import{IndentIssue} from "../indent-issue/indent-issue";
import{ModalController} from "ionic-angular";

declare  var demo ;

/**
 * Generated class for the IndentView page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-indent-view',
  templateUrl: 'indent-view.html',
})
export class IndentView {
    details:any;
    selectedSite:any;
    selectedMaterial:any;
    quantity:any;
    selectedProject:any;
    transactionMaterials:any;
    material:any;
    issuedQuantity:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl:AlertController,public psService:PurchaseRequisitionService,
              public csService:componentService,public modalCtrl:ModalController) {
    this.details=this.navParams.get('indentDetails');
    console.log("details");
    console.log(this.details);


    if (this.details){

    }else{
        this.details=[];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndentView');
    this.getIndentDetails(this.details.id);
  }


    issuePage(details)
    {
        // this.navCtrl.push(IndentIssue,{indentDetails:details});
        const modal=this.modalCtrl.create(IndentIssue,{indentDetails:details});
        modal.present();
    }


    addTransactionMaterial(material) {
        // console.log("selected site");
        console.log("Details");
        console.log(this.details);
        console.log("Material");
        console.log(material);
        // console.log(this.selectedSite);
        console.log(material.materialStoreStock);
        // if(this.details.materialStoreStock >= this.details.issuedQuantity){
            // if(((material.quantity - material.issuedQuantity)+material.issuedQuantity) == material.quantity){
            let confirm =  this.alertCtrl.create({
                title: 'Do you want to save?',
                buttons:[
                    {
                        text:'No',
                        handler:()=>{
                            console.log("No clicked");
                        }
                    },
                    {
                        text:'Yes',
                        handler:()=>{
                            console.log("transaction details");
                            console.log(this.details);
                            this.csService.showLoader("saving please wait...");

                            for(let items of this.details.items){
                                items.issuedQuantity = items.currentQuantity;
                            }

                            this.psService.indentMaterialTransaction(this.details).subscribe(
                                response=>{
                                    this.csService.closeLoader();
                                    console.log("Save Inventory Transaction");
                                    console.log(response);
                                    this.csService.showToastMessage("Inventory Transaction saved Successfully",'bottom');
                                    // this.navCtrl.push(IndentView);
                                    // var trans_list ={
                                    //     materialName: response.materialName,
                                    //     quantity:response.quantity,
                                    //     uom:response.uom
                                    // }
                                    // this.transactionMaterials.push(trans_list);
                                },err=>{
                                    this.csService.closeLoader();
                                    console.log("Error in save inventory transaction");
                                    console.log(err);
                                    this.csService.showToastMessage("Error in save inventory transaction",'bottom');
                                }
                            )
                        }
                    }
                ]
            });
            confirm.present();
            // }else{
            //     demo.showSwal('warning-message-and-confirmation-ok','Invalid value','Issued quantity should not be greater than required quantity');
            //
            // }

        // }else {
        //     this.csService.showToastMessage("Your store stock is "+ material.materialStoreStock,'bottom');
        // }


    }

    checkQuantity(item,i){

      console.log("Check Quantity");
      console.log(i);
      console.log(item);
      console.log(this.details.items);
      if(item.currentQuantity && item.currentQuantity>0){
          if(item.materialStoreStock >= item.currentQuantity){
              if(item.currentQuantity <= item.pendingQuantity){
                  // this.details.items[i].issuedQuantity += parseInt(item.currentQuantity);
                  // this.details.items[i].pendingQuantity -= parseInt(item.currentQuantity);
              }else{
                  console.log(item.currentQuantity);
                  console.log(item.pendingQuantity);
                  demo.showSwal('warning-message-and-confirmation-ok','Invalid value','only ' + item.pendingQuantity + '  could be issued' );
                  this.details.items[i].currentQuantity=0;
                  this.getIndentDetails(this.details.id);
              }
          }else{
              demo.showSwal('warning-message-and-confirmation-ok','Invalid value','Only ' + item.materialStoreStock + '  Available in store stock' );
              this.details.items[i].currentQuantity=0;
              this.getIndentDetails(this.details.id);

          }
      }else{
          this.details.items[i].currentQuantity = 0;
      }

    }

    getIndentDetails(id){
        this.csService.showLoader('Getting Indent details');
        this.psService.getIndentDetails(id).subscribe(
            response=>{
                this.csService.closeAll();
                console.log(response);
                this.details = response;
            },err=>{
                console.log(err);
                this.csService.closeAll();
                console.log("Error in getting indent details");
            }
        )
    }



}
