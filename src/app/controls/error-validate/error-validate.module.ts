import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorValidateComponent } from './error-validate.component';
import { CapitalizeFirstPipe } from './capitalize-first.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ErrorValidateComponent, CapitalizeFirstPipe],
  exports: [ErrorValidateComponent]
})
export class ErrorValidateModule { }
