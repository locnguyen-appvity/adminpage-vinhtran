import { NgModule } from '@angular/core';
import { PostsBannerComponent } from './posts-banner.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		PostsBannerComponent
	],
	imports: [
		SharedModule
	],
	exports: [PostsBannerComponent]
})
export class PostsBannerModule { }
