import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { OrganizationsListComponent } from './organizations-list.component';
import { SearchOrganizationsModule } from '../search-organizations/search-organizations.module';



@NgModule({
  declarations: [
    OrganizationsListComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    SearchOrganizationsModule
  ],
  exports: [OrganizationsListComponent]
})
export class OrganizationsListModule { }
