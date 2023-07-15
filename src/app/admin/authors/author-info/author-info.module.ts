import { NgModule } from '@angular/core';
import { AuthorInfoComponent } from './author-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
// import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UploadAvatarModule } from 'src/app/controls/upload-avatar/upload-avatar.module';


@NgModule({
  declarations: [
    AuthorInfoComponent
  ],
  imports: [
    SharedModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    UploadAvatarModule
  ],
  exports: [AuthorInfoComponent]
})
export class AuthorInfoModule { }
