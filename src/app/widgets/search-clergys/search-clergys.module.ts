import { NgModule } from '@angular/core';
import { SearchClergysComponent } from './search-clergys.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		SearchClergysComponent
	],
	imports: [
		SharedModule,
		MatButtonModule
	],
	exports: [SearchClergysComponent]
})
export class SearchClergysModule { }
