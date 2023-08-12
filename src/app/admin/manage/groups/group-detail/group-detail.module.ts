import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GroupDetailComponent } from './group-detail.component';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { OrganizationsListModule } from '../../organizations/organization-list/organizations-list.module';
import { GroupDetailRoutingModule } from './group-detail-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { UploadAvatarModule } from 'src/app/controls/upload-avatar/upload-avatar.module';


@NgModule({
  declarations: [
    GroupDetailComponent
  ],
  imports: [
    SharedModule,
    GroupDetailRoutingModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    EditorControlModule,
    OrganizationsListModule,
    MatExpansionModule,
    AutocompleteSimpleModule,
    UploadAvatarModule
  ],
  exports: [GroupDetailComponent]
})
export class GroupDetailModule { }
