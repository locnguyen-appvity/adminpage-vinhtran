import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaFilesTreeComponent } from './media-files-tree.component';

const routes: Routes = [
  {
    path: '', component: MediaFilesTreeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaFilesTreeRoutingModule { }
