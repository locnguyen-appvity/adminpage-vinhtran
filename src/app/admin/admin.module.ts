import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AboutModule } from '../controls/about';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AdminNavbarModule } from './admin-navbar/admin-navbar.module';
import { NotificationsModule } from '../notifications/notifications.module';



@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule,
    AboutModule,
    AdminNavbarModule,
    NotificationsModule
  ]
})
export class AdminModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_arrow_back_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_back_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_article_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_article_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_menu_open_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_open_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_sell_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_sell_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_account_box_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_account_box_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_edit_note_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_note_24dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_exit_to_app_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_exit_to_app_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_info_outline_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_info_outline_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_notifications_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_notifications_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_subscriptions_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_subscriptions_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_more_horiz_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_horiz_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_delete_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_open_in_new_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_open_in_new_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_toggle_off', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_toggle_off.svg'));
    this.mdIconRegistry.addSvgIcon('ic_toggle_on', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_toggle_on.svg'));
    this.mdIconRegistry.addSvgIcon('ic_open_with_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_open_with_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_person_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_person_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_search_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_chevron_right_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chevron_right_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_expand_more_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_expand_more_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_add_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_autorenew_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_autorenew_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_menu_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_manage_accounts_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_manage_accounts_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_more_vert_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_vert_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_keyboard_arrow_right_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_right_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
