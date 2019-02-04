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

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio,public myService:authService,public navParams:NavParams,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService, private sanitizer:DomSanitizer) {
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
        // this.component.showLoader("Saving Feedback");
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

        this.navCtrl.push(FeedbackGridFinish,{feedback:this.navParams.data.feedback,fb:this.navParams.data.fb,question:this.questions,remarks:this.remarks,overallFeedback:this.navParams.data.overallFeedback,project:this.navParams.data.project,site:this.navParams.data.site,location:this.navParams.data.location});


    }


}
