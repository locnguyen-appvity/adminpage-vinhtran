import { NgModule } from '@angular/core';
import { PostNewComponent } from './post-new.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
	declarations: [
		PostNewComponent
	],
	imports: [
		SharedModule,
		HttpClientModule,
		CarouselModule
	],
	exports: [PostNewComponent]
})
export class PostNewModule {
	constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.registerIcons();
	}

	registerIcons() {
		this.mdIconRegistry.addSvgIcon('ic_arrow_back_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_back_48dp.svg'));
		this.mdIconRegistry.addSvgIcon('ic_visibility_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_48dp.svg'));
	}
}
