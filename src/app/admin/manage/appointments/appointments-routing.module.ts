import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

const myRoutes: Routes = [
	{
		path: '', component: AppointmentsComponent,
		children: [
			{
				path: 'appointments-list',
				component: AppointmentsListComponent,
			},
			{ path: '', redirectTo: 'appointments-list', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
