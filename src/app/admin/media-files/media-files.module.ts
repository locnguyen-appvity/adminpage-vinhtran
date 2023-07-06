import { NgModule } from '@angular/core';
import { MediaFilesComponent } from './media-files.component';
import { MediaFilesRoutingModule } from './media-files-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MediaFilesComponent
  ],
  imports: [
    SharedModule,
    MediaFilesRoutingModule
  ]
})
export class MediaFilesModule { }
