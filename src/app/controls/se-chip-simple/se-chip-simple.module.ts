import { NgModule } from '@angular/core';
import { SEChipSimpleComponent } from './se-chip-simple.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
	imports: [
		MatFormFieldModule,
		MatChipsModule,
		MatIconModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		MatInputModule,
		ReactiveFormsModule,
		SharedModule
	],
	declarations: [SEChipSimpleComponent],
	exports: [SEChipSimpleComponent]
})
export class SEChipSimpleModule { 
	constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.mdIconRegistry.addSvgIcon('ic_close_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_48px.svg'));
	  }
}
