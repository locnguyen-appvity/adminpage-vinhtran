import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostInfoComponent } from './post-info.component';

const myAccountRoutes: Routes = [
	{
		path: '', component: PostInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(myAccountRoutes)],
	exports: [RouterModule]
})
export class PostInfoRoutingModule { }
