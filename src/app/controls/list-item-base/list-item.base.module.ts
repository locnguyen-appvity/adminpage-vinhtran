import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListItemBaseComponent } from './list-item.base.component';


@NgModule({
  declarations: [
    ListItemBaseComponent
  ],
  imports: [
    SharedModule,
    MatSnackBarModule
  ],
  exports: [ListItemBaseComponent]
})
export class ListItemsBaseModule { }
