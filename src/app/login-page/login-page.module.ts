import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { SharedModule } from '../shared/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule
  ],
  exports: [LoginPageComponent]
})
export class LoginPageModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_visibility_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_visibility_off_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_off_48dp.svg'));
  }
 }
