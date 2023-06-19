import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParableListComponent } from './parables-list.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ParableListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ParableListRoutingModule { }
