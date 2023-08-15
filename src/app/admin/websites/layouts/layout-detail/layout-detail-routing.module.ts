import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutDetailComponent } from './layout-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: LayoutDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class LayoutDetailRoutingModule { }
