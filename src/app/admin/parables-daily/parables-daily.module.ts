import { NgModule } from '@angular/core';
import { ParablesDailyComponent } from './parables-daily.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParablesDailyRoutingModule } from './parables-daily-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ParablesDailyComponent
  ],
  imports: [
    SharedModule,
    ParablesDailyRoutingModule
  ]
})
export class ParablesDailyModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
