import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ticket } from './ticket';

@NgModule({
  declarations: [
    Ticket,
  ],
  imports: [
    IonicPageModule.forChild(Ticket),
  ],
})
export class TicketModule {}
