import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ParableListRoutingModule } from './parables-list-routing.module';
import { ParableListComponent } from './parables-list.component';



@NgModule({
  declarations: [
    ParableListComponent
  ],
  imports: [
    SharedModule,
    ParableListRoutingModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule
  ],
  exports: [ParableListComponent]
})
export class ParableListModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_vpn_key_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_vpn_key_24dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_view_column_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_view_column_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_filter_list_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_filter_list_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_visibility_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_48dp.svg'));
  }
}
