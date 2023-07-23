import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GroupInfoComponent } from './group-info.component';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';

@NgModule({
  declarations: [
    GroupInfoComponent
  ],
  imports: [
    SharedModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    EditorControlModule,
    AutocompleteSimpleModule
  ],
  exports: [GroupInfoComponent]
})
export class GroupInfoModule { }
