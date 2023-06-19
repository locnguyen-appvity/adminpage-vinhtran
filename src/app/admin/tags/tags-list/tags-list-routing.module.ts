import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsListComponent } from './tags-list.component';

const routes: Routes = [
  {
    path: '', component: TagsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsListRoutingModule { }
