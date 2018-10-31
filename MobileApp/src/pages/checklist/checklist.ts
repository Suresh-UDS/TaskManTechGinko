import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import{ViewController} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {componentService} from "../service/componentService";
import {JobService} from "../service/jobService";

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
    jobDetails:any;
    showIcon:any;
    index:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
                private camera:Camera,private component:componentService, private jobService: JobService) {

        this.checkListItems=[];
        this.takenImages=[];
        this.jobDetails=[];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Checklist');
      this.component.showLoader('Loading Checklist Details');
      this.jobDetails= this.navParams.data.jobDetails;
      console.log(this.jobDetails);
      this.jobService.getJobDetails(this.jobDetails.id).subscribe(
          response=> {
              this.component.closeLoader();
              console.log("Response on job details");
              console.log(response);
              this.jobDetails = response;
          },error=> {
              this.component.closeLoader();
              console.log("Error in getting job details");
              console.log(error);
              this.component.showToastMessage("Errror in getting job details", "bottom");
          })

      this.checkListItems = this.jobDetails.checklistItems;
      console.log(this.checkListItems);

      this.showIcon = false;
  }

  dismiss(){
      let data = this.checkListItems.remarks;
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

    saveJob(job) {
        this.component.showLoader('upload Image');
        console.log("view jobs ")
        console.log(job)
        this.jobService.saveJob(job).subscribe(
            response => {
                console.log("Save Job response");
                this.component.closeLoader();
                this.component.showToastMessage('Image Upload Successfully', 'bottom');
                console.log(response);
            }, err => {
                console.log("Error in saving response");
                console.log(err);
                this.component.closeLoader();
                this.component.showToastMessage('Error in upload image, please try again...', 'bottom');
            })


    }
    show(show,i)
    {
        this.showIcon = !show;
        this.index = i;
    }
}
