import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { ErrorValidateModule } from 'src/app/controls/error-validate/error-validate.module';
import { ClergyInfoComponent } from './clergy-info.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    ClergyInfoComponent
  ],
  imports: [
    SharedModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ListItemsBaseModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    ErrorValidateModule,
    AutocompleteSimpleModule
  ],
  exports: [ClergyInfoComponent]
})
export class ClergyInfoModule { }
