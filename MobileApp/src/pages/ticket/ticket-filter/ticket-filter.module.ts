import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketFilter } from './ticket-filter';

@NgModule({
  declarations: [
    TicketFilter,
  ],
  imports: [
    IonicPageModule.forChild(TicketFilter),
  ],
})
export class TicketFilterModule {}
