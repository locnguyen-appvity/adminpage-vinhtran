import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';

const myRoutes: Routes = [
	{
		path: '', component: ManageComponent,
		children: [
			{
				path: 'saints-list',
				loadChildren: () => import('./saints/saints.module').then(m => m.SaintsModule)
			},
			{
				path: 'groups-list',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'organizations-list',
				loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
			},
			{
				path: 'clergys-list',
				loadChildren: () => import('./clergys/clergys.module').then(m => m.ClergysModule)
			},
			{ path: '', redirectTo: 'saints-list', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ManageRoutingModule { }
