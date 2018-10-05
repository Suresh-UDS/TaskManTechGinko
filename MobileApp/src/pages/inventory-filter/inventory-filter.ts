import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {SiteService} from "../service/siteService";
import {componentService} from "../service/componentService";
import{InventoryService} from "../service/inventoryService";


/**
 * Generated class for the InventoryFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-inventory-filter',
  templateUrl: 'inventory-filter.html',
})
export class InventoryFilter {

    clientList:any;
    siteList:any;
    group:any;
    selectedProject:any;
    selectedSite:any;
    msg:any;
    scrollSite:any;
    activeSite:any;
    selectedAssetGroup:any;
    searchCriteria:any;
    selectOptions:any;

    projectActive: any;
    projectindex:any;
    chooseClient = true;
    siteSpinner = false;
    showSites = false;



  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public component:componentService, public siteService:SiteService,public inventoryService:InventoryService) {
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Inventory Filter');
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
                // this.selectedProject = this.clientList[0];
                // this.selectSite(this.selectedProject);
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

    selectSite(project,i)
    {

      this.projectActive=true;
      this.projectindex = i;
      this.siteSpinner= true;
      this.chooseClient= false;
      this.showSites = false;
        this.selectedSite = project;
        this.selectedProject=project;
        this.scrollSite = true;
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
              this.siteSpinner=false;
              this.showSites = true;
              // this.chooseSite = true;
              // this.component.closeLoader();
                console.log("====Site By ProjectId======");
                console.log(response);
                this.siteList=response;
                console.log(this.siteList);
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

    highLightSite(index,site){
        console.log("Selected Site");
        console.log(site);
        this.activeSite= index;
        this.selectedSite = site;
    }

    dismiss(){

        this.viewCtrl.dismiss({project:this.selectedProject,site:this.selectedSite});
    }








}
