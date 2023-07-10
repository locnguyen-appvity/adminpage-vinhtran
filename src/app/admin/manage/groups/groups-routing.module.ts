import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';

const myRoutes: Routes = [
	{
		path: '', component: GroupsComponent,
		children: [
			{
				path: 'groups-list',
				loadChildren: () => import('./groups-list/groups-list.module').then(m => m.GroupsListModule)
			},
			{
				path: 'group',
				loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			},
			{
				path: 'group/:id',
				loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailModule)
			},
			{ path: '', redirectTo: 'groups-list', pathMatch: 'full' },
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class GroupsRoutingModule { }
