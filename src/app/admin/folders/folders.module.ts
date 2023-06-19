import { NgModule } from '@angular/core';
import { FoldersComponent } from './folders.component';
import { FoldersRoutingModule } from './folders-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FoldersListModule } from './folders-list/folders-list.module';



@NgModule({
  declarations: [
    FoldersComponent
  ],
  imports: [
    SharedModule,
    FoldersRoutingModule,
    FoldersListModule
  ]
})
export class FoldersModule { }
