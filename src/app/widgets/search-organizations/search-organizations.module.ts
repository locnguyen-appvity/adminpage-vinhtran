import { NgModule } from '@angular/core';
import { SearchOrganizationsComponent } from './search-organizations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		SearchOrganizationsComponent
	],
	imports: [
		SharedModule,
		MatButtonModule
	],
	exports: [SearchOrganizationsComponent]
})
export class SearchOrganizationsModule { }
