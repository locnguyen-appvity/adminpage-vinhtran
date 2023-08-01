import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-diocese-info',
	templateUrl: './diocese-info.component.html',
	styleUrls: ['./diocese-info.component.scss']
})
export class DioceseInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';
	public localItem: any;


	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<DioceseInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		let name = '';
		let status = true;
		this.target = this.dialogData.target;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			name = this.dialogData.item.name;
			this.ID = this.dialogData.item.id;
			status = this.dialogData.item.deActive == 0 ? true : false;
		}
		this.dataItemGroup = this.fb.group({
			name: [name, [Validators.required]],
			status: status
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			// if (this.target === 'edit') {
			// 	this.hasChangedGroup = this.isChangedForm(valueForm);
			// }
			// else {
			this.hasChangedGroup = true;
			// }
		})
	}

	buildFormGroup() {
		let status = (this.localItem && this.localItem.status == 'inactive') ? false : true;
		this.dataItemGroup = this.fb.group({
			// items: this.fb.array([]),
			name: [this.localItem ? this.localItem.name : '', [Validators.required]],
			stName: [this.localItem ? this.localItem.stName : '', [Validators.required]],
			belongOrgId: (this.localItem && this.localItem.belongOrgId) ? this.localItem.belongOrgId : '-1',
			type: [this.localItem ? this.localItem.type : 'tu_trieu', [Validators.required]],
			level: [this.localItem ? this.localItem.type : 'linh_muc', [Validators.required]],
			phoneNumber: this.localItem ? this.localItem.phoneNumber : '',
			email: this.localItem ? this.localItem.email : '',
			status: status,
			// anniversarySaint: this.localItem ? this.localItem.anniversarySaint : '',
			// anniversary: anniversary
		})
	}

	// isChangedForm(valueForm: any) {
	// 	if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
	// 		return true;
	// 	}
	// 	let status = this.dialogData.item.deActive == 0 ? true : false;
	// 	if (this.sharedService.isChangedValue(valueForm.status, status)) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	closeDialog() {
		this.dialogRef.close(null)
	}

	deleteItem() {
		this.dataProcessing = true;
		this.service.deleteDiocese(this.ID).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.dialogRef.close('Deleted');
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			deActive: valueForm.status ? 0 : 1
		}
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateDiocese(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createDiocese(dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
	}

}
