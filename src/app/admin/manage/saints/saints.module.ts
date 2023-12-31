import { NgModule } from '@angular/core';
import { SaintsComponent } from './saints.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { SaintsRoutingModule } from './saints-routing.module';
import { SaintInfoModule } from './saint-info/saint-info.module';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    SaintsComponent
  ],
  imports: [
    SharedModule,
    SaintsRoutingModule, 
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
    SaintInfoModule
  ]
})
export class SaintsModule { }
