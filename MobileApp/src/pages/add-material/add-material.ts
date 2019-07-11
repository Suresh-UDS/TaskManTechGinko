import { Component } from '@angular/core';
import {NavController, NavParams,ViewController} from "ionic-angular";
import{InventoryService} from "../service/inventoryService";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
import {SelectSearchableComponent} from "ionic-select-searchable";
import { JobService } from '../service/jobService';

declare var demo;
/**
 * Generated class for the AddMaterial page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-material',
  templateUrl: 'add-material.html',
})
export class AddMaterial {
    page:1;
    pageSort:15;
    job:any;
    indentMaterial:any;
    selectMaterial:any;
    indents:any;
    material:any;
    jobMaterial:any;
    addMaterials: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public inventoryService:InventoryService,
              public purchaseService:PurchaseRequisitionService,public component:componentService, public jobService: JobService,
              public viewCtrl:ViewController) {
      this.job=this.navParams.get('job');
      console.log(this.navParams.get('job'));
      console.log("get material");
      this.getMaterial();
      this.indents=[];
      this.addMaterials = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMaterial');
  }


  getMaterial()
  {
      var searchCriteria={
          currPage:this.page,
          pageSort:this.pageSort,
          siteID:this.job.siteId,
          list:true,

      }
      this.inventoryService.getMaterials(searchCriteria).subscribe(
          response=>{
              console.log("Getting Material Successfully");
              console.log(response);
              this.indentMaterial=response.transactions;
          },err=>{
              console.log("Error in Getting Material");
              console.log(err);
          }
      )
  }

    selectedMaterial() {
      console.log("Material");
      console.log(this.material);
        // this.selectMaterial = m;
    }

    addIndent(m) {
      console.log("m");
        console.log(m);
        var details = {
            materialName:m.name,
            materialId:m.id,
            materialCode:m.itemCode,
            materialGroup:m.itemGroup,
            materialStock:m.storeStock,
            materialUom:m.uom,
            materialQuantity:0
        };

        if(this.indents.length>0){

          for(var i=0;i<this.indents.length;i++){
            if(m.itemCode == this.indents[i].itemCode){
              console.log("Item already found");
              console.log(this.indents[i].itemCode);
            }else{
              this.indents.push(details);
            }
          }

        }else{
          this.indents.push(details);
        }

        

        console.log(this.indents);
    }

    removeTransaction(i) {
        this.indents.pop(i);
    }

    saveJobMaterial()
    {

        this.purchaseService.saveMaterialIndent(this.jobMaterial).subscribe(
            response=>{
                this.component.closeAll();
                console.log("Save indent Material");
                console.log(response);
                this.component.showToastMessage("indent saved successfully",'bottom');
            },err=>{
                this.component.closeAll();
                console.log("Error in save indent material");
                console.log(err);
                this.component.showToastMessage("Error in save indent",'bottom');

            }
        )
    }

    dismiss(m)
    {
        console.log("m save")
        console.log(m);
        var material = m;
        this.component.showLoader("Saving Materials");
        for(var i=0; i<m.length; i++){
          console.log("materialqty",m[i].materialQuantity);

          if(m[i].materialQuantity == 0){
            demo.showSwal('warning-message-and-confirmation-ok',"please add material quantity in "+m[i].materialName);
            break;
          }

          if(m[i].materialStock >= m[i].materialQuantity){
            console.log("material",m[i]);
            this.addMaterials.push(m[i]);
            // this.viewCtrl.dismiss({jobMaterial:this.addMaterials});
            this.job.jobMaterials = this.addMaterials;
            this.jobService.saveJob(this.job).subscribe(response=>{
              if(response.errorStatus){
                demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                this.component.closeLoader();
              }else{
                demo.showSwal('success-message-and-ok','Success','Job Materials Successfully');
                this.component.closeAll();
                this.viewCtrl.dismiss({jobMaterial: this.addMaterials});
              }
            },err=>{
              this.component.closeAll();
              console.log("Error in saving job");
              console.log(err);
              var msg= "Error in saving materials" + err.errorMessage;
              demo.showSwal('warning-message-and-confirmation-ok',msg);
            })
          }else {
            this.component.closeLoader();
            demo.showSwal('warning-message-and-confirmation-ok',"you have only "+m[i].materialStock+" material stock in "+m[i].materialName);
            console.log("material quantity is bigger than material stock");
            break;
          }
        }


    }

    portChange(event: {
        component: SelectSearchableComponent,
        value: any
    }) {
        console.log('selectProject:', event.value.name);
    }

    dismissMaterial()
    {
        this.navCtrl.pop();
    }

}
