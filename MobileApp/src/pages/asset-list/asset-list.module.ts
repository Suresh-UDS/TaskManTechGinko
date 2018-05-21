import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssetList } from './asset-list';

@NgModule({
  declarations: [
    AssetList,
  ],
  imports: [
    IonicPageModule.forChild(AssetList),
  ],
})
export class AssetListModule {}
