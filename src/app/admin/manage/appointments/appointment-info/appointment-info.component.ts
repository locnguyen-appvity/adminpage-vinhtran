import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, forkJoin, take } from 'rxjs';
import { STATUS_CLERGY, TYPE_CLERGY } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-appointment-info',
	templateUrl: './appointment-info.component.html',
	styleUrls: ['./appointment-info.component.scss'],
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
export class AppointmentsInfoComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public localItem: any;
	public title: string = "Thêm";
	public entityID: string = "";
	public entityName: string = "";
	public clergyID: string = "";
	public clergyName: string = "";
	public entityType: string = "";

	public clergysList: any[] = [];
	public entityList: any[] = [];
	public appointmentsList: any[] = [];
	public positionList: any[] = [];
	public positionListCache: any[] = [];
	public typeList: any[] = TYPE_CLERGY;
	public statusClergy: any[] = STATUS_CLERGY;
	public searchValue: string = '';

	public target: string = 'bo_nhiem';

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialogRef: MatDialogRef<AppointmentsInfoComponent>,
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
		if (this.dialogData.entityName) {
			this.entityName = this.dialogData.entityName;
		}
		if (this.dialogData.clergyName) {
			this.clergyName = this.dialogData.clergyName;
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		// this.getEntityList();
		this.getClergies();
		this.getPositions();
	}

	getAppointments(clergyID: string) {
		this.appointmentsList = [];
		if (!this.isNullOrEmpty(clergyID)) {
			let options = {
				filter: `clergyID eq ${clergyID}`
			}
			this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
				let dataItems = [];
				if (res && res.value && res.value.length > 0) {
					dataItems = res.value;
				}
				this.appointmentsList = dataItems
			})
		}
	}

	selectedTabChange(event: MatTabChangeEvent) {
		if (event.index == 1) {
			this.target = 'thuyen_chuyen';
		}
		else {
			this.target = 'bo_nhiem';
		}
	}

	initialEventGroup(item: any) {
		let fromDate = '';
		let toDate = '';
		let effectiveDate = '';
		if (item && item.fromDate) {
			item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
			fromDate = item._fromDate;
		}
		if (item && item.toDate) {
			item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
			toDate = item._toDate;
		}
		if (item && item.effectiveDate) {
			item._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(item.effectiveDate);
			effectiveDate = item._effectiveDate;
		}
		return this.fb.group({
			id: item ? item.id : '',
			clergyName: item ? item.clergyName : this.clergyName,
			clergyID: item ? item.clergyID : this.clergyID,
			entityID: item ? item.entityID : this.entityID,
			entityName: item ? item.entityName : this.entityName,
			appointerID: item ? item.appointerID : "",
			appointerName: item ? item.appointerName : "",
			entityType: item ? item.entityType : this.entityType,
			position: item ? item.position : 'chanh_xu',
			status: item ? item.status : 'duong_nhiem',
			fromDate: fromDate,
			effectiveDate: effectiveDate,
			toDate: toDate,
			fromEntityID: "",
			fromEntityName: "",
			fromAppointerID: "",
			fromAppointerName: "",
			fromEntityType: "",
			fromPosition: "",
			fromStatus: "",
			fromFromDate: "",
			fromEffectiveDate: "",
			fromToDate: "",
			fromAppointmentID: "",
		});
	}

	valueChangeAutocomplete(event: any, target: string) {
		if (target == 'clergyName') {
			this.dataItemGroup.get('clergyID').setValue(event);
			this.getAppointments(event);
		}
		else if (target == 'entityName') {
			if (event && event.id) {
				this.dataItemGroup.get('entityID').setValue(event.id);
				this.dataItemGroup.get('entityType').setValue(event.type);
				this.handlePositionList(event.type)
			}
			else {
				this.dataItemGroup.get('entityID').setValue("");
				this.dataItemGroup.get('entityType').setValue("");
				this.handlePositionList("")
			}
		}
		else if (target == 'appointerName') {
			this.dataItemGroup.get('appointerID').setValue(event);
		}
		else if (target == 'fromAppointmentID') {
			if (event) {
				let fromDate = '';
				let toDate = '';
				let effectiveDate = '';
				if (event && event.fromDate) {
					event._fromDate = this.sharedService.convertDateStringToMomentUTC_0(event.fromDate);
					fromDate = event._fromDate;
				}
				if (event && event.toDate) {
					event._toDate = this.sharedService.convertDateStringToMomentUTC_0(event.toDate);
					toDate = event._toDate;
				}
				if (event && event.effectiveDate) {
					event._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(event.effectiveDate);
					effectiveDate = event._effectiveDate;
				}
				this.dataItemGroup.patchValue({
					fromEntityID: event.entityID,
					fromEntityName: event.entityName,
					fromAppointerID: event.appointerID,
					fromAppointerName: event.appointerName,
					fromEntityType: event.entityType,
					fromPosition: event.position,
					fromStatus: event.status,
					fromFromDate: fromDate,
					fromEffectiveDate: effectiveDate,
					fromToDate: toDate,
					fromAppointmentID: event.id,
				})
			}
			else {
				this.dataItemGroup.patchValue({
					fromEntityID: "",
					fromEntityName: "",
					fromAppointerID: "",
					fromAppointerName: "",
					fromEntityType: "",
					fromPosition: "",
					fromStatus: "",
					fromFromDate: "",
					fromEffectiveDate: "",
					fromToDate: "",
					fromAppointmentID: "",
				})
			}
		}
	}

	handlePositionList(entityType: string) {
		switch (entityType) {
			case 'organization':
				this.positionList = this.positionListCache.filter(it => (it.level == 'giao_phan' || it.level == 'giao_xu' || it.level == 'dong_tu' || it.level == 'khac'));
				break;
			case 'group':
				this.positionList = this.positionListCache.filter(it => it.level == 'giao_hat');
				break;
			default:
				this.positionList = this.positionListCache;
				break;
		}
	}

	onValueChanges(event: any, target: string) {
		if (target == 'entityName') {
			this.searchValue = event;
			this.getEntityList();
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	getEntityList() {
		forkJoin({ organization: this.getOrganizations(), group: this.getGroups() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.organization && res.organization.length > 0) {
					items.push(...res.organization);
				}
				if (res && res.group && res.group.length > 0) {
					items.push(...res.group);
				}
				this.entityList = items;
			}
		})
	}

	getOrganizations() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: this.getFilter(),
				skip: 0,
				top: 5
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item.type = 'organization';
							item.groupName = 'Giáo Xứ - Dòng Tu';
							this.updateNameOfTypeOrg(item);
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				select: 'id,name',
				filter: this.getFilter(),
				skip: 0,
				top: 5
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item.type = 'group';
							item.name = `Giáo Hạt ${item.name}`;
							item.groupName = 'Giáo Hạt';
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
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
					let clergy = this.sharedService.getItemExistsInArray(this.clergyID, this.clergysList);
					if (clergy) {
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
		this.positionListCache = [];
		this.service.getPositions().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionListCache = items;
				if (this.localItem && this.localItem.entityType) {
					this.handlePositionList(this.localItem.entityType);
				}
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
			effectiveDate: this.sharedService.ISOStartDay(valueForm.effectiveDate),
			position: valueForm.position,
			// content: null,
			status: valueForm.status,
		}
		if (this.localItem && this.localItem.id) {
			this.dataProcessing = true;
			this.service.updateAppointment(this.localItem.id, daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
		else {
			this.dataProcessing = true;
			this.service.createAppointment(daaJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
	}



}
