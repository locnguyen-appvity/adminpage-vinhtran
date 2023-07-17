import { NgModule } from '@angular/core';
import { DialogSelectedTracksComponent } from './dialog-selected-tracks.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { TracksFilesListModule } from '../tracks-files-list/tracks-files-list.module';



@NgModule({
  declarations: [
    DialogSelectedTracksComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TracksFilesListModule
  ],
  exports: [DialogSelectedTracksComponent]
})
export class DialogSelectedTracksModule {

 }
