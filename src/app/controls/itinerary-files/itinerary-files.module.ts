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
import { DialogConfirmModule } from '../confirm';

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
    MatPaginatorModule,
    DialogConfirmModule
  ],
  exports: [ItineraryFilesComponent]
})
export class ItineraryFilesModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.mdIconRegistry.addSvgIcon('ic_cloud_upload_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cloud_upload_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_refresh', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_refresh_24px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_save_alt_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_save_alt_24px.svg'));
 
		this.mdIconRegistry.addSvgIcon('ic_audio_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_audio_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_document_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_document_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_excel_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_excel_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_image_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_image_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_pdf_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_pdf_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_powerpoint_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_powerpoint_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_video_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_video_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_word_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_word_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_zip_file', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_zip_file.svg'));
		this.mdIconRegistry.addSvgIcon('ic_folder', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/upload_files/ic_folder.svg'));
    this.mdIconRegistry.addSvgIcon('ic_edit_note_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_note_24dp.svg'));
  }
}
