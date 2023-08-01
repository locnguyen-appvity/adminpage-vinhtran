import { NgModule } from '@angular/core';
import { ClergyViewComponent } from './clergy-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClergyViewRoutingModule } from './clergy-view-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { ListAppointmentsClergyModule } from '../list-appointments-clergy/list-appointments-clergy.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ItineraryFilesModule } from 'src/app/controls/itinerary-files/itinerary-files.module';
// import { JoditAngularModule } from 'jodit-angular';
// import { DialogSelectedImgsModule } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.module';
@NgModule({
  declarations: [
    ClergyViewComponent
  ],
  imports: [
    SharedModule,
    ClergyViewRoutingModule,
    MatDividerModule,
    ListAppointmentsClergyModule,
    MatButtonModule,
    ItineraryFilesModule
  ]
})
export class ClergyViewModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
		private sanitizer: DomSanitizer) {
		this.registerIcons();
	}

	registerIcons() {
		this.mdIconRegistry.addSvgIcon('icon_quote', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon_quote.svg'));
	}
}
