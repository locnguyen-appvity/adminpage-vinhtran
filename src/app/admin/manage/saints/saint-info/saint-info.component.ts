import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-saint-info',
	templateUrl: './saint-info.component.html',
	styleUrls: ['./saint-info.component.scss']
})
export class SaintInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';
	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<SaintInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		let name = '';
		let code = '';
		let status = true;
		this.target = this.dialogData.target;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			name = this.dialogData.item.name;
			code = this.dialogData.item.code;
			this.ID = this.dialogData.item.id;
			status = this.dialogData.item.deActive == 0 ? true : false;
		}
		this.dataItemGroup = this.fb.group({
			name: [name, [Validators.required]],
			status: status,
			code: code,
			anniversarySaint: (this.dialogData && this.dialogData.item) ? this.dialogData.item.anniversarySaint : ""
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			if (this.target === 'edit') {
				this.hasChangedGroup = this.isChangedForm(valueForm);
			}
			else {
				this.hasChangedGroup = true;
			}
		})
		this.dataItemGroup.get('name').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: string) => {
			this.dataItemGroup.get('code').setValue(this.sharedService.convertLocaleLowerCase(this.sharedService.removeVietnameseTones(name)));
		})
	}

	isChangedForm(valueForm: any) {
		if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.anniversarySaint, this.dialogData.anniversarySaint)) {
			return true;
		}
		let status = this.dialogData.item.deActive == 0 ? true : false;
		if (this.sharedService.isChangedValue(valueForm.status, status)) {
			return true;
		}
		return false;
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	deleteItem() {
		this.dataProcessing = true;
		// this.service.deleteSaint(this.ID).pipe(take(1)).subscribe(() => {
		// 	this.dataProcessing = false;
		// 	this.dialogRef.close('Deleted');
		// })
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			code: valueForm.code,
			anniversarySaint: valueForm.anniversarySaint,
			deActive: valueForm.status ? 0 : 1
		}
		// if (this.target == 'edit') {
		// 	this.dataProcessing = true;
		// 	this.service.updateSaint(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
		// 		this.dataProcessing = false;
		// 		this.dialogRef.close('OK');
		// 	})
		// }
		// else {
		// 	this.dataProcessing = true;
		// 	this.service.createSaint(dataJSON).pipe(take(1)).subscribe(() => {
		// 		this.dataProcessing = false;
		// 		this.dialogRef.close('OK');
		// 	})
		// }
	}

}