import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

/**
 * Generated class for the AssetView page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-asset-view',
  templateUrl: 'asset-view.html',
})
export class AssetView {

  assetDetails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.assetDetails = this.navParams.data.assetDetails;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetView');
  }

}
