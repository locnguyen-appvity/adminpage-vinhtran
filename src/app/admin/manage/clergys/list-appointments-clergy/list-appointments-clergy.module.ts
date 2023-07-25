import { NgModule } from '@angular/core';
import { ListAppointmentsClergyComponent } from './list-appointments-clergy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    ListAppointmentsClergyComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [ListAppointmentsClergyComponent]
})
export class ListAppointmentsClergyModule { }
