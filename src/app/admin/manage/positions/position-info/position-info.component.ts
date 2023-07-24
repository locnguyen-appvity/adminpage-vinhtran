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
		this.dataItemGroup = this.initialEventGroup(this.localItem);

		let level = ["giao_phan"]
		if (this.localItem && this.localItem.level){
			level = this.localItem.level.split(",");
			this.localItem._level = level;
		}
		this.dataItemGroup.get('level').setValue(level);
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

	initialEventGroup(item: any): FormGroup {
		
		return this.fb.group({
			name: [item ? item.name : "", [Validators.required]],
			code: item ? item.code : "",
			slot: item ? item.slot : 1,
			level: [],
			status: item && item.status == 'inactive' ? false : true,
		})
	}

	isChangedForm(valueForm: any) {
		if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.code, this.dialogData.item.code)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.slot, this.dialogData.item.slot)) {
			return true;
		}
		let status = this.dialogData.item.status == 'inactive' ? false : true;
		if (this.sharedService.isChangedValue(valueForm.status, status)) {
			return true;
		}
		let level = valueForm.level ? valueForm.level.join(",") : "";
		if (this.sharedService.isChangedValue(this.dialogData.item.level, level)) {
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
			level: valueForm.level ? valueForm.level.join(",") : "",
			slot: valueForm.slot,
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
