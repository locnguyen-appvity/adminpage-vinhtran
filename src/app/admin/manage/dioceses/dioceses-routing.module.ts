import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiocesesComponent } from './dioceses.component';

const myRoutes: Routes = [
	{
		path: '', component: DiocesesComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./dioceses-list/dioceses-list.module').then(m => m.DiocesesListModule)
			},
			// {
			// 	path: 'detail',
			// 	loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			// },
			// {
			// 	path: 'detail/:id',
			// 	loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			// },
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class DiocesesRoutingModule { }
