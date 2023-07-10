import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationsListComponent } from './organization-list/organizations-list.component';

const myRoutes: Routes = [
	{
		path: '', component: OrganizationsComponent,
		children: [
			{
				path: 'organizations-list',
				component: OrganizationsListComponent,
			},
			{
				path: 'organization',
				loadChildren: () => import('./organization-detail/organization-detail.module').then(m => m.OrganizationDetailModule)
			},
			{
				path: 'organization/:id',
				loadChildren: () => import('./organization-detail/organization-detail.module').then(m => m.OrganizationDetailModule)
			},
			{ path: '', redirectTo: 'organizations-list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
