import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackService} from "../service/feedbackService";
import { NativeAudio } from '@ionic-native/native-audio';
import {FeedbackPage} from "./feedback";
import {DomSanitizer} from "@angular/platform-browser";
import {FeedbackGridFinish} from "../feedback-grid-finish/feedback-grid-finish";
import {SelectFeedbackPage} from "./select-feedback";
declare  var demo ;

@Component({
  selector: 'page-feedback-grid',
  templateUrl: 'feedback-grid.html'
})
export class FeedbackGridPage {
    remarks: string;

    feedback:any;
    fb:any;
    grids:any;
    selectedIndex:any;
    questions:any;
    spinner=true;

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio,public myService:authService,public navParams:NavParams,public component:componentService,
              private siteService: SiteService, private feedbackService: FeedbackService, private sanitizer:DomSanitizer) {
      this.feedback = this.navParams.data.feedback;
      this.fb=this.navParams.data.fb;
      this.remarks =""
      this.grids=[{img:'img/paper.png',title:'No Toilet Paper',checked:false},{img:'img/bin.png',title:'Litter Bin Full',checked:false},
          {img:'img/wet.png',title:'wet Floor',checked:false},{img:'img/smell.png',title:'Foul smell',checked:false},
          {img:'img/dirty.png',title:'Dirty Floor',checked:false},{img:'img/basin.png',title:'Dirty Basin',checked:false},
          {img:'img/toilet.jpg',title:'Dirty Toilet Bowl',checked:false},{img:'img/basin.png',title:'Faulty Equipment',checked:false}]

      console.log(this.navParams.data);

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad Feedback Grid');
    console.log(this.feedback);
    this.questions = this.feedback.questions;
    for(let i=0;i<this.questions.length;i++){
        // if(this.grids.length>i){
        //     console.log((this.grids.length-i)-1);
        //     this.questions[i].img = this.grids[(this.grids.length-i)-1].img;
        //     this.questions[i].answer = false;
        // }else{
        //     console.log(i-this.grids.length);
        //     this.questions[i].img = this.grids[i-this.grids.length].img;
        //     this.questions[i].answer = false;
        //
        // }

        delete this.questions[i].answer;


        var image = this.feedbackService.getImage(this.questions[i].image,this.feedback.id).subscribe(
            response=>{
                var checkImg=response.split(',');
                if(checkImg[1].length==0)
                {
                    this.questions[i].img = "";
                }
                else
                {
                    this.questions[i].img = this.sanitizer.bypassSecurityTrustUrl(response);
                }
                this.spinner=false;
            }
        )


    }
    console.log(this.questions);
  }


    selectGrid(i)
    {
        this.nativeAudio.preloadSimple('soundPlay', 'sounds/check.mp3');

        this.nativeAudio.play('soundPlay')
        if(this.questions[i].answer)
        {
            this.questions[i].answer=false;
        }
        else
        {
            this.questions[i].answer=true;
        }
    }

    cancel(){
      this.navCtrl.pop();
    }

    submitFeedback(){
        this.component.showLoader("Saving Feedback");
        console.log("feedback details");
        console.log(this.navParams.data.fb);
        console.log(this.navParams.data.feedback);
        console.log(this.navParams.data.userName);
        console.log(this.questions);

        var results = [];
        for(let q of this.questions){
            let result = {};
            if(q.answer){
                q.answer = true;
            }else{
                q.answer = false;
            }

            results.push(result);
            console.log(results)
        }

        // this.navCtrl.push(FeedbackGridFinish,{feedback:this.navParams.data.feedback,fb:this.navParams.data.fb,
        //     question:this.questions,remarks:this.remarks,overallFeedback:this.navParams.data.overallFeedback,project:this.navParams.data.project,
        //     site:this.navParams.data.site,location:this.navParams.data.location});

            var feedbackTransaction = {
                results:this.questions,
                reviewerName:"Anonymous",
                reviewerCode:"Anonymous",
                siteId:this.navParams.data.fb.siteId,
                siteName:this.navParams.data.fb.siteName,
                projectId:this.navParams.data.fb.projectId,
                projectName:this.navParams.data.fb.projectName,
                feedbackId:this.navParams.data.feedback.id,
                feedbackName:this.navParams.data.feedback.name,
                block:this.navParams.data.fb.block,
                floor:this.navParams.data.fb.floor,
                zone:this.navParams.data.fb.zone,
                remarks:this.remarks,
                overallFeedback:false
            };

            console.log(feedbackTransaction);

            this.feedbackService.saveFeedback(feedbackTransaction).subscribe(
                response=>{
                    console.log("Saving feeback");
                    console.log(response);
                    this.questions = null;
                    this.component.closeLoader();
                    demo.showSwal('feedback-success','Thank you!','For your Feedback');
                    // this.navCtrl.setRoot(InitFeedbackZone,{feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
                    this.navCtrl.setRoot(SelectFeedbackPage,{fb:this.navParams.data.fb,feedback:this.navParams.data.feedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});
                },err=>{
                    console.log("error in saving feedback");
                    this.component.closeLoader();
                    demo.showSwal('warning-message-and-confirmation-ok','Failed to Save','Unable to save feedback');
                    console.log(err)
                }
            )




    }


}
