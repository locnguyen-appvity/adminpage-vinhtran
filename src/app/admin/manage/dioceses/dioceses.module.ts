import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiocesesComponent } from './dioceses.component';
import { DiocesesRoutingModule } from './dioceses-routing.module';



@NgModule({
  declarations: [
    DiocesesComponent
  ],
  imports: [
    SharedModule,
    DiocesesRoutingModule
  ]
})
export class DiocesesModule { }
