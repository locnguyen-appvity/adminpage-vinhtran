import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { InfoClergyMyChurchComponent } from './info-clergy-my-church.component';



@NgModule({
  declarations: [
    InfoClergyMyChurchComponent
  ],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AutocompleteSimpleModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  exports: [InfoClergyMyChurchComponent]
})
export class InfoClergyMyChurchModule { }
