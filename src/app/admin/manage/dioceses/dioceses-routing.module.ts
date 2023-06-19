import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiocesesComponent } from './dioceses.component';

const myRoutes: Routes = [
	{
		path: '', component: DiocesesComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class DiocesesRoutingModule { }
