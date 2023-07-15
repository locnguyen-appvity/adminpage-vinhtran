import { NgModule } from '@angular/core';
import { PostsRelatedComponent } from './posts-related.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
	declarations: [
		PostsRelatedComponent
	],
	imports: [
		SharedModule,
		MatButtonModule,
		MatProgressSpinnerModule
	],
	exports: [PostsRelatedComponent]
})
export class PostsRelatedModule { }
