import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponent } from './page.component';

const routes: Routes = [
	{
		path: '', component: PageComponent,
		children: [
			{
				path: 'home',
				loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
			},
			{
				path: 'bai-viet',
				loadChildren: () => import('../post-detail/post-detail.module').then(m => m.PostDetailModule)
			},
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PageRoutingModule { }
