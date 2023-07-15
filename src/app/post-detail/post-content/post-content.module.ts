import { NgModule } from '@angular/core';
import { PostContentComponent } from './post-content.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostContactModule } from '../post-contact/post-contact.module';
import { PostAuthorModule } from '../post-author/post-author.module';
import { PostsRelatedModule } from 'src/app/widgets/posts-related/posts-related.module';
// import { JoditAngularModule } from 'jodit-angular';



@NgModule({
  declarations: [
    PostContentComponent
  ],
  imports: [
    SharedModule,
    PostContactModule,
    PostAuthorModule,
    PostsRelatedModule
  ],
  exports: [PostContentComponent]
})
export class PostContentModule { }
