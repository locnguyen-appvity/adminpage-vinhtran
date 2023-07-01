import { NgModule } from '@angular/core';
import { MassesInfoComponent } from './masses-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  declarations: [
    MassesInfoComponent
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
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  exports: [
    MassesInfoComponent
  ]
})
export class MassesInfoModule { }
