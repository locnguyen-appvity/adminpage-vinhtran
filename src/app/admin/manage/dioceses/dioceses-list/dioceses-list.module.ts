import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiocesesListComponent } from './dioceses-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { DiocesesListRoutingModule } from './dioceses-list-routing.module';
import { DioceseInfoModule } from '../diocese-info/diocese-info.module';



@NgModule({
  declarations: [
    DiocesesListComponent
  ],
  imports: [
    SharedModule,
    DiocesesListRoutingModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ListItemsBaseModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    DioceseInfoModule
  ]
})
export class DiocesesListModule { }
