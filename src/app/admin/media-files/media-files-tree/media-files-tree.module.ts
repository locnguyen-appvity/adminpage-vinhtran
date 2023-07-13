import { NgModule } from '@angular/core';
import { MediaFilesTreeComponent } from './media-files-tree.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MediaFilesTreeRoutingModule } from './media-files-tree-routing.module';
import { MediaFilesTreeControlModule } from 'src/app/controls/media-files-tree-control/media-files-tree-control.module';

@NgModule({
  declarations: [
    MediaFilesTreeComponent
  ],
  imports: [
    SharedModule,
    MediaFilesTreeRoutingModule,
    MediaFilesTreeControlModule
  ],
  exports: [MediaFilesTreeComponent]
})
export class MediaFilesTreeModule { }
