import { NgModule } from '@angular/core';
import { TopHeaderComponent } from './top-header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@NgModule({
  declarations: [
    TopHeaderComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [TopHeaderComponent]
})
export class TopHeaderModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_facebook', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_facebook.svg'));
    this.mdIconRegistry.addSvgIcon('ic_twitter', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_twitter.svg'));
    this.mdIconRegistry.addSvgIcon('ic_linkedin', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_linkedin.svg'));
    this.mdIconRegistry.addSvgIcon('ic_google_plus', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_google_plus.svg'));
    this.mdIconRegistry.addSvgIcon('ic_youtube', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/ic_youtube.svg'));
  }
}
