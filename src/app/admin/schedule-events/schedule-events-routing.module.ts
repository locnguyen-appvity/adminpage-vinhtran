import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleEventsComponent } from './schedule-events.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ScheduleEventsComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./schedule-events-list/schedule-events-list.module').then(m => m.ScheduleEventsListModule)
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
export class ScheduleEventsRoutingModule { }
