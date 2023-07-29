import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsComponent } from './authors.component';

const routes: Routes = [
  {
    path: '', component: AuthorsComponent,
    children: [
			{
				path: 'authors-list',
				loadChildren: () => import('./authors-list/authors-list.module').then(m => m.AuthorsListModule)
			},
			{ path: '', redirectTo: 'authors-list', pathMatch: 'full' },
		],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsRoutingModule { }
