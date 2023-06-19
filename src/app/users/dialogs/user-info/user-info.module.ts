import { NgModule } from '@angular/core';
import { UserInfoComponent } from './user-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    // AutocompleteSimpleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    // ErrorValidateModule,
    // ItineraryIMGsModule,
    MatCheckboxModule,
    // UploadAvatarModule,
    MatDatepickerModule
  ],
  exports: [UserInfoComponent]
})
export class UserInfoModule { }
