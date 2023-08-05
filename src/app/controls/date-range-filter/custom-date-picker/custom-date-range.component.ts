import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';

@Component({
	selector: 'se-custom-date-range',
	templateUrl: './custom-date-range.component.html',
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

export class CustomDateRangeComponent extends SimpleBaseComponent {
	public customFormGroup: FormGroup;
	public hasBeenChanged: boolean = false;
	public requiredField: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<CustomDateRangeComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		private fb: FormBuilder,
		public sharedService: SharedPropertyService) {
		super(sharedService);
		if (this.dialogData.requiredField) {
			this.requiredField = this.dialogData.requiredField;
		}
		this.customFormGroup = this.fb.group({
			fromDate: [this.dialogData.fromDate, { required: this.requiredField }],
			toDate: [this.dialogData.toDate, { required: this.requiredField }]
		});
		this.customFormGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (value: any) => {
				this.hasBeenChanged = this.hasChangedForm(value);
			}
		});
	}

	hasChangedForm(value: any) {
		let currFromDate = '';
		let oldFromDate = '';
		if (value.fromDate) {
			currFromDate = this.sharedService.formatDate(value.fromDate.clone()) //DateUtility.getDateFormatString(value.fromDate.clone(), 'MM/DD/YYYY');
		}
		if (this.dialogData.fromDate) {
			oldFromDate = this.sharedService.formatDate(this.dialogData.fromDate.clone()) //DateUtility.getDateFormatString(this.dialogData.fromDate.clone(), 'MM/DD/YYYY');
		}
		if (this.sharedService.isChangedValue(currFromDate, oldFromDate)) {
			return true;
		}

		let currToDate = '';
		let oldToDate = '';
		if (value.toDate) {
			currToDate = this.sharedService.formatDate(value.toDate.clone()) //DateUtility.getDateFormatString(value.toDate.clone(), 'MM/DD/YYYY');
		}
		if (this.dialogData.toDate) {
			oldToDate = this.sharedService.formatDate(this.dialogData.toDate.clone())//DateUtility.getDateFormatString(this.dialogData.toDate.clone(), 'MM/DD/YYYY');
		}
		if (this.sharedService.isChangedValue(currToDate, oldToDate)) {
			return true;
		}

		return false;
	}

	saveDate() {
		this.dialogRef.close(this.customFormGroup.value);
	}
};
