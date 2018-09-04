import { Component } from '@angular/core';
import {NavController, NavParams,AlertController} from "ionic-angular";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
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
              public csService:componentService) {
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
                            var details = {
                                siteId:this.details.siteId,
                                projectId:this.details.projectId,
                                materialId:material.materialId,
                                materialItemCode:material.materialItemCode,
                                materialName:material.materialName,
                                storeStock:material.materialStoreStock,
                                uom:material.materialUom,
                                materialGroupId:material.materialItemGroupId,
                                quantity:this.quantity,
                                transactionType:"ISSUED",
                                transactionDate:new Date()
                            };
                            console.log("transaction details");
                            console.log(details);
                            this.psService.saveInventoryTransaction(details).subscribe(
                                response=>{
                                    console.log("Save Inventory Transaction");
                                    console.log(response);
                                    this.csService.showToastMessage("Inventory Transaction saved Successfully",'bottom');
                                    // var trans_list ={
                                    //     materialName: response.materialName,
                                    //     quantity:response.quantity,
                                    //     uom:response.uom
                                    // }
                                    // this.transactionMaterials.push(trans_list);
                                },err=>{
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
        }else {
            this.csService.showToastMessage("Your store stock is "+this.selectedMaterial.materialStoreStock,'bottom');
        }


    }

}
