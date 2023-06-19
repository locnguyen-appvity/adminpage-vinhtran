import { NgModule } from '@angular/core';
import { GuestReviewComponent } from './guest-review.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
	declarations: [
		GuestReviewComponent
	],
	imports: [
		SharedModule,
		CarouselModule
	],
	exports: [GuestReviewComponent]
})
export class GuestReviewModule {
	constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.registerIcons();
	}

	registerIcons() {
		this.mdIconRegistry.addSvgIcon('icon_quote', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon_quote.svg'));
	}
}
