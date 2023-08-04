import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, forkJoin, of, take, takeUntil } from 'rxjs';
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
	public typeGroup: string = "giao_hat";
	public canDelete: boolean = false;
	public saveAction: string = '';
	public localItem: any;
	public entityList: any[] = [];
	public orgTypeName: string = "Giáo hạt";

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<GroupInfoComponent>,
		private service: SharedService,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		this.target = this.dialogData.target;
		if (this.dialogData.typeGroup) {
			this.typeGroup = this.dialogData.typeGroup;
		}
		// if (this.target !== 'edit') {
		// 	if (this.typeGroup == 'hoi_doan') {
		// 		this.title = 'Thêm Hội Đoàn';
		// 	}
		// 	else if (this.typeGroup == 'co_so_giao_phan') {
		// 		this.title = 'Thêm Cơ Sở Giáo Phận';
		// 	}
		// 	else if (this.typeGroup == 'ban_muc_vu') {
		// 		this.title = 'Thêm Ban Mục Vụ';
		// 	}
		// 	else if (this.typeGroup == 'ban_chuyen_mon') {
		// 		this.title = 'Thêm Ban Chuyên Trách';
		// 	}
		// 	else if (this.typeGroup == 'dong_tu') {
		// 		this.title = 'Thêm Dòng Tu';
		// 	}
		// }
		if (this.target === 'edit') {
			this.title = "Sửa";
			this.textSave = 'Lưu';
			this.canDelete = false;
			this.ID = this.dialogData.item.id;
			this.localItem = this.dialogData.item;
			this.title = this.localItem.name;
		}

		this.orgTypeName = this.sharedService.updateTypeOrg(this.typeGroup);
		this.dataItemGroup = this.fb.group({
			name: [this.localItem ? this.localItem.name : "", [Validators.required]],
			description: this.localItem ? this.localItem.description : "",
			content: this.localItem ? this.localItem.content : "",
			entityID: this.localItem ? this.localItem.entityID : '',
			_entityID: this.localItem ? this.localItem.entityID : '',
			entityType: this.localItem ? this.localItem.entityType : '',
			status: this.localItem && this.localItem.status == 'inactive' ? false : true
		})
		this.dataItemGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			if (this.target === 'edit') {
				this.hasChangedGroup = this.isChangedForm(valueForm);
			}
			else {
				this.hasChangedGroup = true;
			}
		})
		if (this.typeGroup != 'giao_hat') {
			this.getEntityList();
		}
	}


	onSelectItem(event: any, target: string) {
		if (target == "entityID") {
			this.dataItemGroup.get("entityType").setValue(event ? event._type : "");
			this.dataItemGroup.get("entityID").setValue(event ? event.id : "");
		}
	}

	getEntityList() {
		let requests: any = {
			// groups: this.getGroups()
		}
		if (this.target == 'co_so_ngoai_giao_phan') {
			requests.dioceses = this.getDioceses()
		}
		else {
			requests.groups = this.getGroups();
		}
		forkJoin(requests).pipe(take(1)).subscribe({
			next: (res: any) => {
				let entityList = [];
				if (res && res.groups && res.groups.length > 0) {
					entityList.push(...res.groups);
				}
				if (res && res.dioceses && res.dioceses.length > 0) {
					entityList.push(...res.dioceses);
				}
				this.entityList = entityList;
			}
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: "type eq 'giao_hat'"
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._type = "group";
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`
							item.groupName = this.sharedService.updateNameTypeOrg(item.type);
						}
						items = res.value;
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getDioceses() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: "status ne 'inactive'"
			}
			this.service.getDioceses(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._type = "dioceses";
							item.name = `${this.sharedService.updateNameTypeOrg(item._type)} ${item.name}`;
							item.groupName = this.sharedService.updateNameTypeOrg('dioceses');
						}
						items = res.value;
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	isChangedForm(valueForm: any) {
		if (this.sharedService.isChangedValue(valueForm.name, this.localItem.name)) {
			return true;
		}
		let status = this.localItem.status == 'active' ? true : false;
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
			status: valueForm.status ? 'active' : 'inactive',
			type: this.typeGroup,
			entityID: valueForm.entityID,
			entityType: valueForm.entityType,
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
