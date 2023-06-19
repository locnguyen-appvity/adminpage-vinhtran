import { NgModule } from '@angular/core';
import { TagsComponent } from './tags.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsRoutingModule } from './tags-routing.module';



@NgModule({
  declarations: [
    TagsComponent
  ],
  imports: [
    SharedModule,
    TagsRoutingModule
  ]
})
export class TagsModule { }
