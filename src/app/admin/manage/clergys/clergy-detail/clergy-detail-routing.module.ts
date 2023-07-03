import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClergyDetailComponent } from './clergy-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ClergyDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ClergyDetailRoutingModule { }
