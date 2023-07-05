import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListIMGsComponent } from './list-imgs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogSelectedImgsModule } from '../dialog-selected-imgs/dialog-selected-imgs.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListIMGsComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    DialogSelectedImgsModule
  ],
  exports: [ListIMGsComponent]
})
export class ListIMGsModule {
}
