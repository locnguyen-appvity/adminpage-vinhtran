import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergiesListComponent } from './clergys-list-grid.component';

const myRoutes: Routes = [
	{
		path: '', component: ClergiesListComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ClergiesRoutingModule { }
