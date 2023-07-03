import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergysListComponent } from './clergys-list.component';

const myRoutes: Routes = [
	{
		path: '', component: ClergysListComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ClergysListRoutingModule { }
