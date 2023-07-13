import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChaptersComponent } from './chapters.component';

const routes: Routes = [
	{
		path: '', component: ChaptersComponent,
		children: [
			{
				path: 'chapters-list',
				loadChildren: () => import('./chapters-list/chapters-list.module').then(m => m.ChaptersListModule)
			},
			// {
			// 	path: 'chapter-detail',
			// 	loadChildren: () => import('./chapter-info/chapter-info.module').then(m => m.ChapterInfoModule)
			// },
			{
				path: 'chapter-detail/:id',
				loadChildren: () => import('./chapter-detail/chapter-detail.module').then(m => m.ChapterDetailModule)
			},
			{ path: '', redirectTo: 'chapters-list', pathMatch: 'full' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChaptersRoutingModule { }
