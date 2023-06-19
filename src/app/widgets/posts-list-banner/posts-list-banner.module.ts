import { NgModule } from '@angular/core';
import { PostsListBannerComponent } from './posts-list-banner.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		PostsListBannerComponent
	],
	imports: [
		SharedModule
	],
	exports: [PostsListBannerComponent]
})
export class PostsListBannerModule { }
