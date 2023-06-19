import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    SharedModule,
    MatIconModule,
		MatButtonModule,
		MatListModule,
		MatTooltipModule,
		MatDividerModule,
		MatMenuModule,
		// VirtualScrollerModule,
		MatToolbarModule,
  ],
  exports: [NotificationsComponent]
})
export class NotificationsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_mark_email_read_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mark_email_read_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_mark_email_unread_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mark_email_unread_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_more_vert_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_48px.svg'));
  }
 }
