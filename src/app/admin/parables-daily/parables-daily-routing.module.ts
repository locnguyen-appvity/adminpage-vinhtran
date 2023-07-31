import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParablesDailyComponent } from './parables-daily.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ParablesDailyComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./parables-list-daily/parables-list-daily.module').then(m => m.ParableListDailyModule)
			},
			// {
			// 	path: 'info',
			// 	loadChildren: () => import('./parable-info-daily/parable-info-daily.module').then(m => m.ParablesInfoDailyModule)
			// },
			// {
			// 	path: 'info/:id',
			// 	loadChildren: () => import('./parable-info-daily/parable-info-daily.module').then(m => m.ParablesInfoDailyModule)
			// },
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
export class ParablesDailyRoutingModule { }
