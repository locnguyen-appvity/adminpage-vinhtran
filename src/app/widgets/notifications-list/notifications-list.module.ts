import { NgModule } from '@angular/core';
import { NotificationsListComponent } from './notifications-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [
		NotificationsListComponent
	],
	imports: [
		SharedModule,
		MatListModule,
		MatDividerModule,
		MatTooltipModule
	],
	exports: [NotificationsListComponent]
})
export class NotificationsListModule { }
