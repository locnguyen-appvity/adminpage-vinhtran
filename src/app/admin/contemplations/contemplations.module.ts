import { NgModule } from '@angular/core';
import { ContemplationsComponent } from './contemplations.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContemplationsRoutingModule } from './contemplations-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ContemplationsComponent
  ],
  imports: [
    SharedModule,
    ContemplationsRoutingModule
  ]
})
export class ContemplationsModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
