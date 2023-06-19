import { NgModule } from '@angular/core';
import { AuthorsListComponent } from './authors-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
import { MatMenuModule } from '@angular/material/menu';
import { AuthorsListRoutingModule } from './authors-list-routing.module';
import { AuthorInfoModule } from '../author-info/author-info.module';

@NgModule({
  declarations: [
    AuthorsListComponent
  ],
  imports: [
    SharedModule,
    AuthorsListRoutingModule,
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
    ListItemsBaseModule,
    AuthorInfoModule
  ]
})
export class CategoriesListModule { }
