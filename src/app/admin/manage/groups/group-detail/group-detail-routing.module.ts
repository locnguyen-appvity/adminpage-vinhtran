import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupDetailComponent } from './group-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: GroupDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class GroupDetailRoutingModule { }
