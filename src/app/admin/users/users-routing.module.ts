import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UserListComponent } from './user-list/user-list.component';
// import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { UsersComponent } from './users.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: UsersComponent,
		// children: [
		// 	{
		// 		path: 'user-list',
		// 		component: UserListComponent
		// 	},
		// 	{ path: '', redirectTo: 'user-list', pathMatch: 'full' },
		// ],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class UsersRoutingModule { }
