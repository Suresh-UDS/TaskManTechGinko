import { Component } from '@angular/core';
import {NavController, NavParams, AlertController} from "ionic-angular";
import{componentService} from "../service/componentService";
import{SiteService} from "../service/siteService";
import {InventoryService} from "../service/inventoryService";
import {PurchaseRequisitionService} from "../service/PurchaseRequisitionService";

/**
 * Generated class for the AddInventoryTransaction page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-inventory-transaction',
  templateUrl: 'add-inventory-transaction.html',
})
export class AddInventoryTransaction {


  searchText: any;
    shouldShowCancel: boolean;

    numbers: any;
    clientList: any;
    siteList: any;
    selectedProject: any;
    selectedSite: any;
    msg: any;
    group: any;
    scrollSite: any;
    activeSite: any;
    selectedAssetGroup: any;
    searchCriteria: any;
    selectOptions: any;
    type: any;
    inventoryGroups: any;
    inventoryMaterial: any;
    indentMaterial: any;

    transactionMaterials: any;
    selectedMaterial: any;
    inventoryTransaction:any;
    indentList: any;
    quantity: any;
    chooseClient = true;
    projectActive: any;
    siteSpinner = false;
    showSites = false;
    projectindex: any;
    index: any;
    siteActive: any;


    constructor(public navCtrl: NavController, public navParams: NavParams,private component:componentService,
              private siteService:SiteService, private inventoryService:InventoryService, private prService:PurchaseRequisitionService,
                public alertCtrl: AlertController
  ) {

        this.transactionMaterials = [];
        this.indentList = [];
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Indent');
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
                // this.selectSite(this.selectedProject);
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
    }

    selectSite(project,i) {
      this.projectActive=true;
      this.projectindex = i;
      this.siteSpinner= true;
      this.chooseClient= false;
      this.showSites = false;
        this.selectedProject = project;
        this.scrollSite = true;
        this.siteService.findSitesByProject(project.id).subscribe(
            response => {
              this.siteSpinner=false;
              this.showSites = true;
                console.log("Site By ProjectId");
                console.log(response);
                this.siteList = response;
                console.log(this.siteList);
                this.getAllInventoryGroups();
            },
            error => {
                if (error.type == 3) {
                    this.msg = 'Server Unreachable';
                }
                this.component.showToastMessage(this.msg, 'bottom');
            }
        )
    }

    dismiss() {
        this.navCtrl.pop();
    }

    getAllInventoryGroups() {
        this.inventoryService.getAllGroups().subscribe(
            response => {
                console.log("site response")
                console.log(response);
                this.inventoryGroups = response;
            }
        )
    }

    getIndents(site,i){

      this.index = i;
      this.projectActive = true;
      this.siteActive = true;
      this.selectedSite = site;
        var searchCriteria = {
            siteId:site.id,
            list:true
        };
        this.prService.searchMaterialIndents(searchCriteria).subscribe(
            response=>{
                console.log("Indent list");
                console.log(response.transactions);
                this.indentList = response.transactions;
            },
            err=>{
                console.log("Error in getting indent");
                console.log(err);
            }
        )

       /* var siteId ={
          siteID:this.indentList.siteId,
          list:true
        };
      this.prService.getMaterialBySite(siteId).subscribe(
        response=>{
          console.log("Get Material by Site");
          console.log(response);
          // this.indentMaterial=response.items;
        },err=>{
          console.log("Error in getting Material group by site");
          console.log(err);
        }
      )*/

    }

  getMaterialByIndent(indent){
      this.prService.getMaterialByIndents(indent.id).subscribe(
        response=>{
            console.log("Get Material By Indent");
            console.log(response);
            this.indentMaterial = response.items;
        },err=>{
          console.log("Error in getting Material group by indent");
          console.log(err);
        }
      )


    }



    getMaterialByGroup(group) {
        this.inventoryService.getMaterialsByGroup(group.id).subscribe(
            response => {
                console.log("Get Material Group");
                console.log(response);
                this.inventoryMaterial = response.items;
            }, err => {
                console.log("Error in getting  material group");
                console.log(err);
            }
        )
    }

  selectMaterial(m) {
    this.selectedMaterial = m;
  }
    addTransactionMaterial() {
        console.log("selected site");
        console.log(this.selectedSite);
        console.log(this.selectedMaterial.materialStoreStock);
        if(this.selectedMaterial.materialStoreStock >= this.quantity){
            let confirm =  this.alertCtrl.create({
              title: 'Alert',
              message:'Do you want to save?',
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
                      siteId:this.selectedSite.id,
                      projectId:this.selectedProject.id,
                      materialId:this.selectedMaterial.materialId,
                      materialItemCode:this.selectedMaterial.materialItemCode,
                      materialName:this.selectedMaterial.materialName,
                      storeStock:this.selectedMaterial.materialStoreStock,
                      uom:this.selectedMaterial.materialUom,
                      materialGroupId:this.selectedMaterial.materialItemGroupId,
                      quantity:this.quantity,
                      transactionType:"ISSUED",
                      transactionDate:new Date()
                    };
                    console.log("transaction details");
                    console.log(details);
                    this.prService.saveInventoryTransaction(details).subscribe(
                      response=>{
                        console.log("Save Inventory Transaction");
                        console.log(response);
                        this.component.showToastMessage("Inventory Transaction saved Successfully",'bottom');
                        var trans_list ={
                          materialName: response.materialName,
                          quantity:response.quantity,
                          uom:response.uom
                        }
                        this.transactionMaterials.push(trans_list);
                      },err=>{
                        console.log("Error in save inventory transaction");
                        console.log(err);
                        this.component.showToastMessage("Error in save inventory transaction",'bottom');
                      }
                    )
                  }
                }
              ]
            });
            confirm.present();
        }else {
          this.component.showToastMessage("Your store stock is "+this.selectedMaterial.materialStoreStock,'bottom');
        }


    }

    removeTransaction(i) {
        this.transactionMaterials.pop(i);
    }

    onInput(event) {
        console.log("event");
        console.log(event);
        console.log(event.data);
    }

    f(searchText) {
        console.log("function");
        console.log(searchText);
    }

    /*selectMaterial(m) {
        console.log("m");
        console.log(m);
    }*/
}
