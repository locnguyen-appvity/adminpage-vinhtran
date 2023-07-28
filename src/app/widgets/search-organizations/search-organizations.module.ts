import { NgModule } from '@angular/core';
import { SearchOrganizationsComponent } from './search-organizations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
		MatDialogModule,
		MatProgressSpinnerModule,
		ScrollingModule
	],
	exports: [SearchOrganizationsComponent]
})
export class SearchOrganizationsModule { }
