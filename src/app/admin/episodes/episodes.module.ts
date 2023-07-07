import { NgModule } from '@angular/core';
import { EpisodesComponent } from './episodes.component';
import { EpisodesRoutingModule } from './episodes-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EpisodesComponent
  ],
  imports: [
    SharedModule,
    EpisodesRoutingModule
  ]
})
export class EpisodesModule { }
