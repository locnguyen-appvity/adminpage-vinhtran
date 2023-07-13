import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import { AngularSplitModule } from 'angular-split';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FolderInfoModule } from '../folder-info/folder-info.module';
import { ToastSnackbarAppModule } from '../toast-snackbar/toast-snackbar.module';
import { MediaFilesListModule } from '../media-files-list/media-files-list.module';
import { MediaFilesTreeControlComponent } from './media-files-tree-control.component';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MediaFilesTreeControlComponent
  ],
  imports: [
    SharedModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatTreeModule,
    FolderInfoModule,
    ToastSnackbarAppModule,
    AngularSplitModule,
    MediaFilesListModule
  ],
  exports: [MediaFilesTreeControlComponent]
})
export class MediaFilesTreeControlModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.mdIconRegistry.addSvgIcon('ic_cloud_upload_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cloud_upload_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_add_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_edit_note_24dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_edit_note_24dp.svg'));
  }
}
