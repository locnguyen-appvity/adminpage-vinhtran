import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContemplationInfoComponent } from './contemplation-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ContemplationInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ContemplationInfoRoutingModule { }
