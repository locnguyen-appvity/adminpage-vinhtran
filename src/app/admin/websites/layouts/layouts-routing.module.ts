import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutsComponent } from './layouts.component';

const myRoutes: Routes = [
	{
		path: '', component: LayoutsComponent,
		children: [
			{
				path: 'home',
				loadChildren: () => import('./layout-detail/layout-detail.module').then(m => m.LayoutDetailModule)
			},
			{
				path: 'home/:id',
				loadChildren: () => import('./layout-detail/layout-detail.module').then(m => m.LayoutDetailModule)
			},
			{ path: '', redirectTo: 'detail', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class LayoutsRoutingModule { }
