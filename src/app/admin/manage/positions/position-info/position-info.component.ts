import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { LEVEL_POSITION } from 'src/app/shared/data-manage';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-position-info',
	templateUrl: './position-info.component.html',
	styleUrls: ['./position-info.component.scss']
})
export class PositionInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';
	public localItem: any;
	public levelPositions = LEVEL_POSITION;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<PositionInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			this.localItem = this.dialogData.item;
			this.ID = this.localItem.id;
		}
		this.dataItemGroup = this.fb.group({
			name: [this.localItem ? this.localItem.name : "", [Validators.required]],
			code: this.localItem ? this.localItem.code : "",
			level: this.localItem ? this.localItem.level : "giao_phan",
			status: this.localItem && this.localItem.status == 'inactive' ? false : true,
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			if (this.target === 'edit') {
				this.hasChangedGroup = this.isChangedForm(valueForm);
			}
			else {
				this.hasChangedGroup = true;
			}
		})
		this.dataItemGroup.get('name').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: any) => {
			this.dataItemGroup.get('code').setValue(this.sharedService.getLinkOfName(name, '_'));
		})
	}

	isChangedForm(valueForm: any) {
		if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.code, this.dialogData.item.code)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.level, this.dialogData.item.level)) {
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
		this.service.deletePosition(this.ID).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.dialogRef.close('Deleted');
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			code: valueForm.code,
			status: valueForm.status ? 'active' : 'inactive'
		}
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updatePosition(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createPosition(dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
	}

}
