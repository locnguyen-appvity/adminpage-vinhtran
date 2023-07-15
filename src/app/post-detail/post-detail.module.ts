import { NgModule } from '@angular/core';
import { PostDetailComponent } from './post-detail.component';
import { SharedModule } from '../shared/shared.module';
import { PostDetailRoutingModule } from './post-detail-routing.module';
import { PostContentModule } from './post-content/post-content.module';
import { PostListModule } from '../widgets/post-list/post-list.module';
import { PostNewModule } from '../widgets/post-new/post-new.module';



@NgModule({
  declarations: [
    PostDetailComponent
  ],
  imports: [
    SharedModule,
    PostDetailRoutingModule,
    PostContentModule,
    PostNewModule,
    PostListModule,
  ]
})
export class PostDetailModule { }
