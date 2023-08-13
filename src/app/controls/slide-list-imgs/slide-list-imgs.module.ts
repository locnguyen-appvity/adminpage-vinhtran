import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SideListIMGsComponent } from './slide-list-imgs.component';
import { ListIMGsModule } from '../list-imgs/list-imgs.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SideListIMGsComponent],
  imports: [
    SharedModule,
    ListIMGsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [SideListIMGsComponent]
})
export class SideListIMGsModule {
}
