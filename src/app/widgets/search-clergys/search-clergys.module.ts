import { NgModule } from '@angular/core';
import { SearchClergysComponent } from './search-clergys.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UpdateClergyModule } from 'src/app/shared/directives/update-clergy.module';

@NgModule({
	declarations: [
		SearchClergysComponent
	],
	imports: [
		SharedModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		ScrollingModule,
		UpdateClergyModule
	],
	exports: [SearchClergysComponent]
})
export class SearchClergysModule { }
