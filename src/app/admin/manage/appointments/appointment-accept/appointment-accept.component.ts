import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { DialogConfirmComponent } from 'src/app/controls/confirm';
import { STATUS_CLERGY } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-appointment-accept',
	templateUrl: './appointment-accept.component.html',
	styleUrls: ['./appointment-accept.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppCustomDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: CUSTOM_DATE_FORMATS
		}
	]
})
export class AppointmentAcceptComponent extends SimpleBaseComponent {

	// public dataItemGroup: FormGroup;
	public mode: string = 'new';
	public localItem: any;
	public title: string = "Thêm";
	public positionListCache: any[] = [];
	public statusClergy: any[] = STATUS_CLERGY;
	public searchValue: string = '';
	public fromAppointmentItem: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<AppointmentAcceptComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);

		if (this.dialogData.item) {
			this.title = "Xác Nhận";
			this.localItem = this.dialogData.item;
			this.mode = 'edit';
			
		}
		this.getPositions();
	}

	getPositions() {
		let options = {
			select: "id,name,code,slot,level",
			filter: "status ne 'inactive'"
		}
		this.positionListCache = [];
		this.service.getPositions(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionListCache = items;
				if (this.localItem && this.localItem.fromAppointmentID) {
					this.getAppointment(this.localItem.fromAppointmentID);
					if (this.localItem.fromAppointmentToDate) {
						this.localItem._fromAppointmentToDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.fromAppointmentToDate);
						this.localItem.fromAppointmentToDateView = this.sharedService.formatDate(this.localItem._fromAppointmentToDate);
					}
				}
			}
		})
	}

	getAppointment(appointmentID: string) {
		this.service.getAppointment(appointmentID).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.fromAppointmentItem = res;
				if (this.fromAppointmentItem.fromDate) {
					this.fromAppointmentItem._fromDate = this.sharedService.convertDateStringToMomentUTC_0(this.fromAppointmentItem.fromDate);
					this.fromAppointmentItem.fromDateView = this.sharedService.formatDate(this.fromAppointmentItem._fromDate);
				}
				if (this.fromAppointmentItem && this.fromAppointmentItem.effectiveDate) {
					this.fromAppointmentItem._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(this.fromAppointmentItem.effectiveDate);
					this.fromAppointmentItem.effectiveDateView = this.sharedService.formatDate(this.fromAppointmentItem._effectiveDate);
				}
				this.fromAppointmentItem.positionView = 'Chưa xác định'
				if (!this.isNullOrEmpty(this.fromAppointmentItem.position)) {
					let position = this.sharedService.getValueAutocomplete(this.fromAppointmentItem.position, this.positionListCache, 'code');
					if (position && position.name) {
						this.fromAppointmentItem.positionView = position.name;
					}
				}
			}
		})
	}

	getPosition(item: any) {
		item.positionView = 'Chưa xác định'
		if (!this.isNullOrEmpty(item.position)) {
			let position = this.sharedService.getValueAutocomplete(item.position, this.positionListCache, 'code');
			if (position && position.name) {
				item.positionView = position.name;
			}
		}
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		this.service.approveAppointment(this.localItem.id).pipe(take(1)).subscribe({
			next: () => {
				this.dialogRef.close("OK");
			}
		})
	}

}
