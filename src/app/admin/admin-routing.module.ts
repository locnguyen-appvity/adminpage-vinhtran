import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
// import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';

const routes: Routes = [
	{
		path: '', component: AdminComponent,
		children: [
			{
			  path: 'categories-list',
			  loadChildren: () => import('./categories/categories-list/categories-list.module').then(m => m.CategoriesListModule)
			},
			{
			  path: 'catalogues-list',
			  loadChildren: () => import('./catalogues/catalogues-list/catalogues-list.module').then(m => m.CataloguesListModule)
			},
			{
			  path: 'users-list',
			  loadChildren: () => import('./users/user-list/user-list.module').then(m => m.UserListModule)
			},
			{
			  path: 'posts',
			  loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule)
			},
			{
			  path: 'parables',
			  loadChildren: () => import('./parables/parables.module').then(m => m.ParablesModule)
			},
			{
			  path: 'contemplations',
			  loadChildren: () => import('./contemplations/contemplations.module').then(m => m.ContemplationsModule)
			},
			{
			  path: 'tags',
			  loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
			},
			{
			  path: 'media-files',
			  loadChildren: () => import('./media-files/media-files.module').then(m => m.MediaFilesModule)
			},
			{
			  path: 'chapters',
			  loadChildren: () => import('./chapters/chapters.module').then(m => m.ChaptersModule)
			},
			{
			  path: 'books',
			  loadChildren: () => import('./books/books.module').then(m => m.BooksModule)
			},
			{
			  path: 'episodes',
			  loadChildren: () => import('./episodes/episodes.module').then(m => m.EpisodesModule)
			},
			{
			  path: 'authors',
			  loadChildren: () => import('./authors/authors.module').then(m => m.AuthorsModule)
			},
			{
			  path: 'folders',
			  loadChildren: () => import('./folders/folders.module').then(m => m.FoldersModule)
			},
			{
			  path: 'slides',
			  loadChildren: () => import('./slides/slides.module').then(m => m.SlidesModule)
			},
			{
				path: 'manage',
				loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
			},
			{ path: '', redirectTo: 'categories-list', pathMatch: 'full' },
		]
	}
	// { path: '', component: AdminNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
