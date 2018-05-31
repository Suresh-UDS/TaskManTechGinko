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
    selector: 'page-asset-filter',
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

    page:1;
    totalPages:0;
    pageSort:15;
    count=0;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public component:componentService,
                public siteService:SiteService, public assetService:AssetService) {
        this.assetGroup = [
            {name:"CMRL"},
            {name:"UDS House Keeping Assets"},
            {name:"UDS Electrical Assets"},
            {name:"UDS Plumbing Assets"}
        ]
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AssetFilter');
        this.component.showLoader('Getting Project');
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
        let data={'foo':'bar'};
        this.viewCtrl.dismiss(data);
    }

    filterAssets(){
        this.searchCriteria = {
            siteId:this.selectedSite.id,
            projectId:this.selectedProject.id,
        };
        this.viewCtrl.dismiss(this.searchCriteria);
    }



}
