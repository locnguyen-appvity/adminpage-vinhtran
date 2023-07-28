import { NgModule } from '@angular/core';
import { MassesForChurchTransformerPipe } from './masses-for-church.pipe';



@NgModule({
  declarations: [
    MassesForChurchTransformerPipe
  ],
  exports: [
    MassesForChurchTransformerPipe
  ]
})
export class ManageModule { 
  
}
