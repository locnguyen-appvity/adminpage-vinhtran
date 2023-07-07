import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminNavbarComponent } from './admin-navbar.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationsModule } from 'src/app/notifications/notifications.module';
import { DomSanitizer } from '@angular/platform-browser';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    AdminNavbarComponent
  ],
  imports: [
    SharedModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    NotificationsModule,
    MatExpansionModule
  ],
  exports: [AdminNavbarComponent]
})
export class AdminNavbarModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_priest', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priest.svg'));
    this.mdIconRegistry.addSvgIcon('ic_church_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_church_24dp.svg'));
    this.mdIconRegistry.addSvgIcon('maps_home_work_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/maps_home_work_48dp.svg'));
  }
}
