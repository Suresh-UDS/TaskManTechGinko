import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetAssetReadings } from './get-asset-readings';

@NgModule({
  declarations: [
    GetAssetReadings,
  ],
  imports: [
    IonicPageModule.forChild(GetAssetReadings),
  ],
})
export class GetAssetReadingsModule {}
