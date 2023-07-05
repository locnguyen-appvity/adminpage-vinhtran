import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CataloguesListComponent } from './catalogues-list.component';

const routes: Routes = [
  {
    path: '', component: CataloguesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CataloguesListRoutingModule { }
