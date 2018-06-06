import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobFilter } from './job-filter';

@NgModule({
  declarations: [
    JobFilter,
  ],
  imports: [
    IonicPageModule.forChild(JobFilter),
  ],
})
export class JobFilterModule {}
