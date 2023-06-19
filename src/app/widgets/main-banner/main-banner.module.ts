import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainBannerComponent } from './main-banner.component';

@NgModule({
  declarations: [
    MainBannerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MainBannerComponent]
})
export class MainBannerModule { }
