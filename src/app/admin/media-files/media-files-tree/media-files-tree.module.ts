import { NgModule } from '@angular/core';
import { MediaFilesTreeComponent } from './media-files-tree.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import { FolderInfoModule } from '../../../controls/folder-info/folder-info.module';
import { AngularSplitModule } from 'angular-split';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastSnackbarAppModule } from '../../../controls/toast-snackbar/toast-snackbar.module';
import { MediaFilesListModule } from '../media-files-list/media-files-list.module';
import { MediaFilesTreeRoutingModule } from './media-files-tree-routing.module';

@NgModule({
  declarations: [
    MediaFilesTreeComponent
  ],
  imports: [
    SharedModule,
    MediaFilesTreeRoutingModule,
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
  exports: [MediaFilesTreeComponent]
})
export class MediaFilesTreeModule { }
