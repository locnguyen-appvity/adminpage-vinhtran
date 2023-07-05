import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlidesListComponent } from './slides-list.component';

const routes: Routes = [
  {
    path: '', component: SlidesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidesListRoutingModule { }
