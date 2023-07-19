import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MigrationsComponent } from './migrations.component';
import { MigrationsRoutingModule } from './migrations-routing.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MigrationsListModule } from './migrations-list/migrations-list.module';


@NgModule({
  declarations: [
    MigrationsComponent,
  ],
  imports: [
    SharedModule,
    MigrationsRoutingModule,
    MigrationsListModule
  ]
})
export class MigrationsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_arrow_forward', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_forward.svg'));
  }
 }
