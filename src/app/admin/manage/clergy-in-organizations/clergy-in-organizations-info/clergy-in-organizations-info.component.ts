import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { TYPE_CLERGY } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-clergy-in-organizations-info',
	templateUrl: './clergy-in-organizations-info.component.html',
	styleUrls: ['./clergy-in-organizations-info.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppCustomDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: CUSTOM_DATE_FORMATS
		}
	]
})
export class ClergyInOrganizationsInfoComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public localItem: any;
	public title: string = "Thêm";
	public entityID: string = "";
	public clergyID: string = "";
	public entityType: string = "";

	public clergysList: any[] = [];
	public organizationList: any[] = [];
	public positionList: any[] = [];
	public typeList: any[] = TYPE_CLERGY;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<ClergyInOrganizationsInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		if (this.dialogData.item) {
			this.title = "Sửa";
			this.localItem = this.dialogData.item;
		}
		if (this.dialogData.entityID) {
			this.entityID = this.dialogData.entityID;
		}
		if (this.dialogData.clergyID) {
			this.clergyID = this.dialogData.clergyID;
		}
		if (this.dialogData.entityType) {
			this.entityType = this.dialogData.entityType;
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		this.getOrganizations();
		this.getClergies();
		this.getPositions();
	}

	initialEventGroup(item: any) {
		let fromDate = '';
		let toDate = '';
		if (item && item.fromDate) {
			item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
			fromDate = item._fromDate;
		}
		if (item && item.toDate) {
			item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
			toDate = item._toDate;
		}
		return this.fb.group({
			id: item ? item.id : '',
			clergyName: item ? item.clergyName : "",
			clergyID: item ? item.clergyID : this.clergyID,
			entityID: item ? item.entityID : this.entityID,
			entityName: item ? item.entityName : "",
			appointerID: item ? item.appointerID : "",
			appointerName: item ? item.appointerName : "",
			entityType: item ? item.entityType : 'organization',
			position: item ? item.position : 'chanh_xu',
			status: item ? item.status : 'duong_nhiem',
			fromDate: fromDate,
			toDate: toDate,
		});
	}

	valueChangeAutocomplete(event: any, target: string) {
		if (target == 'clergyName') {
			this.dataItemGroup.get('clergyID').setValue(event);
		}
		else if(target == 'entityName'){
			this.dataItemGroup.get('entityID').setValue(event);
		}
		else if(target == 'appointerName'){
			this.dataItemGroup.get('appointerID').setValue(event);
		}
	}

	getOrganizations() {
		this.organizationList = [];
		let options = {
			select: 'id,name,type'
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
					for (let item of items) {
						this.updateNameOfTypeOrg(item);
					}
				}
				this.organizationList = items;
				if (this.isNullOrEmpty(this.dialogData.item) && this.entityType == "organization") {
					let org  = this.sharedService.getItemExistsInArray(this.entityID,this.organizationList);
					if(org){
						this.dataItemGroup.get('entityName').setValue(org.name);
					}
				}
			}
		})
	}

	updateNameOfTypeOrg(item: any) {
		switch (item.type) {
			case 'dong_tu':
				item.name = `Dòng ${item.name}`;
				break;
			case 'giao_xu':
				item.name = `Giáo Xứ ${item.name}`;
				break;
		}
	}


	getClergies() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.clergysList = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.getClergyType(item)} ${item.stName} ${item.name}`;
					}
				}
				this.clergysList = items;
				if (this.isNullOrEmpty(this.dialogData.item)) {
					let clergy  = this.sharedService.getItemExistsInArray(this.clergyID,this.organizationList);
					if(clergy){
						this.dataItemGroup.get('clergyName').setValue(clergy.name);
					}
				}
			}
		})
	}

	getPositions() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.positionList = [];
		this.service.getPositions().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
			}
		})
	}


	getClergyType(item: any) {
		if (!this.isNullOrEmpty(item.type)) {
			let type = this.sharedService.getValueAutocomplete(item.type, this.typeList, 'code');
			if (type && type.name) {
				return type.name;
			}
		}
		return "";
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		let daaJSON = {
			clergyName: valueForm.clergyName,
			clergyID: valueForm.clergyID,
			entityID: valueForm.entityID,
			entityName: valueForm.entityName,
			appointerID: valueForm.appointerID,
			appointerName: valueForm.appointerName,
			entityType: valueForm.entityType,
			fromDate: this.sharedService.ISOStartDay(valueForm.fromDate),
			toDate: this.sharedService.ISOStartDay(valueForm.toDate),
			position: valueForm.position,
			// content: null,
			status: valueForm.status,
		}
		if (this.localItem && this.localItem.id) {
			this.dataProcessing = true;
			this.service.updateClergyInOrganization(this.localItem.id, daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createClergyInOrganization(daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
	}



}
