import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesListComponent } from './episodes-list.component';

const routes: Routes = [
  {
    path: '', component: EpisodesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpisodesListRoutingModule { }
