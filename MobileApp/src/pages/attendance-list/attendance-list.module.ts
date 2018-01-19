import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendanceListPage } from './attendance-list';

@NgModule({
  declarations: [
    AttendanceListPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceListPage),
  ],
})
export class AttendanceListPageModule {}
