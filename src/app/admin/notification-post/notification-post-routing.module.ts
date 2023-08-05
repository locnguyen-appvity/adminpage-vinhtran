import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationPostsComponent } from './notification-post.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: NotificationPostsComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./notification-post-list/notification-post-list.module').then(m => m.NotificationPostsListModule)
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
export class NotificationPostsRoutingModule { }
