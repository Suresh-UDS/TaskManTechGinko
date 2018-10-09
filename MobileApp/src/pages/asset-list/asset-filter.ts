import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {AssetService} from "../service/assetService";

/**
 * Generated class for the AssetFilter page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-asset-list',
    templateUrl: 'asset-filter.html',
})
export class AssetFilter {

    clientList:any;
    siteList:any;
    assetGroup:any;
    selectedProject:any;
    selectedSite:any;
    msg:any;
    scrollSite:any;
    activeSite:any;
    selectedAssetGroup:any;
    searchCriteria:any;
    selectOptions:any;
    page:1;
    totalPages:0;
    pageSort:15;
    count=0;
    assetType:any;
    selectedAssetType:any;

    chooseClient = true;
    projectActive: any;
    siteSpinner = false;
    showSites = false;
    projectindex: any;
    index: any;
    siteActive: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public component:componentService,
                public siteService:SiteService, public assetService:AssetService) {

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AssetFilter');
        this.component.showLoader('Getting Project');
        this.selectOptions={
            cssClass: 'selectbox-popover'
        }
        this.siteService.getAllProjects().subscribe(
            response=>{
                console.log("====project======");
                console.log(response);
                this.clientList=response;
                this.selectedProject = this.clientList[0];
                // this.selectSite(this.selectedProject);
                console.log('select default value:');
                this.component.closeLoader();
            },
            error=>{
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }
                this.component.showToastMessage(this.msg,'bottom');
                this.component.closeLoader();
            }
        )

        this.assetService.getAssetType().subscribe(
            response=>
            {
                console.log("Get Asset type Response");
                console.log(response);
                this.assetType = response;
            },error=>
            {
                console.log("Get Asset Type  Reading");
                console.log(error);
            }
        )
        this.assetService.getAssetGroup().subscribe(
            response=>
            {
                console.log("Get Asset Group Response");
                console.log(response);
                this.assetGroup = response;
            },error=>
            {
                console.log("Get Asset Group Reading");
                console.log(error);
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

      this.selectedProject = project;
        this.scrollSite = true;
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
              this.siteSpinner=false;
              this.showSites = true;
                console.log("====Site By ProjectId======");
                console.log(response);
                this.siteList=response;
                console.log(this.siteList);
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

    highLightSite(i,site){
      this.index = i;
      this.projectActive = true;
      this.siteActive = true;
      this.selectedSite = site;
        console.log("Selected Site");
        console.log(site);
        // this.activeSite= index;
        this.selectedSite = site;
    }

    dismiss(){

        this.viewCtrl.dismiss();
    }

    typeChange(type)
    {
       this.selectedAssetType=type.name;
    }
    groupChange(group)
    {
       this.selectedAssetGroup=group.assetgroup;
    }

    filterAssets(){
      console.log("selected project",this.selectedProject);
      console.log("selected site",this.selectedSite);
        this.searchCriteria={};
        // this.searchCriteria = {
        //     siteId:this.selectedSite.id,
        //     projectId:this.selectedProject.id,
        //     assetType:this.selectedAssetType,
        //     assetGroup:this.selectedAssetGroup
        // };
        if(this.selectedAssetGroup){
         this.searchCriteria.assetGroup=this.selectedAssetGroup;
        }
        if(this.selectedAssetType){
            this.searchCriteria.assetType=this.selectedAssetType;
        }
        if(this.selectedProject){
            this.searchCriteria.projectId=this.selectedProject;
        }
        if(this.selectedSite){
            this.searchCriteria.siteId=this.selectedSite;
        }
        console.log(this.searchCriteria);

        this.viewCtrl.dismiss(this.searchCriteria);
    }



}
