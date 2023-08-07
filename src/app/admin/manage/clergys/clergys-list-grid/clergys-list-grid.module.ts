import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClergiesListComponent } from './clergys-list-grid.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClergyInfoModule } from '../clergy-info/clergy-info.module';
import { ClergiesRoutingModule } from './clergys-list-grid-routing.module';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    ClergiesListComponent,
  ],
  imports: [
    SharedModule,
    ClergiesRoutingModule,
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
    MatFormFieldModule,
    AutocompleteSimpleModule,
    ClergyInfoModule,
    MatSelectModule
  ],
  exports: [ClergiesListComponent]
})
export class ClergiesListModule { }
