import { NgModule } from '@angular/core';
import { OrganizationDetailComponent } from './organization-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganizationDetailRoutingModule } from './organization-detail-routing.module';
// import { JoditAngularModule } from 'jodit-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SEChipControlModule } from 'src/app/controls/se-chip-control/se-chip-control.module';
import { MatChipsModule } from '@angular/material/chips';
import { SEChipSimpleModule } from 'src/app/controls/se-chip-simple/se-chip-simple.module';
// import { DialogSelectedImgsModule } from 'src/app/controls/dialog-selected-imgs/dialog-selected-imgs.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AutocompleteSimpleModule } from 'src/app/controls/se-autocomplete-simple';
import { EditorControlModule } from 'src/app/controls/editor-control/editor-control.module';
import { UploadAvatarModule } from 'src/app/controls/upload-avatar/upload-avatar.module';
import { NgxMaskModule } from 'ngx-mask';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MassesListModule } from '../../masses/masses-list/masses-list.module';
import { EventsListModule } from '../../events/events-list/events-list.module';
import { AppointmentsListModule } from '../../../../controls/appointments-list-control/appointments-list-control.module';
import { SideListIMGsModule } from 'src/app/controls/slide-list-imgs/slide-list-imgs.module';
@NgModule({
  declarations: [
    OrganizationDetailComponent
  ],
  imports: [
    SharedModule,
    // DialogSelectedImgsModule,
    MatDialogModule,
    OrganizationDetailRoutingModule,
    // JoditAngularModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    SEChipControlModule,
    MatChipsModule,
    SEChipSimpleModule,
    AutocompleteSimpleModule,
    EditorControlModule,
    NgxMaskModule.forRoot({
      validation: false,
    }),
    MatDividerModule,
    UploadAvatarModule,
    MatExpansionModule,
    AppointmentsListModule,
    MassesListModule,
    EventsListModule,
    SideListIMGsModule
  ]
})
export class OrganizationDetailModule { }
