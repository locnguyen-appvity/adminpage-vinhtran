import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlidesComponent } from './slides.component';

const routes: Routes = [
  {
    path: '', component: SlidesComponent,
    children: [
			{
				path: 'slides-list',
				loadChildren: () => import('./slides-list/slides-list.module').then(m => m.SlidesListModule)
			},
			{
				path: 'slide-info',
				loadChildren: () => import('./slide-info/slide-info.module').then(m => m.SlideInfoModule)
			},
			{
				path: 'slide-info/:id',
				loadChildren: () => import('./slide-info/slide-info.module').then(m => m.SlideInfoModule)
			},
			{ path: '', redirectTo: 'slides-list', pathMatch: 'full' },
		],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule { }
