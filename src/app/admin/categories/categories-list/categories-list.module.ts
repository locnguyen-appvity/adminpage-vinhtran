import { NgModule } from '@angular/core';
import { CategoriesListComponent } from './categories-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesListRoutingModule } from './categories-list-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { CategoryInfoModule } from '../category-info/category-info.module';
import { MatMenuModule } from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTreeModule} from '@angular/material/tree';

@NgModule({
  declarations: [
    CategoriesListComponent
  ],
  imports: [
    SharedModule,
    CategoriesListRoutingModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    DragDropModule,
    MatTreeModule,
    ListItemsBaseModule,
    CategoryInfoModule
  ]
})
export class CategoriesListModule { }
