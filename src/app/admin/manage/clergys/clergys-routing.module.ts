import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergysComponent } from './clergys.component';

const myRoutes: Routes = [
	{
		path: '', component: ClergysComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ClergysRoutingModule { }
