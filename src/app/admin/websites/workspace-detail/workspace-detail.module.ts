import { NgModule } from '@angular/core';
import { WorkspaceDetailComponent } from './workspace-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkspaceDetailRoutingModule } from './workspace-detail-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UploadAvatarModule } from 'src/app/controls/upload-avatar/upload-avatar.module';
@NgModule({
  declarations: [
    WorkspaceDetailComponent
  ],
  imports: [
    SharedModule,
    WorkspaceDetailRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    UploadAvatarModule
  ]
})
export class WorkspaceDetailModule { }
