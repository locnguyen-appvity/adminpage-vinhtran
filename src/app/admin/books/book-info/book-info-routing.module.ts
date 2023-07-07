import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookInfoComponent } from './book-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: BookInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class BookInfoRoutingModule { }
