import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {MatListModule} from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    PostListComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatTooltipModule
  ],
  exports: [PostListComponent]
})
export class PostListModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
  }
 }
