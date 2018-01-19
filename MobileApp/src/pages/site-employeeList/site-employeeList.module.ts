import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {EmployeeSiteListPage} from "./site-employeeList";

@NgModule({
  declarations: [
    EmployeeSiteListPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeeSiteListPage),
  ],
})
export class EmployeeSiteListPageModule {}
