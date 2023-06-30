import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsListComponent } from './organizations-list.component';

const myRoutes: Routes = [
	{
		path: '', component: OrganizationsListComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class OrganizationsListRoutingModule { }
