import { NgModule } from '@angular/core';
import { MainBannerComponent } from './main-banner.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MainBannerComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [MainBannerComponent]
})
export class MainBannerModule { }
