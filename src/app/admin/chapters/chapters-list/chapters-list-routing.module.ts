import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaptersListComponent } from './chapters-list.component';

const routes: Routes = [
  {
    path: '', component: ChaptersListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChaptersListRoutingModule { }
