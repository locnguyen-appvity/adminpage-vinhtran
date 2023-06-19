import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
    MatDividerModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
