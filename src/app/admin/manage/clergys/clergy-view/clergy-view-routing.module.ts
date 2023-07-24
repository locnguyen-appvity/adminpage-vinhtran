import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergyViewComponent } from './clergy-view.component';

const myRoutes: Routes = [
	{
		path: '', component: ClergyViewComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ClergyViewRoutingModule { }
