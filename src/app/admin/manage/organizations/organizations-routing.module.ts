import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';

const myRoutes: Routes = [
	{
		path: '', component: OrganizationsComponent,
		children: [
			{
				path: 'organizations-list',
				loadChildren: () => import('./organization-list/organizations-list.module').then(m => m.OrganizationsListModule)
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
