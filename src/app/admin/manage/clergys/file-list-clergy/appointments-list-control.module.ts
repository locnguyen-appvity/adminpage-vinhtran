import { NgModule } from '@angular/core';
import { AppointmentsListComponent } from './appointments-list-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListItemsBaseModule } from 'src/app/controls/list-item-base/list-item.base.module';
import { MatMenuModule } from '@angular/material/menu';
import { AppointmentInfoModule } from 'src/app/admin/manage/appointments/appointment-info/appointment-info.module';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppointmentsListComponent
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
    MatMenuModule,
    AppointmentInfoModule
  ],
  exports: [AppointmentsListComponent]
})
export class AppointmentsListModule { 
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_create_48px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_create_48px.svg'));
    this.mdIconRegistry.addSvgIcon('ic_arrow_forward', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_forward.svg'));
    this.mdIconRegistry.addSvgIcon('ic_shortcut_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_shortcut_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_stop_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_stop_48dp.svg'));
    this.mdIconRegistry.addSvgIcon('ic_add_business_48dp', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_business_48dp.svg'));
  }
}
