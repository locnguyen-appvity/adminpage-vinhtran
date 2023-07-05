import { NgModule } from '@angular/core';
import { CataloguesComponent } from './catalogues.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CataloguesRoutingModule } from './catalogues-routing.module';



@NgModule({
  declarations: [
    CataloguesComponent
  ],
  imports: [
    SharedModule,
    CataloguesRoutingModule
  ]
})
export class CataloguesModule { }
