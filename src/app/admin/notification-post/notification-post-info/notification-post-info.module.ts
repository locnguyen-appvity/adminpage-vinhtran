import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationPostInfoComponent } from './notification-post-info.component';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';


@NgModule({
  declarations: [
    NotificationPostInfoComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSelectModule,
    AutocompleteSimpleModule,
    MatDatepickerModule
  ],
  exports: [NotificationPostInfoComponent]
})
export class NotificationPostInfoModule { }
