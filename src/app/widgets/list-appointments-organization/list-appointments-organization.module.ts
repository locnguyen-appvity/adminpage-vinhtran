import { NgModule } from '@angular/core';
import { ListAppointmentsOrganizationComponent } from './list-appointments-organization.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    ListAppointmentsOrganizationComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [ListAppointmentsOrganizationComponent]
})
export class ListAppointmentsOrganizationModule { }
