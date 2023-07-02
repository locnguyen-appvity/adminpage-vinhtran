import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogItemsComponent } from './dialog-items.component';
import { SearchOrganizationsModule } from '../search-organizations/search-organizations.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SearchClergysModule } from '../search-clergys/search-clergys.module';



@NgModule({
  declarations: [
    DialogItemsComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
			validation: false,
		}),
    SearchOrganizationsModule,
    SearchClergysModule
  ],
  exports: [DialogItemsComponent]
})
export class DialogItemsModule { }
