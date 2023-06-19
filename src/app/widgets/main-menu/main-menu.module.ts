import { NgModule } from '@angular/core';
import { MainMenuComponent } from './main-menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    SharedModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatListModule,
  ],
  exports: [MainMenuComponent]

})
export class MainMenuModule { }
