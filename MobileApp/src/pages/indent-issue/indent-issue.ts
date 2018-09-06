import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, ViewController} from "ionic-angular";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
import {IndentView} from "../indent-view/indent-view";

declare  var demo ;

/**
 * Generated class for the IndentIssue page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-indent-issue',
  templateUrl: 'indent-issue.html',
})
export class IndentIssue {
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
              public csService:componentService,public viewCtrl:ViewController) {
      this.details=this.navParams.get('indentDetails');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndentIssue');
  }
    addTransactionMaterial(material) {
        console.log("selected site");
        console.log(material);
        console.log(this.selectedSite);
        console.log(material.materialStoreStock);
        if(material.materialStoreStock >= material.issuedQuantity){
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

    dismiss()
    {
        this.viewCtrl.dismiss();
    }

}
