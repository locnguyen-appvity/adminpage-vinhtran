import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MigrationsComponent } from './migrations.component';
import { MigrationsListComponent } from './migrations-list/migrations-list.component';

const myRoutes: Routes = [
	{
		path: '', component: MigrationsComponent,
		children: [
			{
				path: 'migrations-list',
				component: MigrationsListComponent,
			},
			{ path: '', redirectTo: 'migrations-list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class MigrationsRoutingModule { }
