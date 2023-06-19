import { NgModule } from '@angular/core';
import { FoldersTreeComponent } from './folders-tree.component';
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
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { MatMenuModule } from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import { FolderInfoModule } from '../../admin/folders/folder-info/folder-info.module';
import { ToastSnackbarAppModule } from 'src/app/controls/toast-snackbar/toast-snackbar.module';
import { AngularSplitModule } from 'angular-split';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ItineraryIMGsModule } from 'src/app/controls/itinerary-imgs/itinerary-imgs.module';

@NgModule({
  declarations: [
    FoldersTreeComponent
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
    ListItemsBaseModule,
    FolderInfoModule,
    ToastSnackbarAppModule,
    AngularSplitModule,
    ItineraryIMGsModule
  ],
  exports: [FoldersTreeComponent]
})
export class FoldersTreeModule { }
