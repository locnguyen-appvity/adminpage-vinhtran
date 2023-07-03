import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergysComponent } from './clergys.component';

const myRoutes: Routes = [
	{
		path: '', component: ClergysComponent,
		children: [
			{
				path: 'clergys-list',
				loadChildren: () => import('./clergys-list/clergys-list.module').then(m => m.ClergysListModule)
			},
			{
				path: 'clergy',
				loadChildren: () => import('./clergy-detail/clergy-detail.module').then(m => m.ClergyDetailModule)
			},
			{
				path: 'clergy/:id',
				loadChildren: () => import('./clergy-detail/clergy-detail.module').then(m => m.ClergyDetailModule)
			},
			{ path: '', redirectTo: 'clergys-list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ClergysRoutingModule { }
