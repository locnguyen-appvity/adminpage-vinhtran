import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClergyInOrganizationsInfoComponent } from './clergy-in-organizations-info.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';



@NgModule({
  declarations: [
    ClergyInOrganizationsInfoComponent
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
    MatSlideToggleModule,
    MatDatepickerModule,
    AutocompleteSimpleModule
  ],
  exports: [
    ClergyInOrganizationsInfoComponent
  ]
})
export class ClergyInOrganizationsInfoModule { }
