import { NgModule } from '@angular/core';
import { ClergyViewComponent } from './clergy-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClergyViewRoutingModule } from './clergy-view-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { ListAppointmentsClergyModule } from '../list-appointments-clergy/list-appointments-clergy.module';
// import { JoditAngularModule } from 'jodit-angular';
// import { DialogSelectedImgsModule } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.module';
@NgModule({
  declarations: [
    ClergyViewComponent
  ],
  imports: [
    SharedModule,
    ClergyViewRoutingModule,
    MatDividerModule,
    ListAppointmentsClergyModule
  ]
})
export class ClergyViewModule { }
