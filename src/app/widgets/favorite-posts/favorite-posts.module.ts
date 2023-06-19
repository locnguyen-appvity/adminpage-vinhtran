import { NgModule } from '@angular/core';
import { FavoritePostsComponent } from './favorite-posts.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    FavoritePostsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [FavoritePostsComponent]
})
export class FavoritePostsModule { }
