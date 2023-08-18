import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceDetailComponent } from './workspace-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: WorkspaceDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class WorkspaceDetailRoutingModule { }
