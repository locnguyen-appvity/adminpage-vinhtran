import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaintsComponent } from './saints.component';

const myRoutes: Routes = [
	{
		path: '', component: SaintsComponent,
		children: [
			{
				path: 'list',
				loadChildren: () => import('../saints/saints.module').then(m => m.SaintsModule)
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class SaintsRoutingModule { }
