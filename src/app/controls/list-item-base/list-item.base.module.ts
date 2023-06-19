import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListItemBaseComponent } from './list-item.base.component';


@NgModule({
  declarations: [
    ListItemBaseComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [ListItemBaseComponent]
})
export class ListItemsBaseModule { }
