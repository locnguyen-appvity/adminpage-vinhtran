import { NgModule } from '@angular/core';
import { ClergysComponent } from './clergys.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClergysRoutingModule } from './clergys-routing.module';


@NgModule({
  declarations: [
    ClergysComponent
  ],
  imports: [
    SharedModule,
    ClergysRoutingModule
  ]
})
export class ClergysModule { }
