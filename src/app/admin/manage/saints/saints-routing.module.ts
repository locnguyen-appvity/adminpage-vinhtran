import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaintsComponent } from './saints.component';

const myRoutes: Routes = [
	{
		path: '', component: SaintsComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class SaintsRoutingModule { }
