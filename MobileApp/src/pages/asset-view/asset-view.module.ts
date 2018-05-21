import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetView } from './asset-view';

@NgModule({
  declarations: [
    AssetView,
  ],
  imports: [
    IonicPageModule.forChild(AssetView),
  ],
})
export class AssetViewModule {}
