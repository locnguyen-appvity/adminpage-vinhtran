import { NgModule } from '@angular/core';
import { LayoutDetailComponent } from './layout-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutDetailRoutingModule } from './layout-detail-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutsListModule } from '../layouts-list/layouts-list.module';
// import { JoditAngularModule } from 'jodit-angular';
// import { DialogSelectedImgsModule } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.module';
@NgModule({
  declarations: [
    LayoutDetailComponent
  ],
  imports: [
    SharedModule,
    LayoutDetailRoutingModule,
    DragDropModule,
    MatSidenavModule,
    MatCardModule,
    LayoutsListModule
  ]
})
export class LayoutDetailModule { }
