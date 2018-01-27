import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import * as moment from 'moment';

@Component({
  selector: 'page-add-job',
  templateUrl: 'add-job.html'
})
export class CreateJobPage {

    jobDetails:any;

    title:any;
    description:any;
    location:any;
    startDate:any;
    startTime:any;
    newJob:any;
    dateTime:any;

    constructor(public navCtrl: NavController,public navParams:NavParams,public myService:authService, public authService: authService, private loadingCtrl:LoadingController) {
        this.jobDetails=this.navParams.get('job');
    }

    ionViewDidLoad() {

    }
    createJob()
    {
        var sDate = moment(this.startDate).format("MM/DD/YYYY");
        var sTime = moment(this.startTime).format("hh:mm A");
        var startDateTimeMoment = moment(sDate+' '+sTime,"MM/DD/YYYY hh:mm A");
        this.dateTime = startDateTimeMoment.toDate();
        this.newJob={
            "title":this.title,
            "description":this.description,
            "location":this.location,
            "date":this.dateTime
        }

        this.myService.addJob(this.newJob).subscribe(
            response=> {
            console.log(response);
            },
            error=>{
                console.log(error);
            }
            )
    }


}
