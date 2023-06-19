import { NgModule } from '@angular/core';
import { ParablesComponent } from './parables.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ParablesRoutingModule } from './parables-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    ParablesComponent
  ],
  imports: [
    SharedModule,
    ParablesRoutingModule
  ]
})
export class ParablesModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_send_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_send_48dp.svg'));
  }
}
