import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";
import {FeedbackService} from "../service/feedbackService";

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
  location:any;

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
        this.loadFeedbackMappings();
  }

    start(fb)
    {
        var feedback =fb.feedback;
        if(feedback){
            this.navCtrl.push(FeedbackPage,{feedback:feedback,fb:fb});

        }else{
            this.component.showToastMessage('Please select feedback','bottom');
        }
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Init Feedback');

      this.selectOptions={
          cssClass: 'selectbox-popover'
      }

    this.siteService.getAllProjects().subscribe(
        response=>{
          console.log("====project======");
          console.log(response);
          this.projects=response;
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

    selectSite(project)
    {
        this.selectedProject = project;
        this.siteService.findSitesByProject(project.id).subscribe(
            response=>{
                console.log("====Site By ProjectId======");
                console.log(response);
                this.sites=response;
                console.log(this.sites);
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

    // selectBlock(site)
    // {
    //     this.selectedSite = site;
    //
    //     this.feedbackService.loadBlocks(this.selectedProject.id,site.id).subscribe(
    //         response=>{
    //             console.log("====Block By SiteId======");
    //             console.log(response);
    //             this.blocks=response;
    //             console.log(this.blocks);
    //         },
    //         error=>{
    //             if(error.type==3)
    //             {
    //                 this.msg='Server Unreachable'
    //             }
    //             this.msg="Error in getting blocks";
    //             this.component.showToastMessage(this.msg,'bottom');
    //         }
    //     )
    // }
    //
    // selectFloor(block){
    //   this.selectedBlock = block;
    //   this.feedbackService.loadFloors(this.selectedProject.id,this.selectedSite.id,this.selectedBlock).subscribe(
    //       response=>{
    //           console.log("=====floors=====");
    //           console.log(response);
    //           this.floors = response;
    //       },error=>{
    //         if(error.type==3)
    //         {
    //             this.msg='Server Unreachable'
    //         }
    //         this.msg="Error in getting zones";
    //         this.component.showToastMessage(this.msg,'bottom');
    //     }
    //   )
    // }
    //
    // selectZone(floor)
    // {
    //     this.selectedFloor = floor;
    //         this.feedbackService.loadZones(this.selectedProject.id,this.selectedSite.id,this.selectedBlock, floor).subscribe(
    //         response=>{
    //         console.log("====Zone By BlockId======");
    //         console.log(response);
    //         this.zones=response;
    //         console.log(this.zones);
    //     },
    //     error=>{
    //         if(error.type==3)
    //         {
    //             this.msg='Server Unreachable'
    //         }
    //         this.msg="Error in getting zones";
    //         this.component.showToastMessage(this.msg,'bottom');
    //     }
    //     )
    // }

    loadFeedbackMappings(){
        var currPageVal = 1;
        var searchCriteria = {
            currPage:currPageVal,
            findAll:true
        }

        this.feedbackService.searchFeedbackMappings(searchCriteria).subscribe(
            response=>{
                console.log(response.transactions);
                this.feedbacks=response.transactions;
            }
        )

    }

    selectBlockDetail(index,site)
    {
        this.scrollSite=true;
        this.activeSite=index;
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
                this.location=response.transactions;
            }
        )
    }


}
