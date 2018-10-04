import { Component } from '@angular/core';
import {NavController, NavParams,ViewController} from "ionic-angular";
import{InventoryService} from "../service/inventoryService";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{componentService} from "../service/componentService";
import {SelectSearchableComponent} from "ionic-select-searchable";

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
  constructor(public navCtrl: NavController, public navParams: NavParams,public inventoryService:InventoryService,
              public purchaseService:PurchaseRequisitionService,public component:componentService,
              public viewCtrl:ViewController) {
      this.job=this.navParams.get('job');
      console.log(this.navParams.get('job'));
      console.log("get material");
      this.getMaterial();
      this.indents=[];


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
        console.log(m.itemcode);
        var details = {
            materialName:m.name,
            materialId:m.id,
            materialCode:m.itemCode,
            materialGroup:m.itemGroup,
            materialStock:m.storeStock,
            materialUom:m.uom,
            materialQuantity:0
        };
        this.indents.push(details);
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

        this.viewCtrl.dismiss({jobMaterial:m});
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
