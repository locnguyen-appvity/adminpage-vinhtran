import { NgModule } from '@angular/core';
import { ScheduleEventsComponent } from './schedule-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleEventsRoutingModule } from './schedule-events-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ScheduleEventsComponent
  ],
  imports: [
    SharedModule,
    ScheduleEventsRoutingModule
  ]
})
export class ScheduleEventsModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
