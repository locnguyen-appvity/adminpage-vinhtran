import { NgModule } from '@angular/core';
import { ClergysComponent } from './clergys.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClergyInfoComponent } from './clergy-info/clergy-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { ErrorValidateModule } from 'src/app/controls/error-validate/error-validate.module';
import { ClergysRoutingModule } from './clergys-routing.module';


@NgModule({
  declarations: [
    ClergysComponent,
    ClergyInfoComponent
  ],
  imports: [
    SharedModule,
    ClergysRoutingModule,
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
    NgxMaskModule.forRoot({
      validation: false,
    }),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    ErrorValidateModule,
    AutocompleteSimpleModule
  ]
})
export class ClergysModule { }
