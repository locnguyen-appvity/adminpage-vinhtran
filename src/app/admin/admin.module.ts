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
import { NotificationsModule } from '../notifications/notifications.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



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
    NotificationsModule
  ]
})
export class AdminModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_delete_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_notifications_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_notifications_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_manage_accounts_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_manage_accounts_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_settings_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_settings_48px.svg'));
    this.mdIconRegistry.addSvgIcon('maps_home_work_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/maps_home_work_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('home_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/home_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_menu_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_graphic_eq_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_graphic_eq_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_subscriptions_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_subscriptions_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_account_box_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_account_box_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_folder_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_folder_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_edit_note_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_note_24dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_exit_to_app_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_exit_to_app_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_info_outline_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_info_outline_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_library_music_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_library_music_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_done_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_done_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_close_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_person_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_person_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_people_alt_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_people_alt_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_audio_file_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_audio_file_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_toggle_off', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_toggle_off.svg'));
    this.mdIconRegistry.addSvgIcon('ic_toggle_on', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_toggle_on.svg'));
    this.mdIconRegistry.addSvgIcon('ic_more_horiz_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_horiz_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_play_arrow_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_play_arrow_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_keyboard_arrow_right_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_right_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_search_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_open_in_new_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_open_in_new_48dp.svg'));
  }
}
