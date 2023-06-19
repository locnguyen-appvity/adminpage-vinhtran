import { NgModule } from '@angular/core';
import { PostContactComponent } from './post-contact.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    PostContactComponent
  ],
  imports: [
    SharedModule,
    MatIconModule
  ],
  exports: [PostContactComponent]
})
export class PostContactModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_schedule_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/schedule_48dp.svg'));
  }
 }
