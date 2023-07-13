import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDetailComponent } from './book-detail.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: BookDetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class BookDetailRoutingModule { }
