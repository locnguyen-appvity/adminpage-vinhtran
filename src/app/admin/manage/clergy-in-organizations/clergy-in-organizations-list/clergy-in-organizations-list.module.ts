import { NgModule } from '@angular/core';
import { ClergyInOrganizationsListComponent } from './clergy-in-organizations-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { ClergyInOrganizationsInfoModule } from '../clergy-in-organizations-info/clergy-in-organizations-info.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    ClergyInOrganizationsListComponent
  ],
  imports: [
    SharedModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    ListItemsBaseModule,
    ClergyInOrganizationsInfoModule,
    MatMenuModule
  ],
  exports: [ClergyInOrganizationsListComponent]
})
export class ClergyInOrganizationsListModule { }