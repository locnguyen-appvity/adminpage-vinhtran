import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationPostsRoutingModule } from './notification-post-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationPostsComponent } from './notification-post.component';



@NgModule({
  declarations: [
    NotificationPostsComponent
  ],
  imports: [
    SharedModule,
    NotificationPostsRoutingModule
  ]
})
export class NotificationPostsModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
