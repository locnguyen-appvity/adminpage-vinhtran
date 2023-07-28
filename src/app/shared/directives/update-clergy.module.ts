import { NgModule } from '@angular/core';
import { UpdatePositionClergyDirective } from './update-position-clergy.directive';
import { UpdateAnniversariesClergyDirective } from './update-anniversaries-clergy.directive';

@NgModule({
  declarations: [
    UpdatePositionClergyDirective,
    UpdateAnniversariesClergyDirective
  ],
  exports: [UpdatePositionClergyDirective,UpdateAnniversariesClergyDirective]
})
export class UpdateClergyModule {
}
