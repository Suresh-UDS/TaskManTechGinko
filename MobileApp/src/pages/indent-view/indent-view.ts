import { Component } from '@angular/core';
import {NavController, NavParams,AlertController,ViewController} from "ionic-angular";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
import{IndentIssue} from "../indent-issue/indent-issue";
import{ModalController} from "ionic-angular";

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
        if(this.details.materialStoreStock >= this.details.issuedQuantity){
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
                            this.csService.showLoader("saving please wait...")
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

        }else {
            this.csService.showToastMessage("Your store stock is "+ material.materialStoreStock,'bottom');
        }


    }


}
