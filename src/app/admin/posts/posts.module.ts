import { NgModule } from '@angular/core';
import { PostsComponent } from './posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    SharedModule,
    PostsRoutingModule
  ]
})
export class PostsModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
