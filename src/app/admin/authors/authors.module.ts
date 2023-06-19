import { NgModule } from '@angular/core';
import { AuthorsComponent } from './authors.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthorsRoutingModule } from './authors-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    AuthorsComponent
  ],
  imports: [
    SharedModule,
    AuthorsRoutingModule
  ]
})
export class AuthorsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
  }
 }
