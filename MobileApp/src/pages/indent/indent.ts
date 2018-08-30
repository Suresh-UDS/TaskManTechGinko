import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {SiteService} from "../service/siteService";
import {componentService} from "../service/componentService";
import {InventoryService} from "../service/inventoryService";
import{ViewController} from "ionic-angular";
import{InventoryMaster} from "../inventory-master/inventory-master";
import{PurchaseRequisitionService} from "../service/PurchaseRequisitionService";
import{IndentView} from "../indent-view/indent-view";

/**
 * Generated class for the Indent page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-indent',
  templateUrl: 'indent.html',
})
export class Indent {
    searchText: any;
    shouldShowCancel: boolean;
    material:any;

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
    referenceNumber:any;
    indent: any;
    selectedMaterial: any;
    pageSort:15;
    page:1;

    constructor(public navCtrl: NavController, public navParams: NavParams, private component: componentService,
                private siteService: SiteService, private inventoryService: InventoryService,
                public viewCtrl:ViewController,public purchaseService:PurchaseRequisitionService) {
        this.indent = [];
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

    getMaterialByGroup(group) {
        this.inventoryService.getMaterialsByGroup(group.id).subscribe(
            response => {
                console.log("Get Material Group");
                console.log(response);
                this.inventoryMaterial = response;
            }, err => {
                console.log("Error in getting  material group");
                console.log(err);
            }
        )
    }

    addIndent(m) {
        console.log(m);
        var details = {
            materialName: m.name,
            materialId: m.id,
            materialItemCode:m.code,
            materialStoreStock:m.storeStock,
            materialUom:m.uom,
            quantity:m.quantity
        };
        this.indent.push(details);
    }

    removeTransaction(i) {
        this.indent.pop(i);
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

    selectMaterial(m) {
        this.selectedMaterial = m;
    }

    searchMaterials(siteId)
    {
        var searchCriteria={
            currPage:this.page,
            pageSort: this.pageSort,
            siteId:siteId,
            list:true,
        }
        this.inventoryService.getMaterials(searchCriteria).subscribe(
            response=>{
                console.log("Getting Materials");
                console.log(response);
                this.inventoryMaterial=response.transactions;
            },error=>
            {
                console.log("Error in getting materials");
                console.log(error);
            }
        )
    }

    saveIndentMaterial(){

        var indentDetails = {
          siteId:this.selectedSite.id,
          projectId:this.selectedProject.id,
          items:this.indent,
          indentReferenceNumber:this.referenceNumber,
          requestedDate:new Date()
        };
        this.purchaseService.saveIndentMaterial(indentDetails).subscribe(
            response=>{
                console.log("Save indent Material");
                console.log(response);
            },err=>{
                console.log("Error in save indent material");
                console.log(err);
            }
        )
    }

    viewDetails()
    {
        this.navCtrl.push(IndentView);
    }

}

