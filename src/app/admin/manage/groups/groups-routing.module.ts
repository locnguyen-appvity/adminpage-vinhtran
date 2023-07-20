import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';

const myRoutes: Routes = [
	{
		path: '', component: GroupsComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('./groups-list/groups-list.module').then(m => m.GroupsListModule)
			},
			{
				path: 'detail',
				loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			},
			{
				path: 'detail/:id',
				loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class GroupsRoutingModule { }
