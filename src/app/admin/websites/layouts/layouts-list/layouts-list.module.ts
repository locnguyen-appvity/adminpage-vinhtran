import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutsListComponent } from './layouts-list.component';
import { LayoutInfoModule } from '../layout-info/layout-info.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutsListComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatListModule,
    LayoutInfoModule
  ],
  exports: [LayoutsListComponent]
})
export class LayoutsListModule { }
