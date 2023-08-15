import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutsComponent } from './layouts.component';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LayoutsListModule } from './layouts-list/layouts-list.module';


@NgModule({
  declarations: [
    LayoutsComponent,
  ],
  imports: [
    SharedModule,
    LayoutsRoutingModule,
    LayoutsListModule
  ]
})
export class LayoutsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
  }
 }
