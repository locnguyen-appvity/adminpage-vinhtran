import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleEventsListComponent } from './schedule-events-list.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ScheduleEventsListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ScheduleEventsListRoutingModule { }
