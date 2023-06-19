import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsComponent } from './tags.component';

const routes: Routes = [
  {
    path: '', component: TagsComponent,
    children: [
			{
				path: 'tags-list',
				loadChildren: () => import('./tags-list/tags-list.module').then(m => m.CategoriesListModule)
			},
			{ path: '', redirectTo: 'tags-list', pathMatch: 'full' },
		],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
