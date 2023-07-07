import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EpisodeInfoComponent } from './episode-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: EpisodeInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class EpisodeInfoRoutingModule { }
