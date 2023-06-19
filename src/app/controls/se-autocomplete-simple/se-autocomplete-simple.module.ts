
import { NgModule } from '@angular/core';
import { AutocompleteSimpleComponent } from './se-autocomplete-simple.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [AutocompleteSimpleComponent],
  exports: [AutocompleteSimpleComponent]
})

export class AutocompleteSimpleModule {}
