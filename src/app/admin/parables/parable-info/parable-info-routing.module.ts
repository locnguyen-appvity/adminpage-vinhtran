import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParableInfoComponent } from './parable-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ParableInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ParableInfoRoutingModule { }
