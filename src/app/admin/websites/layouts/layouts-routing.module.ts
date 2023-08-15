import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts.component';
import { LayoutsListComponent } from './layouts-list/layouts-list.component';

const myRoutes: Routes = [
	{
		path: '', component: LayoutsComponent,
		children: [
			{
				path: 'list',
				component: LayoutsListComponent,
			},
			{
				path: 'detail',
				loadChildren: () => import('./layout-detail/layout-detail.module').then(m => m.LayoutDetailModule)
			},
			{
				path: 'detail/:id',
				loadChildren: () => import('./layout-detail/layout-detail.module').then(m => m.LayoutDetailModule)
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class LayoutsRoutingModule { }
