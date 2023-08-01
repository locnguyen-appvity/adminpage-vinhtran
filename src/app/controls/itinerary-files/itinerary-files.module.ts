import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { ngfModule } from "angular-file"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItineraryFilesComponent } from './itinerary-files.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [ItineraryFilesComponent],
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
    MatListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  exports: [ItineraryFilesComponent]
})
export class ItineraryFilesModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.mdIconRegistry.addSvgIcon('ic_cloud_upload_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cloud_upload_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_refresh', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_refresh_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_save_alt_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_save_alt_24px.svg'));
  }
}
