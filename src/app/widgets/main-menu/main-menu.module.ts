import { NgModule } from '@angular/core';
import { MainMenuComponent } from './main-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    SharedModule,
    MatButtonToggleModule,
    MatButtonModule,
    HttpClientModule,
    CarouselModule,
    MatListModule,
  ],
  exports: [MainMenuComponent]

})
export class MainMenuModule { }
