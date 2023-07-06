import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaFilesComponent } from './media-files.component';

const routes: Routes = [
	{
		path: '', component: MediaFilesComponent,
		children: [
			{
				path: 'media-files-tree',
				loadChildren: () => import('./media-files-tree/media-files-tree.module').then(m => m.MediaFilesTreeModule)
			},
			{ path: '', redirectTo: 'media-files-tree', pathMatch: 'full' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MediaFilesRoutingModule { }
