import { NgModule } from '@angular/core';
import { EventInfoComponent } from './event-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    EventInfoComponent
  ],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule.forRoot({
      validation: false,
    }),
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  exports: [
    EventInfoComponent
  ]
})
export class EventInfoModule { }
