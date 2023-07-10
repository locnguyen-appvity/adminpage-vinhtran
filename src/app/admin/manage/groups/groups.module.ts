import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';



@NgModule({
  declarations: [
    GroupsComponent
  ],
  imports: [
    SharedModule,
    GroupsRoutingModule
  ]
})
export class GroupsModule { }
