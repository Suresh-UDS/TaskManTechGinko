import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackPage} from "../feedback/feedback";
import {FeedbackService} from "../service/feedbackService";
import { Chart } from 'chart.js';
@Component({
  selector: 'page-feedback-dashboard',
  templateUrl: 'feedback-dashboard.html'
})
export class FeedbackDashboardPage {

    barChart: any;
    doughnutChart: any;
    lineChart: any;
    site:any;

    lineLabel:any;
    lineData:any;

    donutLabel:any;
    donutData:any;

    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;

    constructor(public navCtrl: NavController, public navParams: NavParams, public myService: authService, public component: componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
        // this.loadFeedbackMappings();
        console.log("Nav params from init feedback");
        console.log(this.navParams.data);
        this.site = this.navParams.data.site;

        this.lineLabel = [];
        this.lineData=[];
        this.donutLabel=[];
        this.donutData=[];
    }

    getReports(site){
        var searchCriteria={
            currPage:1,
            checkInDateTimeFrom:new Date(),
            checkInDateTimeTo: new Date(),
            projectId:site.projectId,
            siteId:site.id,
            block:site.block,
            floor:site.floor,
            zone:site.zone
        }

        this.feedbackService.generateFeedback(searchCriteria).subscribe(
            response=>{
                console.log("feedback service response reports");
                console.log(response);
                this.lineLabel = [];
                this.lineData=[];
                this.donutLabel=[];
                this.donutData=[];

                if(response.weeklyZone && response.weeklyZone.length > 0) {
                    var zoneDateWiseRating = response.weeklyZone;
                    var zoneDateWiseDataArr = [];
                    for(var i =0;i<zoneDateWiseRating.length; i++) {
                        this.donutLabel.push(zoneDateWiseRating[i].date);
                        zoneDateWiseDataArr.push(zoneDateWiseRating[i].rating);
                        console.log(zoneDateWiseDataArr);
                    }
                    this.donutData.push(zoneDateWiseDataArr);

                    console.log('labels - ' + JSON.stringify(this.donutLabel));
                    console.log('data - ' + JSON.stringify(this.donutData));
                    var zoneOverallRating = response.weeklyZone;
                    for(var i =0;i<zoneOverallRating.length; i++) {
                        this.donutLabel.push(zoneOverallRating[i].date);
                        this.donutData.push(zoneOverallRating[i].rating);
                    }
                    console.log('doughnut labels - ' + JSON.stringify(this.donutLabel));
                    console.log('doughnut data - ' + JSON.stringify(this.donutData));

                    this.plotLineChar(this.donutLabel,this.donutData);
                    this.plotDonutChar(this.donutLabel,this.donutData);

                }else {
                    var zoneWiseRating = response.weeklySite;
                    var zoneWiseDataArr = [];
                    for(var i =0;i<zoneWiseRating.length; i++) {
                        this.lineLabel.push(zoneWiseRating[i].zoneName);
                        zoneWiseDataArr.push(zoneWiseRating[i].rating);
                    }
                    this.lineData.push(zoneWiseDataArr);
                    var zoneDateWiseRating = response.weeklySite;
                    var zoneDateWiseDataArr = [];
                    for(var i =0;i<zoneDateWiseRating.length; i++) {
                        this.lineLabel.push(zoneDateWiseRating[i].zoneName);
                        this.lineData.push(zoneDateWiseRating[i].rating);
                    }
                    console.log('Line labels - ' + JSON.stringify(this.lineLabel));
                    console.log('Line data - ' + JSON.stringify(this.lineData));
                    //$scope.datas.push(zoneDateWiseDataArr);
                    this.plotLineChar(this.lineLabel,this.lineData);
                    this.plotDonutChar(this.lineLabel,this.lineData);

                }

            }
        )
    }

    ionViewDidLoad(){
        // this.donutLabel = ["Red","Blue","Yellow","Green","Orange"];
        // this.donutData = [12,19,3,5,2,3];
        // this.plotDonutChar(this.donutLabel,this.donutData);
        //
        // this.lineLabel = ["January", "February", "March", "April", "May", "June", "July"];
        // this.lineData = [65, 59, 80, 81, 56, 55, 40];
        // this.plotLineChar(this.lineLabel,this.lineData);

        this.getReports(this.site);
    }


    plotDonutChar(label, data){

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    label: '# of Votes',
                    data:data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            }

        });
    }

    plotLineChar(label,data){
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: label,
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data:data,
                        spanGaps: false,
                    }
                ]
            }

        });
    }
}
