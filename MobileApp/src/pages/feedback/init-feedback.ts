import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";
import {FeedbackService} from "../service/feedbackService";
import {FeedbackDashboardPage} from "./feedback-dashboard";
import {SelectFeedbackPage} from "./select-feedback";
import {InitFeedbackZone} from "./init-feedback-zone";
import {LoginPage} from "../login/login";
@Component({
  selector: 'page-init-feedback',
  templateUrl: 'init-feedback.html'
})
export class InitFeedbackPage {

  userId:any;
  employeeId: any;
  sites:any;
  projects:any;
  msg:any;
  blocks:any;
  floors:any;
  zones:any;
  selectedProject:any;
  selectedSite:any;
  selectedBlock:any;
  selectedFloor:any;
  selectedZone:any;
  feedbacks:any;
  selectOptions:any;
  scrollSite=false;
  activeSite:any;
  scrollSites:any;
  blockDetail:any;
  searchCriteria:any;
  locations:any;
    open=false;
    openProjects:any;
    selectedProjectId:any;
    siteProjectId:any;
    selectProjectIndex:any;
    bgClr:any;
  chooseClient = true;
  projectActive: any;
  siteSpinner = false;
  showSites = false;
  projectindex: any;
  index: any;
  siteActive: any;

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
        // this.loadFeedbackMappings();

      this.bgClr=["#986300","#cb8400","#feae19","#fec04c","#fed27f","#fedb99","#fee4b2","#feedcc","#fef6e5","#ffffff"]



  }

    start(fb)
    {
        var feedback =fb.feedback;
        if(feedback){
            this.navCtrl.push(SelectFeedbackPage,{feedback:feedback,fb:fb});

        }else{
            this.component.showToastMessage('No Feedback form available','bottom');
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabsPage');
        if(window.localStorage.getItem('session')){
            console.log("Session available");
            // this.component.showToastMessage('Previous Login Detected, Login automatically','bottom');
            console.log('ionViewDidLoad Init Feedback');

            this.selectOptions={
                cssClass: 'selectbox-popover'
            }
            this.component.showLoader('Getting Project');
            this.siteService.getAllProjects().subscribe(
                response=>{
                    console.log("====project======");
                    console.log(response);
                    this.projects=response;
                    this.selectedProject = this.projects[0];
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
        }else{
            console.log("Session not Available");
            this.component.showToastMessage('Session not available, please login','bottom');
            this.navCtrl.setRoot(LoginPage);
        }
    }



    selectSite(project,i)
    {
      this.projectActive=true;
      this.projectindex = i;
      this.siteSpinner= true;
      this.chooseClient= false;
      this.showSites = false;
        this.selectedProject = project;
        this.selectedProjectId=project.id;
        this.locations=[];
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
              this.siteSpinner=false;
              this.showSites = true;
                console.log("====Site By ProjectId======");
                console.log(response);
                this.sites=response;
                console.log(this.sites);
                // this.selectBlockDetail(this.sites[0],this.sites[0]);
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

    selectBlock(site)
    {
        this.selectedSite = site;

        this.feedbackService.loadBlocks(this.selectedProject.id,site.id).subscribe(
            response=>{
                console.log("====Block By SiteId======");
                console.log(response);
                this.blocks=response;
                console.log(this.blocks);
            },
            error=>{
                if(error.type==3)
                {
                    this.msg='Server Unreachable'
                }
                this.msg="Error in getting blocks";
                this.component.showToastMessage(this.msg,'bottom');
            }
        )
    }

    selectFloor(block){
      this.selectedBlock = block;
      this.feedbackService.loadFloors(this.selectedProject.id,this.selectedSite.id,this.selectedBlock).subscribe(
          response=>{
              console.log("=====floors=====");
              console.log(response);
              this.floors = response;
          },error=>{
            if(error.type==3)
            {
                this.msg='Server Unreachable'
            }
            this.msg="Error in getting zones";
            this.component.showToastMessage(this.msg,'bottom');
        }
      )
    }

    selectZone(floor)
    {
        this.selectedFloor = floor;
            this.feedbackService.loadZones(this.selectedProject.id,this.selectedSite.id,this.selectedBlock, floor).subscribe(
            response=>{
            console.log("====Zone By BlockId======");
            console.log(response);
            this.zones=response;
            console.log(this.zones);
        },
        error=>{
            if(error.type==3)
            {
                this.msg='Server Unreachable'
            }
            this.msg="Error in getting zones";
            this.component.showToastMessage(this.msg,'bottom');
        }
        )
    }

    loadFeedbackMappings(location){
      console.log("Selected location");
      console.log(location);
        var currPageVal = 1;
        var searchCriteria = {
            currPage:currPageVal,
            findAll:false,
            block:location.block,
            floor:location.floor,
            zone:location.zone,
            siteId:location.siteId

        }

        this.selectZonePage(location);

        // this.feedbackService.searchFeedbackMappings(searchCriteria).subscribe(
        //     response=>{
        //         console.log(response.transactions);
        //         this.feedbacks=response.transactions;
        //         this.start(response.transactions[0]);
        //     }
        // )

    }

    selectBlockDetail(i,site)
    {
      this.index = i;
      this.projectActive = true;
      this.siteActive = true;
        this.scrollSite=true;
        this.siteProjectId=site.projectId;
        this.selectedSite = site;
        this.loadLocations(site.id);
        console.log(this.scrollSite);
        console.log(this.activeSite);
    }

    loadLocations(siteId){
        var currPageVal = 1;
        this.searchCriteria = {
            currPage:currPageVal,
            findAll:false,
            siteId:siteId
        };

        this.feedbackService.loadLocations(this.searchCriteria).subscribe(
            response=>{
                console.log("Loading Locations");
                console.log(response);
                this.locations=response.transactions;
            }
        )
    }

    goDashboard(selectedSite)
    {
        console.log("selected site");
        console.log(selectedSite);
        this.navCtrl.push(FeedbackDashboardPage,{site:selectedSite});
    }

    viewProject(p,i)
    {
        console.log(p);
        this.selectedProject=p.name;
        this.openProjects=true;
        this.selectProjectIndex=i;
    }

    selectZonePage(location){
        if(location){
            this.navCtrl.push(InitFeedbackZone,{project:this.selectedProject,site:this.selectedSite,location:location});
        }else{
            this.component.showToastMessage('No Locations configured','bottom');
        }
    }


}
