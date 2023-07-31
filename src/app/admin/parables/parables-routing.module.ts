import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParablesComponent } from './parables.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ParablesComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./parables-list/parables-list.module').then(m => m.ParableListModule)
			},
			{
				path: 'info',
				loadChildren: () => import('./parable-info/parable-info.module').then(m => m.ParableInfoModule)
			},
			{
				path: 'info/:id',
				loadChildren: () => import('./parable-info/parable-info.module').then(m => m.ParableInfoModule)
			},
			// {
			// 	path: 'post-list',
			// 	component: UserListComponent
			// },
			{ path: '', redirectTo: 'parables-list', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ParablesRoutingModule { }
