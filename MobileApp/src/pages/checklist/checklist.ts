import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{ViewController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";

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
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
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

            this.takenImages.push(imageData);
            this.checkListItems[i].image_1 = this.takenImages[0];
            this.checkListItems[i].image_2 = this.takenImages[1];
            this.checkListItems[i].image_3 = this.takenImages[2];


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
