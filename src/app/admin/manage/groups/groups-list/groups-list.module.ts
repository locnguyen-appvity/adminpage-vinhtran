import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import {GroupsListComponent } from './groups-list.component';
import { GroupInfoModule } from '../group-info/group-info.module';
import { GroupsListRoutingModule } from './groups-list-routing.module';


@NgModule({
  declarations: [
   GroupsListComponent,
  ],
  imports: [
    SharedModule,
    GroupsListRoutingModule,
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
    GroupInfoModule
  ],
  exports: [GroupsListComponent]
})
export class GroupsListModule { }
