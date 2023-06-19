import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContemplationsListComponent } from './contemplations-list.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ContemplationsListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ContemplationsListRoutingModule { }
