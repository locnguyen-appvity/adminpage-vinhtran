import { NgModule } from '@angular/core';
import { ToastSnackbarAppComponent } from './toast-snackbar.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatIconModule, 
		FlexLayoutModule],
	declarations: [ToastSnackbarAppComponent],
	exports: [ToastSnackbarAppComponent]
})

export class ToastSnackbarAppModule {
	constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.registerSvgIcon();
	}

	registerSvgIcon() {
		this.mdIconRegistry.addSvgIcon('ic_check_circle_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_circle_48px.svg'));
		this.mdIconRegistry.addSvgIcon('ic_post_add', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_post_add.svg'));
	}
}
