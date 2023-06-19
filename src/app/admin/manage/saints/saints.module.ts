import { NgModule } from '@angular/core';
import { SaintsComponent } from './saints.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaintInfoComponent } from './saint-info/saint-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskModule } from 'ngx-mask';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { SaintsRoutingModule } from './saints-routing.module';



@NgModule({
  declarations: [
    SaintsComponent,
    SaintInfoComponent
  ],
  imports: [
    SharedModule,
    SaintsRoutingModule, 
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgxMaskModule.forRoot({
      validation: false,
    }),
    ScrollingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ListItemsBaseModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class SaintsModule { }
