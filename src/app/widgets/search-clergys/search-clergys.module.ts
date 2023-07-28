import { NgModule } from '@angular/core';
import { SearchClergysComponent } from './search-clergys.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
	declarations: [
		SearchClergysComponent
	],
	imports: [
		SharedModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		ScrollingModule
	],
	exports: [SearchClergysComponent]
})
export class SearchClergysModule { }
