import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupViewComponent } from './group-view.component';

const myRoutes: Routes = [
	{
		path: '', component: GroupViewComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class GroupViewRoutingModule { }
