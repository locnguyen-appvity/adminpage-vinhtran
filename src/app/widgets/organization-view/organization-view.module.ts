import { NgModule } from '@angular/core';
import { OrganizationViewComponent } from './organization-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganizationViewRoutingModule } from './organization-view-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ListAppointmentsOrganizationModule } from '../list-appointments-organization/list-appointments-organization.module';
import { ClergiesAppointmentModule } from '../clergies-appointment/clergies-appointment.module';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OrganizationViewComponent
  ],
  imports: [
    SharedModule,
    OrganizationViewRoutingModule,
    MatDividerModule,
    MatButtonModule,
    ListAppointmentsOrganizationModule,
    ClergiesAppointmentModule,
    EditorControlModule,
    ReactiveFormsModule
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
