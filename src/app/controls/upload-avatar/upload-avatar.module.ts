import { NgModule } from '@angular/core';
import { UploadAvatarComponent } from './upload-avatar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { DialogSelectedImgsModule } from '../dialog-selected-imgs/dialog-selected-imgs.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@NgModule({
  declarations: [
    UploadAvatarComponent
  ],
  imports: [
    SharedModule,
    MatButtonModule,
    DialogSelectedImgsModule
  ],
  exports: [UploadAvatarComponent]
})
export class UploadAvatarModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_photo_camera_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_photo_camera_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_image_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_image_48dp.svg'));
  }
}
