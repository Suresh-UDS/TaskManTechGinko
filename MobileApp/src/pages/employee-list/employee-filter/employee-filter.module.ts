import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeeFilter } from './employee-filter';

@NgModule({
  declarations: [
    EmployeeFilter,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeFilter),
  ],
})
export class EmployeeFilterModule {}
