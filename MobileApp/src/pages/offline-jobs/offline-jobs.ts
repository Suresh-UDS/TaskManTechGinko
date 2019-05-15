import { Component } from '@angular/core';
import {Item, ItemSliding, NavController, NavParams} from "ionic-angular";
import {componentService} from "../service/componentService";
import {DBService} from "../service/dbService";
import {ViewJobPage} from "../jobs/view-job";
import {OfflineCompleteJob} from "../offline-complete-job/offline-complete-job";
import {DatabaseProvider} from "../../providers/database-provider";

@Component({
  selector: 'page-offline-jobs',
  templateUrl: 'offline-jobs.html',
})
export class OfflineJobs {
  private jobDetails: any;
  private spinner: boolean;
  private count: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private componentService: componentService,
              public dbService: DBService, public dbProvider: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineJobs');

      this.jobDetails= null;
      this.spinner = true;
      //offline
      this.dbProvider.getJobsData().then(
        (res) => {
          this.spinner=false;
          console.log("job details");
          console.log(res)
          this.jobDetails = res
        },
        (err) => {
          this.spinner=false;

        }
      )
  }

  viewJob(job) {
    console.log("========view job ===========");
    console.log(job);
    this.navCtrl.push(ViewJobPage, {job: job})
  }

  compeleteJob(job) {
    this.navCtrl.push(OfflineCompleteJob, {job: job})
  }

  open(itemSlide: ItemSliding, item: Item, c) {
    this.count = c;
    if (c == 1) {
      this.count = 0;
      console.log('------------:' + this.count);
      this.close(itemSlide);
    }
    else {
      this.count = 1;
      console.log('------------:' + this.count);
      itemSlide.setElementClass("active-sliding", true);
      itemSlide.setElementClass("active-slide", true);
      itemSlide.setElementClass("active-options-right", true);
      item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
    }

  }

  close(item: ItemSliding) {
    this.count = 0;
    item.close();
    item.setElementClass("active-sliding", false);
    item.setElementClass("active-slide", false);
    item.setElementClass("active-options-right", false);
  }


}
