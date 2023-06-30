import { NgModule } from '@angular/core';
import { SearchOrganizationsComponent } from './search-organizations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
	declarations: [
		SearchOrganizationsComponent
	],
	imports: [
		SharedModule,
		MatButtonModule,
		NgxMaskModule.forRoot({
			validation: false,
		  }),
	],
	exports: [SearchOrganizationsComponent]
})
export class SearchOrganizationsModule { }
