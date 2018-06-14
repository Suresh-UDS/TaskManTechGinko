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
                this.selectSite(this.selectedProject);
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

    highLightSite(index,site){
        console.log("Selected Site");
        console.log(site);
        this.activeSite= index;
        this.selectedSite = site;
    }

    dismiss(){

        this.viewCtrl.dismiss();
    }

    typeChange(i)
    {
        this.assetType[i].status = true;
    }
    groupChange(i)
    {
        this.assetGroup[i].status = true;
    }

    filterAssets(){
        this.searchCriteria = {
            siteId:this.selectedSite.id,
            projectId:this.selectedProject.id,
            assetType:this.assetType,
            assetGroup:this.assetGroup
        };
        console.log(this.searchCriteria);

        this.viewCtrl.dismiss(this.searchCriteria);
    }



}
