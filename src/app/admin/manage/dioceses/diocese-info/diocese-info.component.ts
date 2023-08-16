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
	public type: string = 'dioceses';
	public titleName: string = 'Giáo phận';
	public localItem: any;
	public arrGroups: any[] = [];


	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<DioceseInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.dialogData.type) {
			this.type = this.dialogData.type;
		}
		if (this.type == 'dioceses') {
			this.type = "dioceses";
			this.getDioceses();
		}
		else if (this.type == 'ecclesiastical-province') {
			this.titleName = "Giáo tỉnh";
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
			description: this.localItem ? this.localItem.description : "",
			content: this.localItem ? this.localItem.content : "",
			level: this.localItem ? this.localItem.level : (this.type == 'ecclesiastical-province' ? "ecclesiastical-province" : "giao_phan"),
			website: this.localItem ? this.localItem.website : '',
			group: this.localItem ? this.localItem.group : '',
			status: this.localItem && this.localItem.status == 'inactive' ? false : true
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			this.hasChangedGroup = true;
		})
	}

	getDioceses() {
		let options = {
			sort: 'name asc',
			filter: "type eq 'ecclesiastical-province' and status ne 'inactive'"
		}
		this.service.getDioceses(options).pipe(take(1)).subscribe((res: any) => {
			if (res && res.value && res.value.length > 0) {
				let items = res.value;
				for (let item of items) {
					item.name = `${this.sharedService.updateLevelDioceses(item.level)} ${item.name}`;
				}
				this.arrGroups = items;
			}

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
		let dataJSON: any = {
			name: valueForm.name,
			description: valueForm.description,
			content: valueForm.content,
			status: valueForm.status ? 'active' : 'inactive',
			// type: 'dioceses',
			website: valueForm.website,
			group: valueForm.group,
			level: valueForm.level,
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
			dataJSON.type = this.type;
			this.service.createDiocese(dataJSON).pipe(take(1)).subscribe(() => {
				this.dataProcessing = false;
				this.dialogRef.close('OK');
			})
		}
	}

}
