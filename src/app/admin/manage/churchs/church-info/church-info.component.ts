import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-church-info',
	templateUrl: './church-info.component.html',
	styleUrls: ['./church-info.component.scss']
})
export class ChurchInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';
	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ChurchInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		let name = '';
		let status = true;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			name = this.dialogData.item.name;
			this.ID = this.dialogData.item.id;
			status = this.dialogData.item.status == 1 ? true : false;
		}
		this.dataItemGroup = this.fb.group({
			name: [name, [Validators.required]],
			status: status
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			if (this.target === 'edit') {
				this.hasChangedGroup = this.isChangedForm(valueForm);
			}
			else {
				this.hasChangedGroup = true;
			}
		})
	}

	isChangedForm(valueForm: any) {
		if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.name, this.dialogData.item.name)) {
			return true;
		}
		return false;
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	deleteItem() {

	}

	onSaveItem() {

	}

}
