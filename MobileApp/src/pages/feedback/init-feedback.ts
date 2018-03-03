import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";

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
  zones:any;

  constructor(public navCtrl: NavController,public myService:authService,public component:componentService, private siteService: SiteService) {

  }

    start()
    {
        this.navCtrl.push(FeedbackPage);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Init Feedback');

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

    selectSite(projectId)
    {

        this.siteService.findSitesByProject(projectId).subscribe(
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

    selectBlock(siteId)
    {
        this.siteService.findBlock(siteId).subscribe(
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
                this.component.showToastMessage(this.msg,'bottom');
            }
        )
    }

    selectZone(blockId)
    {
            this.siteService.findBlock(blockId).subscribe(
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
            this.component.showToastMessage(this.msg,'bottom');
        }
        )
    }

}
