import { NgModule } from '@angular/core';
import { DialogSelectedImgsComponent } from './dialog-selected-imgs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FoldersTreeModule } from '../folders-tree/folders-tree.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    DialogSelectedImgsComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FoldersTreeModule
  ],
  exports: [DialogSelectedImgsComponent]
})
export class DialogSelectedImgsModule {

 }
