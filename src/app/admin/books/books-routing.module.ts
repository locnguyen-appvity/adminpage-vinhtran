import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books.component';

const routes: Routes = [
	{
		path: '', component: BooksComponent,
		children: [
			{
				path: 'books-list',
				loadChildren: () => import('./books-list/books-list.module').then(m => m.BooksListModule)
			},
			// {
			// 	path: 'book-info',
			// 	loadChildren: () => import('./book-detail/book-detail.module').then(m => m.BookDetailModule)
			// },
			{
				path: 'book-detail/:id',
				loadChildren: () => import('./book-detail/book-detail.module').then(m => m.BookDetailModule)
			},
			{ path: '', redirectTo: 'books-list', pathMatch: 'full' },
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BooksRoutingModule { }
