import { NgModule } from '@angular/core';
import { ManageComponent } from './manage.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';



@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    SharedModule,
    ManageRoutingModule
  ]
})
export class ManageModule { 
}
