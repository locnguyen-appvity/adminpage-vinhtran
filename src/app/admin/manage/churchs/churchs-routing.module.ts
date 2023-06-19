import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChurchsComponent } from './churchs.component';

const myRoutes: Routes = [
	{
		path: '', component: ChurchsComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ChurchsRoutingModule { }
