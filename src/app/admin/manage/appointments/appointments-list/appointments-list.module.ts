import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentsListComponent } from './appointments-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppointmentInfoModule } from '../appointment-info/appointment-info.module';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppointmentAcceptModule } from '../appointment-accept/appointment-accept.module';


@NgModule({
  declarations: [
    AppointmentsListComponent,
  ],
  imports: [
    SharedModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    AutocompleteSimpleModule,
    AppointmentInfoModule,
    AppointmentAcceptModule
  ],
  exports: [AppointmentsListComponent]
})
export class AppointmentsListModule { }
