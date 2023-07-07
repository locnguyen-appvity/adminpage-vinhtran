import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesComponent } from './episodes.component';

const routes: Routes = [
	{
		path: '', component: EpisodesComponent,
		children: [
			{
				path: 'episodes-list',
				loadChildren: () => import('./episodes-list/episodes-list.module').then(m => m.EpisodesListModule)
			},
			{
				path: 'episode-info',
				loadChildren: () => import('./episode-info/episode-info.module').then(m => m.EpisodeInfoModule)
			},
			{
				path: 'episode-info/:id',
				loadChildren: () => import('./episode-info/episode-info.module').then(m => m.EpisodeInfoModule)
			},
			{ path: '', redirectTo: 'episodes-list', pathMatch: 'full' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EpisodesRoutingModule { }
