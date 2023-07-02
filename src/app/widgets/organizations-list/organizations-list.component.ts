import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-organizations-list',
	templateUrl: './organizations-list.component.html',
	styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent extends SimpleBaseComponent {

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
		public dialogRef: MatDialogRef<OrganizationsListComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			this.localItem = this.dialogData.item;
			this.ID = this.dialogData.item.id;
		}
		this.dataItemGroup = this.fb.group({
			name: [this.localItem ? this.localItem.name : "", [Validators.required]],
			status: (this.localItem && this.localItem.status == 'inactive') ? false : true,
			code: this.localItem ? this.localItem.code : "",
			description: this.localItem ? this.localItem.description : "",
			content: this.localItem ? this.localItem.content : "",
			anniversary: this.localItem ? this.localItem.anniversary : ""
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
		if (this.sharedService.isChangedValue(valueForm.anniversary, this.dialogData.anniversary)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.description, this.dialogData.description)) {
			return true;
		}
		if (this.sharedService.isChangedValue(valueForm.content, this.dialogData.content)) {
			return true;
		}
		let status = this.dialogData.item.status == 'inactive' ? false : true;
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
		this.service.deleteSaint(this.ID).pipe(take(1)).subscribe(() => {
			this.dataProcessing = false;
			this.dialogRef.close('Deleted');
		})
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			code: valueForm.code,
			anniversary: valueForm.anniversary,
			description: valueForm.description,
			content: valueForm.content,
			status: valueForm.status ? 'active' : 'inactive'
		}
		this.saveAction = 'save';
		if (this.target == 'edit') {
			this.dataProcessing = true;
			this.service.updateSaint(this.ID, dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.saveAction = '';
				this.dialogRef.close('OK');
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createSaint(dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.saveAction = '';
				this.dialogRef.close('OK');
			})
		}
	}

}