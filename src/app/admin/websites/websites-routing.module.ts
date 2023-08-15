import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebsitesComponent } from './websites.component';

const myRoutes: Routes = [
	{
		path: '', component: WebsitesComponent,
		children: [
			{
				path: 'layouts',
				loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule)
			},
			{ path: '', redirectTo: 'layouts', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class WebsitesRoutingModule { }
