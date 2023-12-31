import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppointmentsListModule } from './appointments-list/appointments-list.module';


@NgModule({
  declarations: [
    AppointmentsComponent,
  ],
  imports: [
    SharedModule,
    AppointmentsRoutingModule,
    AppointmentsListModule
  ]
})
export class AppointmentsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_arrow_forward', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_forward.svg'));
    this.mdIconRegistry.addSvgIcon('ic_shortcut_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_shortcut_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_stop_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_stop_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_add_business_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_business_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_done_all_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_done_all_48px.svg'));
  }
 }
