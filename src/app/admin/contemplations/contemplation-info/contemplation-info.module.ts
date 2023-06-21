import { NgModule } from '@angular/core';
import { ContemplationInfoComponent } from './contemplation-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContemplationInfoRoutingModule } from './contemplation-info-routing.module';
// import { JoditAngularModule } from 'jodit-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SEChipControlModule } from 'src/app/controls/se-chip-control/se-chip-control.module';
import {MatChipsModule} from '@angular/material/chips';
import { SEChipSimpleModule } from 'src/app/controls/se-chip-simple/se-chip-simple.module';
import { DialogSelectedImgsModule } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { UploadAvatarModule } from 'src/app/controls/upload-avatar/upload-avatar.module';

@NgModule({
  declarations: [
    ContemplationInfoComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    ContemplationInfoRoutingModule,
    // JoditAngularModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    SEChipControlModule,
    MatChipsModule,
    SEChipSimpleModule,
    DialogSelectedImgsModule,
    AutocompleteSimpleModule,
    EditorControlModule,
    UploadAvatarModule
  ]
})
export class ContemplationInfoModule { }
