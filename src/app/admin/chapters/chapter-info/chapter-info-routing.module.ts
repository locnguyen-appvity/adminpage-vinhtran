import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChapterInfoComponent } from './chapter-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ChapterInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ChapterInfoRoutingModule { }
