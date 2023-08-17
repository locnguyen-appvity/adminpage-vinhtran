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
	public localItem: any;
	public type: string = "thanh";

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<SaintInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.dialogData.type) {
			this.type = this.dialogData.type;
		}
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
			abbreviation: this.localItem ? this.localItem.abbreviation : "",
			subtitle: this.localItem ? this.localItem.subtitle : "",
			description: this.localItem ? this.localItem.description : "",
			content: this.localItem ? this.localItem.content : "",
			anniversary: this.localItem ? this.localItem.anniversary : "",
			// type: this.localItem ? this.localItem.type : ""
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			this.hasChangedGroup = true;
		})
		this.dataItemGroup.get('name').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((name: string) => {
			this.dataItemGroup.get('code').setValue(this.sharedService.getLinkOfName(name));
		})
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
			abbreviation: valueForm.abbreviation,
			subtitle: valueForm.subtitle,
			anniversary: valueForm.anniversary,
			description: valueForm.description,
			type: this.type,
			content: valueForm.content,
			status: valueForm.status ? 'active' : 'inactive'
		}
		this.saveAction = 'save';
		if (!this.isNullOrEmpty(this.ID)) {
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