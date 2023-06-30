import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationDetailComponent } from './organization-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: OrganizationDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class OrganizationDetailRoutingModule { }
