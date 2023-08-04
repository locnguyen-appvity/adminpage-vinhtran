import { Component, Inject, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';

@Component({
	selector: 'app-dialog-confirm',
	templateUrl: './confirm.component.html',
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
export class DialogConfirmComponent {
	public header: string = '';
	public confirmMessage: string = '';
	public submitBtn: string = 'Xác Nhận';
	public cancelBtn: string = 'Hủy';
	public actionSubmit: string = 'ok';
	public actionCancel: string = 'cancel';
	public colorCancel: string = 'default';
	public colorSubmit: string = 'warn';
	public formCtrl: FormControl;
	public value: string = '';
	public valueType: string = '';
	public lableCtrl: string = '';
	public requireCtrl: boolean = false;
	public arrFromList: any[] = [];

	constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		public dialogRef: MatDialogRef<DialogConfirmComponent>
	) {
		if (this.dialogData.value) {
			this.value = this.dialogData.value;
		}
		this.formCtrl = new FormControl(this.value);
		if (this.dialogData.header) {
			this.header = this.dialogData.header;
		}
		if (this.dialogData.confirmMessage) {
			this.confirmMessage = this.dialogData.confirmMessage;
		}
		if (this.dialogData.submitBtn) {
			this.submitBtn = this.dialogData.submitBtn;
		}
		if (this.dialogData.cancelBtn) {
			this.cancelBtn = this.dialogData.cancelBtn;
		}
		if (this.dialogData.actionCancel) {
			this.actionCancel = this.dialogData.actionCancel;
		}
		if (this.dialogData.actionSubmit) {
			this.actionSubmit = this.dialogData.actionSubmit;
		}
		if (this.dialogData.colorCancel) {
			this.colorCancel = this.dialogData.colorCancel;
		}
		if (this.dialogData.colorSubmit) {
			this.colorSubmit = this.dialogData.colorSubmit;
		}
		if (this.dialogData.valueType) {
			this.valueType = this.dialogData.valueType;
		}
		if (this.dialogData.arrFromList) {
			this.arrFromList = this.dialogData.arrFromList;
		}
		if (this.dialogData.requireCtrl) {
			this.requireCtrl = this.dialogData.requireCtrl;
		}
		if (this.dialogData.lableCtrl) {
			this.lableCtrl = this.dialogData.lableCtrl;
		}
		if(this.requireCtrl){
			this.formCtrl.setValidators(Validators.required);
			this.formCtrl.updateValueAndValidity();
		}
	}

	saveData(action: string) {
		this.dialogRef.close({ action: action, data: this.formCtrl.value });
	}
}
