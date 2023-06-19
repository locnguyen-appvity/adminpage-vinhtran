import { NgModule } from '@angular/core';
import { NotificationsListComponent } from './notifications-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
	declarations: [
		NotificationsListComponent
	],
	imports: [
		SharedModule,
		MatListModule,
		MatDividerModule
	],
	exports: [NotificationsListComponent]
})
export class NotificationsListModule { }
