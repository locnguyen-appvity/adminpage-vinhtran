import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContemplationsComponent } from './contemplations.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ContemplationsComponent,
		children: [
			{
				path: 'contemplations-list',
				loadChildren: () => import('./contemplations-list/contemplations-list.module').then(m => m.ContemplationListModule)
			},
			{
				path: 'contemplation-info',
				loadChildren: () => import('./contemplation-info/contemplation-info.module').then(m => m.ContemplationInfoModule)
			},
			{
				path: 'contemplation-info/:id',
				loadChildren: () => import('./contemplation-info/contemplation-info.module').then(m => m.ContemplationInfoModule)
			},
			// {
			// 	path: 'post-list',
			// 	component: UserListComponent
			// },
			{ path: '', redirectTo: 'post-list', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ContemplationsRoutingModule { }
