import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{componentService} from "../service/componentService";
import{SiteService} from "../service/siteService";
import {InventoryService} from "../service/inventoryService";

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

    numbers:any;
    clientList:any;
    siteList:any;
    selectedProject:any;
    selectedSite:any;
    msg:any;
    group:any;
    scrollSite:any;
    activeSite:any;
    selectedAssetGroup:any;
    searchCriteria:any;
    selectOptions:any;
    type:any;
    inventoryGroups:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private component:componentService,
              private siteService:SiteService, private inventoryService:InventoryService
  ) {

      this.numbers = [0,1,2,3,4,5,6,7,8,9,10];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInventoryTransaction');
      this.component.showLoader('Getting Project');
      this.selectOptions={
          cssClass: 'selectbox-popover'
      }
      this.siteService.getAllProjects().subscribe(

          response=>{
              this.component.closeLoader();
              console.log("====project======");
              console.log(response);
              this.clientList=response;
              this.selectedProject = this.clientList[0];
              this.selectSite(this.selectedProject);
              console.log('select default value:');
          },
          error=>{
              this.component.closeLoader();
              if(error.type==3)
              {
                  this.msg='Server Unreachable'
              }
              this.component.showToastMessage(this.msg,'bottom');
          }
      )


  }

    selectSite(project)
    {
        this.selectedProject = project;
        this.scrollSite = true;
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
                console.log("====Site By ProjectId======");
                console.log(response);
                this.siteList=response;
                console.log(this.siteList);
                this.getAllInventoryGroups();
            },
            error=>{
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }
                this.component.showToastMessage(this.msg,'bottom');
            }
        )
    }

    dismiss()
    {
      this.navCtrl.pop();
    }

    getAllInventoryGroups(){
        this.inventoryService.getAllGroups().subscribe(
            response=>{
                console.log(response);
                this.inventoryGroups = response;
            }
        )
    }

}
