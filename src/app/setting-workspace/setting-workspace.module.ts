import { NgModule } from '@angular/core';
import { SettingWorkspaceComponent } from './setting-workspace.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorPickerControlModule } from '../controls/color-picker-control/color-picker-control.module';


@NgModule({
  declarations: [
    SettingWorkspaceComponent
  ],
  imports: [
    SharedModule,
    ColorPickerControlModule
  ],
  exports: [SettingWorkspaceComponent]
})
export class SettingWorkspaceModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_close_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_done_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_done_48dp.svg'));
  }
}
