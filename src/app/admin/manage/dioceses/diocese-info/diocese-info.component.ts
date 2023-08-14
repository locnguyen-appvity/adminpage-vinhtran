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
			description: this.localItem ? this.localItem.description : "",
			content: this.localItem ? this.localItem.content : "",
			website: this.localItem ? this.localItem.website : '',
			status: this.localItem && this.localItem.status == 'inactive' ? false : true
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			this.hasChangedGroup = true;
		})
	}


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
			description: valueForm.description,
			content: valueForm.content,
			status: valueForm.status ? 'active' : 'inactive',
			type: 'dioceses',
			website: valueForm.website,
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
