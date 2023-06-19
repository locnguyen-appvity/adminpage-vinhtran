import { NgModule } from '@angular/core';
import { ColorPickerControlComponent } from './color-picker-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    ColorPickerControlComponent
  ],
  imports: [
    SharedModule,
    MatInputModule,
    ColorPickerModule
  ],
  exports: [ColorPickerControlComponent]
})
export class ColorPickerControlModule { }
