import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AttendanceViewPage} from "../attendance-view/attendance-view";
import {authService} from "../service/authService";
/**
 * Generated class for the AttendanceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance-list',
  templateUrl: 'attendance-list.html',
})
export class AttendanceListPage {
  siteList:any;
  attendances:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public camera: Camera, private authService: authService) {

  }

  ionViewDidLoad() {
    var now = new Date().getTime();
    console.log('ionViewDidLoad AttendanceListPage'+now);
    this.attendances = this.navParams.get('attendances');
    console.log(this.attendances);
  }
  viewCamera()
  {
  const options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
  };

  this.camera.getPicture(options).then((imageData) => {

    let base64Image = 'data:image/jpeg;base64,' + imageData;

    // this.navCtrl.push(AttendanceViewPage,base64Image)
    }, (err) => {

    })
  }

}

