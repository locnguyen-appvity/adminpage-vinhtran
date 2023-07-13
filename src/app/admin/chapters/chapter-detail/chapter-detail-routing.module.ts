import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChapterDetailComponent } from './chapter-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: ChapterDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class ChapterDetailRoutingModule { }
