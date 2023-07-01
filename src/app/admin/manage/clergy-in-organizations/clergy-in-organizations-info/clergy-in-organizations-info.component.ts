import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs';
import { POSSITION, TYPE_CLERGY } from 'src/app/shared/data-manage';
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
	public title: string = "Tu Sĩ";
	public entityID: string = "";
	public entityType: string = "";

	public clergysList: any[] = [];
	public positionList: any[] = POSSITION;
	public typeList: any[] = TYPE_CLERGY;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<ClergyInOrganizationsInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		if (this.dialogData.item) {
			this.title = "Sửa Tu Sĩ";
			this.localItem = this.dialogData.item;
		}
		if (this.dialogData.entityID) {
			this.entityID = this.dialogData.entityID;
		}
		if (this.dialogData.entityType) {
			this.entityType = this.dialogData.entityType;
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		this.getClergies();
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
			id: item ? item._id : '',
			name: item ? item.name : '',
			clergyID: item ? item.clergyID : '',
			position: item ? item.position : 'chanh_xu',
			status: item ? item.status : 'duong_nhiem',
			fromDate: fromDate,
			toDate: toDate,
		});
	}

	valueChangeAutocomplete(event: any, target: string) {
		if (target == 'clergyID') {
			if (!this.isNullOrEmpty(event)) {
				let clergy = this.sharedService.getValueAutocomplete(event, this.clergysList);
				if (clergy && clergy.name) {
					this.dataItemGroup.get('name').setValue(clergy.name);
				}
			}
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
					for(let item of items){
						item.name = `${this.getClergyType(item)} ${item.stName} ${item.name}`;
					}
				}
				this.clergysList = items;
			}
		})
	}

	
	getClergyType(item: any){
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
			name: valueForm.name,
			clergyID: valueForm.clergyID,
			entityID: this.entityID,
			entityType: this.entityType,
			date: this.sharedService.ISOStartDay(valueForm.fromDate),
			// position: valueForm.position,
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
