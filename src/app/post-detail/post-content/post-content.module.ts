import { NgModule } from '@angular/core';
import { PostContentComponent } from './post-content.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostContactModule } from '../post-contact/post-contact.module';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [
    PostContentComponent
  ],
  imports: [
    SharedModule,
    PostContactModule,
    QuillModule
  ],
  exports: [PostContentComponent]
})
export class PostContentModule { }
