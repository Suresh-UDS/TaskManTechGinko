import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CompleteJobPage} from "./completeJob";
import {JobService} from "../service/jobService";
import {AttendancePopoverPage} from "../attendance/attendance-popover";

@Component({
  selector: 'page-view-job',
  templateUrl: 'view-job.html'
})
export class ViewJobPage {

    jobDetails:any;
    completedImages:any;

    constructor(public navCtrl: NavController,public jobService:JobService,public navParams:NavParams, public authService: authService, private loadingCtrl:LoadingController, private popoverCtrl:PopoverController) {
        this.jobDetails=this.navParams.get('job');
        console.log("Job details");
        console.log(this.jobDetails);

        this.jobService.getJobDetails(this.jobDetails.id).subscribe(
            response=>{
                console.log("Response from job details");
                console.log(response);
                if(response.images.length>0){
                    console.log("Images available");
                    this.completedImages=[];
                    for(let image of response.images){
                        this.jobService.getCompletedImage(image.employeeEmpId,image.photoOut).subscribe(
                            imageData=>{
                                console.log(imageData);
                                this.completedImages.push(imageData._body);
                            },err=>{
                                console.log("Error in getting images");
                                console.log(err);
                            }
                        )
                    }

                }
            }
        )
    }

    ionViewWillEnter() {

    }

    completeJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    viewImage(img)
    {
        let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:img},{cssClass:'view-img',showBackdrop:true});
        popover.present({
        });
    }






}
