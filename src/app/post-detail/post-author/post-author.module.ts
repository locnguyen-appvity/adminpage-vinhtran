import { NgModule } from '@angular/core';
import { PostAuthorComponent } from './post-author.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    PostAuthorComponent
  ],
  imports: [
    SharedModule,
    MatIconModule
  ],
  exports: [PostAuthorComponent]
})
export class PostAuthorModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_schedule_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/schedule_48dp.svg'));
  }
 }
