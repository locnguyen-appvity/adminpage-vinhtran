import { NgModule } from '@angular/core';
import { EditorControlComponent } from './editor-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogSelectedImgsModule } from '../dialog-selected-imgs/dialog-selected-imgs.module';
import { MatDialogModule } from '@angular/material/dialog';
import { JoditAngularModule } from 'jodit-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EditorControlComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    FormsModule,
    JoditAngularModule,
    ReactiveFormsModule,
    DialogSelectedImgsModule
  ],
  exports: [EditorControlComponent]
})
export class EditorControlModule { }
