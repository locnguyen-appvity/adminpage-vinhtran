import { NgModule } from '@angular/core';
import { SlidesComponent } from './slides.component';
import { SlidesRoutingModule } from './slides-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SlidesComponent
  ],
  imports: [
    SharedModule,
    SlidesRoutingModule
  ]
})
export class SlidesModule { }
