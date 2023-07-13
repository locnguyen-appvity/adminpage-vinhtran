import { NgModule } from '@angular/core';
import { DialogSelectedMediaComponent } from './dialog-selected-media.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MediaFilesTreeControlModule } from '../media-files-tree-control/media-files-tree-control.module';



@NgModule({
  declarations: [
    DialogSelectedMediaComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MediaFilesTreeControlModule
  ],
  exports: [DialogSelectedMediaComponent]
})
export class DialogSelectedMediaModule {

 }
