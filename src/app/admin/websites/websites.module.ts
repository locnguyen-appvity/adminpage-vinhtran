import { NgModule } from '@angular/core';
import { WebsitesComponent } from './websites.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebsitesRoutingModule } from './websites-routing.module';



@NgModule({
  declarations: [
    WebsitesComponent
  ],
  imports: [
    SharedModule,
    WebsitesRoutingModule
  ]
})
export class WebsitesModule { 
  
}
