import { NgModule } from '@angular/core';
import { SearchMemberComponent } from './search-member.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		SearchMemberComponent
	],
	imports: [
		SharedModule,
		MatButtonModule
	],
	exports: [SearchMemberComponent]
})
export class SearchMemberModule { }
