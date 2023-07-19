import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskModule } from 'ngx-mask';
import { ErrorValidateModule } from 'src/app/controls/error-validate/error-validate.module';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { MigrationInfoComponent } from './migration-info.component';


@NgModule({
  declarations: [
    MigrationInfoComponent
  ],
  imports: [
    SharedModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
      validation: false,
    }),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    ErrorValidateModule,
    AutocompleteSimpleModule,
    EditorControlModule
  ],
  exports: [MigrationInfoComponent]
})
export class MigrationInfoModule { }
