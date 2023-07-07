import { NgModule } from '@angular/core';
import { ChaptersComponent } from './chapters.component';
import { ChaptersRoutingModule } from './chapters-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ChaptersComponent
  ],
  imports: [
    SharedModule,
    ChaptersRoutingModule
  ]
})
export class ChaptersModule { }
