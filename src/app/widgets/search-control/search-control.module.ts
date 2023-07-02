import { NgModule } from '@angular/core';
import { SearchControlComponent } from './search-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogItemsModule } from '../dialog-items/dialog-items.module';

@NgModule({
	declarations: [
		SearchControlComponent
	],
	imports: [
		SharedModule,
		MatButtonModule,
		NgxMaskModule.forRoot({
			validation: false,
		}),
		MatDialogModule,
		ReactiveFormsModule,
		DialogItemsModule
	],
	exports: [SearchControlComponent]
})
export class SearchControlModule { }
