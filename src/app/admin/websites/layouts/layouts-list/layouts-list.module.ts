import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutsListComponent } from './layouts-list.component';
import { LayoutInfoModule } from '../layout-info/layout-info.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    LayoutsListComponent,
  ],
  imports: [
    SharedModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    LayoutInfoModule
  ],
  exports: [LayoutsListComponent]
})
export class LayoutsListModule { }
