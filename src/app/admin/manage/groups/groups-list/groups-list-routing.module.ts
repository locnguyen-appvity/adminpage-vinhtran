import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListComponent } from './groups-list.component';

const myRoutes: Routes = [
	{
		path: '', component: GroupsListComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class GroupsListRoutingModule { }
