import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CataloguesComponent } from './catalogues.component';

const routes: Routes = [
  {
    path: '', component: CataloguesComponent,
    children: [
			{
				path: 'catalogues-list',
				loadChildren: () => import('./catalogues-list/catalogues-list.module').then(m => m.CataloguesListModule)
			},
			{ path: '', redirectTo: 'catalogues-list', pathMatch: 'full' },
		],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CataloguesRoutingModule { }
