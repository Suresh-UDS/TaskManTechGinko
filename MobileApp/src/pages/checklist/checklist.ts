import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{ViewController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {componentService} from "../service/componentService";

/**
 * Generated class for the Checklist page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html',
})
export class Checklist {

    checkListItems:any;
    takenImages:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,private cs:componentService,
                private camera:Camera) {
        this.checkListItems=[];
        this.takenImages=[];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Checklist');
      this.checkListItems= this.navParams.get('checkListItems');
      console.log("checklistItems");
      console.log(this.checkListItems);
  }

  dismiss(){
      let data = this.checkListItems;
    this.viewCtrl.dismiss(data);
  }

  viewCamera(i) {
        console.log(i);
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {

            // console.log('imageData -' +imageData);
            imageData = 'data:image/jpeg;base64,' + imageData;
            // imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

            // if(this.checkListItems[i].image_1 !=null){
            //     console.log("image_1"+this.checkListItems[i].image_1);
            //     if(this.checkListItems[i].image_2 !=null){
            //         console.log("image_2"+this.checkListItems[i].image_2);
            //
            //         if(this.checkListItems[i].image_3 !=null){
            //             console.log("image_3"+this.checkListItems[i].image_3);
            //
            //             this.cs.showToastMessage('Cannot add more than 3 images','bottom');
            //         }else{
            //             console.log("No third image");
            //             this.checkListItems[i].image_3 = imageData;
            //         }
            //     }else{
            //         console.log("No second image");
            //         this.checkListItems[i].image_2 = imageData;
            //     }
            // }else{
            //     console.log("No first image");
            //     this.checkListItems[i].image_1 = imageData;
            // }

            this.checkListItems[i].image_1 = imageData;


        })

  }

  resetRemarks(i,completed){
      console.log(i);
      console.log(completed);
      if(completed){
          this.checkListItems[i].remarks=null;
      }
  }




}
