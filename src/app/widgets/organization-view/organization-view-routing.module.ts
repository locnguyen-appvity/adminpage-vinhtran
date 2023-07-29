import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationViewComponent } from './organization-view.component';

const myRoutes: Routes = [
	{
		path: '', component: OrganizationViewComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class OrganizationViewRoutingModule { }
