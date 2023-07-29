import { NgModule } from '@angular/core';
import { OrganizationViewComponent } from './organization-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganizationViewRoutingModule } from './organization-view-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ListAppointmentsOrganizationModule } from '../list-appointments-organization/list-appointments-organization.module';

@NgModule({
  declarations: [
    OrganizationViewComponent
  ],
  imports: [
    SharedModule,
    OrganizationViewRoutingModule,
    MatDividerModule,
    MatButtonModule,
    ListAppointmentsOrganizationModule
  ]
})
export class OrganizationViewModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.registerIcons();
	}

	registerIcons() {
		this.mdIconRegistry.addSvgIcon('icon_quote', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon_quote.svg'));
	}
}
