import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-event-info',
	templateUrl: './event-info.component.html',
	styleUrls: ['./event-info.component.scss'],
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
export class EventInfoComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public title: string = "Sự Kiện";
	public localItem: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<EventInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.dataItemGroup = this.initialEventGroup(this.localItem);
	}

	initialEventGroup(item: any): FormGroup {
		return this.fb.group({
			id: item ? item.id : '',
			name: [item ? item.name : '', Validators.required],
			day: [item ? item.day : '', Validators.required],
			date: item ? item._date : '',
			description: item ? item.description : '',
		});
	}


	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {

	}
}
