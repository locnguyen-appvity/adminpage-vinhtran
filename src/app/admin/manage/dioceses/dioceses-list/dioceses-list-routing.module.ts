import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiocesesListComponent } from './dioceses-list.component';

const myRoutes: Routes = [
	{
		path: '', component: DiocesesListComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class DiocesesListRoutingModule { }
