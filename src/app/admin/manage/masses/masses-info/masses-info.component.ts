import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-masses-info',
	templateUrl: './masses-info.component.html',
	styleUrls: ['./masses-info.component.scss']
})
export class MassesInfoComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public localItem: any;
	public title: string = "Giờ Lễ";
	public entityID: string = "";
	public entityType: string = ""

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<MassesInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		if (this.dialogData.item) {
			this.title = "Sửa Giờ Lễ";
			this.localItem = this.dialogData.item;
		}
		if (this.dialogData.entityID) {
			this.entityID = this.dialogData.entityID;
		}
		if (this.dialogData.entityType) {
			this.entityType = this.dialogData.entityType;
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		// if (this.dialogData.type == 'new') {
			this.dataItemGroup.get('code').valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((code: any) => {
				this.dataItemGroup.get('name').setValue(this.getNameFromCode(code));
			})
		// }
	}

	getNameFromCode(key: string) {
		switch (key) {
			case 'ngay_thuong':
				return 'Ngày Thường'
			case 'chua_nhat':
				return 'Chúa Nhật'
			case 'chieu_thu_bay':
				return 'Chiều Thứ 7'
			default:
				return '';
		}
	}

	initialEventGroup(item: any): FormGroup {
		return this.fb.group({
			name: item ? item.name : "Chúa Nhật",
			code: item ? item.code : "chua_nhat",
			session: item ? item.session : "sang",
			time: item ? item.time : "",
			status: item ? (item.status == 'active') : true,
		})
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let daaJSON = {
			"name": valueForm.name,
			"code": valueForm.code,
			"entityId": this.entityID,
			"entityType": this.entityType,
			"session": valueForm.session,
			"time": valueForm.time,
			"status": valueForm.status ? 'active' : 'inactive',
		}
		if (this.localItem && this.localItem.id) {
			this.dataProcessing = true;
			this.service.updateMasses(this.localItem.id, daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createMasses(daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
	}



}
