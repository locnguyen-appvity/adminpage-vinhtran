import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationsListComponent } from './organization-list/organizations-list.component';

const myRoutes: Routes = [
	{
		path: '', component: OrganizationsComponent,
		children: [
			{
				path: 'list',
				component: OrganizationsListComponent,
			},
			{
				path: 'detail',
				loadChildren: () => import('./organization-detail/organization-detail.module').then(m => m.OrganizationDetailModule)
			},
			{
				path: 'detail/:id',
				loadChildren: () => import('./organization-detail/organization-detail.module').then(m => m.OrganizationDetailModule)
			},
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
