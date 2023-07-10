import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-group-info',
	templateUrl: './group-info.component.html',
	styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent extends SimpleBaseComponent {

	public title: string = 'Thêm';
	public textSave: string = 'Thêm';
	public dataItemGroup: FormGroup;
	public hasChangedGroup: boolean = false;
	public target: string = "";
	public canDelete: boolean = false;
	public saveAction: string = '';

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<GroupInfoComponent>,
		private service: SharedService,
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
			status = this.dialogData.item.status == 'active' ? true : false;
		}
		this.dataItemGroup = this.fb.group({
			name: [name, [Validators.required]],
			description: this.dialogData.item ? this.dialogData.item.description : "",
			content: this.dialogData.item ? this.dialogData.item.content : "",
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
		let status = this.dialogData.item.status == 'active' ? true : false;
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
		this.service.deleteGroup(this.ID).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				this.dialogRef.close('Deleted');
			}
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			description: valueForm.description,
			content: valueForm.content,
			status: valueForm.status ? 'active' : 'inactive'
		}
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateGroup(this.ID, dataJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.dialogRef.close('OK');
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createGroup(dataJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dataProcessing = false;
					this.dialogRef.close('OK');
				}
			})
		}
	}

}
