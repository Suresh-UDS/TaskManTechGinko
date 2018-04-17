import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {authService} from "../service/authService";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {FeedbackService} from "../service/feedbackService";
import { NativeAudio } from '@ionic-native/native-audio';
@Component({
  selector: 'page-feedback-grid',
  templateUrl: 'feedback-grid.html'
})
export class FeedbackGridPage {

    feedback:any;
    fb:any;
    grids:any;
    selectedIndex:any;

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio,public myService:authService,public navParams:NavParams,public component:componentService, private siteService: SiteService, private feedbackService: FeedbackService) {
      this.feedback = this.navParams.data.feedback;
      this.fb=this.navParams.data.fb;
      this.grids=[{img:'img/paper.png',title:'No Toilet Paper',checked:false},{img:'img/bin.png',title:'Litter Bin Full',checked:false},
          {img:'img/wet.png',title:'wet Floor',checked:false},{img:'img/smell.png',title:'Foul smell',checked:false},
          {img:'img/wet.png',title:'Dirty Floor',checked:false},{img:'img/basin.png',title:'Dirty Basin',checked:false},
          {img:'img/basin.png',title:'Dirty Toilet Bowl',checked:false},{img:'img/basin.png',title:'Faulty Equipment',checked:false}]
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad Feedback Grid');
    console.log(this.feedback);
  }


    selectGrid(i)
    {
        this.nativeAudio.preloadSimple('soundPlay', 'sounds/check.mp3');

        this.nativeAudio.play('soundPlay')
        if(this.grids[i].checked)
        {
            this.grids[i].checked=false;
        }
        else
        {
            this.grids[i].checked=true;
        }
    }


}
