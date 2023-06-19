import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItineraryIMGsComponent } from './itinerary-imgs.component';
import { ngfModule } from "angular-file"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ItineraryIMGsComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ngfModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  exports: [ItineraryIMGsComponent]
})
export class ItineraryIMGsModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.mdIconRegistry.addSvgIcon('ic_cloud_upload_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cloud_upload_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_refresh', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_refresh_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_save_alt_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_save_alt_24px.svg'));
  }
}
