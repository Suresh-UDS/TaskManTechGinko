import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
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


    constructor(public navCtrl: NavController, public navParams: NavParams,private component:componentService,
              private siteService:SiteService, private inventoryService:InventoryService, private prService:PurchaseRequisitionService
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
                console.log(response);
                this.inventoryGroups = response;
            }
        )
    }

    getIndents(site){

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
    addTransactionMaterial(m) {
        console.log(m);
        var details = {
            materialName: m.materialName,
            materialId: m.id,
            uom: m.materialUom,
            number: 1
        };
        this.transactionMaterials.push(details);
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
