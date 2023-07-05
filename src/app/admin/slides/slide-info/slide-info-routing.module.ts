import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlideInfoComponent } from './slide-info.component';

const myRoutes: Routes = [
	{
		path: '', component: SlideInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class SlideInfoRoutingModule { }
