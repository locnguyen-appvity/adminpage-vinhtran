import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, forkJoin, take } from 'rxjs';
import { STATUS_CLERGY, LEVEL_CLERGY } from 'src/app/shared/data-manage';
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
	public levelList: any[] = LEVEL_CLERGY;
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
		this.handlePositionList(item ? item.entityType : '');
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
			fromAppointmentID: ""
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
				this.handlePositionList(event.type);
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
		else if (target == 'fromEntityName') {
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
					fromStatus: 'man_nhiem',
					fromFromDate: fromDate,
					fromEffectiveDate: effectiveDate,
					fromToDate: toDate,
					fromAppointmentID: event.id
				})
				this.dataItemGroup.get('fromPosition').disable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromStatus').disable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromEffectiveDate').disable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromFromDate').disable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromAppointerName').disable({
					onlySelf: true
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
				this.dataItemGroup.get('fromPosition').enable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromStatus').enable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromEffectiveDate').enable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromFromDate').enable({
					onlySelf: true
				})
				this.dataItemGroup.get('fromAppointerName').enable({
					onlySelf: true
				})
			}
		}
	}

	handlePositionList(entityType: string) {
		switch (entityType) {
			case 'giao_xu':
			case 'giao_diem':
				this.positionList = this.positionListCache.filter(it => (it.level == 'giao_phan' || it.level == 'giao_xu' || it.level == 'dong_tu' || it.level == 'khac'));
				break;
			case 'co_so_giao_phan':
			case 'ban_muc_vu':
			case 'ban_chuyen_tranh':
				this.positionList = this.positionListCache.filter(it => (it.level == 'giao_phan' || it.level == 'khac'));
				break;
			case 'giao_hat':
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
			this.dataItemGroup.get('entityName').setValue(event);
			this.getEntityList();
			this.handlePositionList('');
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
							// item._type = 'organization';
							item.groupName = 'Giáo Xứ - Dòng Tu';
							item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`;
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
				select: 'id,name,type',
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
							// item._type = 'group';
							item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`;
							item.groupName = 'Giáo Hạt';
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
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
				this.handlePositionList(this.localItem ? this.localItem.entityType : '');
				if (this.localItem && this.localItem.entityType) {
					this.handlePositionList(this.localItem.entityType);
				}
			}
		})
	}


	getClergyType(item: any) {
		if (!this.isNullOrEmpty(item.level)) {
			let level = this.sharedService.getValueAutocomplete(item.level, this.levelList, 'code');
			if (level && level.name) {
				return level.name;
			}
		}
		return "";
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		if (this.target == 'thuyen_chuyen') {
			if (this.isNullOrEmpty(this.dataItemGroup.get("fromAppointmentID").value)) {
				let fromAppointmentJSON = {
					clergyName: valueForm.clergyName,
					clergyID: valueForm.clergyID,
					entityID: valueForm.entityID,
					entityName: valueForm.fromEntityName,
					appointerID: valueForm.fromAppointerID,
					appointerName: valueForm.fromAppointerName,
					entityType: valueForm.fromEntityType,
					fromDate: this.sharedService.ISOStartDay(valueForm.fromFromDate),
					toDate: this.sharedService.ISOStartDay(valueForm.fromToDate),
					effectiveDate: this.sharedService.ISOStartDay(valueForm.fromEffectiveDate),
					position: valueForm.fromPosition,
					fromAppointmentID: "",
					status: valueForm.fromStatus,
				}
				this.service.createAppointment(fromAppointmentJSON).pipe(take(1)).subscribe({
					next: (res: any) => {
						console.log('createAppointment........', res);
						this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value).pipe(take(1)).subscribe({
							next: () => {
								this.dialogRef.close("OK");
							}
						})
					}
				})
			}
			else {
				let fromAppointmentJSON = {
					toDate: this.sharedService.ISOStartDay(this.dataItemGroup.get("fromToDate").value),
					status: this.dataItemGroup.get("fromStatus").value
				}
				forkJoin([
					this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value),
					this.service.updateAppointment(this.localItem.id, fromAppointmentJSON)]).pipe(take(1)).subscribe({
						next: () => {
							this.dialogRef.close("OK");
						}
					})
			}
		}
		else {
			this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}

	}

	onSaveAppointment(fromAppointmentID: string) {
		return new Observable(obs => {
			let valueForm = this.dataItemGroup.value;
			let appointmentJSON = {
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
				fromAppointmentID: fromAppointmentID,
				status: valueForm.status,
			}
			if (this.localItem && this.localItem.id) {
				this.service.updateAppointment(this.localItem.id, appointmentJSON).pipe(take(1)).subscribe({
					next: () => {
						obs.next();
						obs.complete();
					}
				})
			}
			else {
				this.service.createAppointment(appointmentJSON).pipe(take(1)).subscribe({
					next: () => {
						obs.next();
						obs.complete();
					}
				})
			}
		})
	}

}
