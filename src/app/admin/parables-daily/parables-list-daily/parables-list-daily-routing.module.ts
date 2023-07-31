import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParableListDailyComponent } from './parables-list-daily.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ParableListDailyComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ParableListDailyRoutingModule { }
