import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationPostsListComponent } from './notification-post-list.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: NotificationPostsListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class NotificationPostsListRoutingModule { }
