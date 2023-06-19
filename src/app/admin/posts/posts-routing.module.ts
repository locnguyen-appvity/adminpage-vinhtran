import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsComponent } from './posts.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: PostsComponent,
		children: [
			{
				path: 'post-list',
				loadChildren: () => import('./post-list/post-list.module').then(m => m.PostListModule)
			},
			{
				path: 'post-info',
				loadChildren: () => import('./post-info/post-info.module').then(m => m.PostInfoModule)
			},
			{
				path: 'post-info/:id',
				loadChildren: () => import('./post-info/post-info.module').then(m => m.PostInfoModule)
			},
			// {
			// 	path: 'post-list',
			// 	component: UserListComponent
			// },
			{ path: '', redirectTo: 'post-list', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class PostsRoutingModule { }
