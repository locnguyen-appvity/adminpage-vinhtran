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
import { MatMenuModule } from '@angular/material/menu';
import {MatTreeModule} from '@angular/material/tree';
import { FolderInfoModule } from '../folder-info/folder-info.module';
import { AngularSplitModule } from 'angular-split';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToastSnackbarAppModule } from '../toast-snackbar/toast-snackbar.module';
import { ItineraryIMGsModule } from '../itinerary-imgs/itinerary-imgs.module';
import { DialogConfirmModule } from '../confirm';

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
    FolderInfoModule,
    ToastSnackbarAppModule,
    AngularSplitModule,
    ItineraryIMGsModule,
    DialogConfirmModule
  ],
  exports: [FoldersTreeComponent]
})
export class FoldersTreeModule { }
