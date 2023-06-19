import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-dialog-confirm',
	templateUrl: './confirm.component.html'
})
export class DialogConfirmComponent {
	public header: string = '';
	public confirmMessage: string = '';
	public submitBtn: string = 'OK';
	public cancelBtn: string = 'Cancel';
	public actionSubmit: string = '';
	public actionCancel: string = '';
	public colorCancel: string = 'default';
	public colorSubmit: string = 'warn';

	constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		public dialogRef: MatDialogRef<DialogConfirmComponent>
	) {
		this.header = this.dialogData.header;
		this.confirmMessage = this.dialogData.confirmMessage;
		this.submitBtn = this.dialogData.submitBtn;
		this.cancelBtn = this.dialogData.cancelBtn;
		this.actionSubmit = this.dialogData.actionSubmit;
		this.actionCancel = this.dialogData.actionCancel;
		if(this.dialogData.colorCancel){
			this.colorCancel = this.dialogData.colorCancel;
		}
		if(this.dialogData.colorSubmit){
			this.colorSubmit = this.dialogData.colorSubmit;
		}
	}

	saveData(message: string) {
		this.dialogRef.close(message);
	}
}
