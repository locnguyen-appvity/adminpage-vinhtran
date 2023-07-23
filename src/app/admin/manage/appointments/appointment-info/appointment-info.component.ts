import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { DialogConfirmComponent } from 'src/app/controls/confirm';
import { STATUS_CLERGY } from 'src/app/shared/data-manage';
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
	public mode: string = 'new';
	public localItem: any;
	public title: string = "Thêm";
	public entityID: string = "";
	public entityName: string = "";
	public clergyID: string = "";
	public clergyName: string = "";
	public entityType: string = "";

	public clergysList: any[] = [];
	public appointerList: any[] = [];
	public entityList: any[] = [];
	public entityListFrom: any[] = [];
	public appointmentsList: any[] = [];
	public positionList: any[] = [];
	public positionFromList: any[] = [];
	public positionListCache: any[] = [];
	public statusClergy: any[] = STATUS_CLERGY;
	public searchValue: string = '';

	public target: string = 'bo_nhiem';
	public action: string = '';
	private fromAppointmentItem: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<AppointmentsInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);
		if (this.dialogData.action) {
			this.action = this.dialogData.action;
		}
		if (this.dialogData.item) {
			this.title = "Sửa";
			if (this.action == 'thuyen_chuyen') {
				this.fromAppointmentItem = this.dialogData.item;
				this.target = 'chon_thuyen_chuyen';
			}
			else {
				this.localItem = this.dialogData.item;
				this.mode = 'edit';
				this.title = `Sửa Bổ Nhiệm Của ${this.localItem.clergyName}`;
			}
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
		if (!this.isNullOrEmpty(this.clergyID)) {
			this.dataItemGroup.get('clergyName').setValue(this.clergyName);
			this.getAppointments(this.clergyID);
			// this.dataItemGroup.get('clergyName').disable({
			// 	onlySelf: true
			// })
		}
		if (this.localItem && this.localItem.status == 'man_nhiem') {
			this.dataItemGroup.get('status').disable({
				onlySelf: true
			})
		}
		if (this.localItem && this.action == 'ket_thuc') {
			this.dataItemGroup.get('status').setValue('man_nhiem');
		}
		this.getEntityList('entityName');
		this.getEntityList('fromEntityName');
		this.getClergies();
		this.getPositions();
	}

	getAppointments(clergyID: string) {
		this.appointmentsList = [];
		if (!this.isNullOrEmpty(clergyID)) {
			let options = {
				filter: `clergyID eq ${clergyID} and status eq 'duong_nhiem'`
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
			fromAppointmentName: ""
		})
		if (event.index == 1) {
			this.target = 'chon_thuyen_chuyen';
		}
		else if (event.index == 2) {
			this.target = 'tao_moi_thuyen_chuyen';
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
		if (item && item.fromAppointmentID) {
			this.target = 'chon_thuyen_chuyen';
			this.getAppointment(item.fromAppointmentID);
		}
		this.handlePositionList(item ? item.entityType : '', 'entityName');
		this.handlePositionList(item ? item.entityType : '', 'fromEntityName');
		return this.fb.group({
			id: item ? item.id : '',
			clergyName: item ? item.clergyName : this.clergyName,
			clergyID: item ? item.clergyID : this.clergyID,
			entityID: item ? item.entityID : this.entityID,
			_entityID: item ? `${item.entityType}_${item.entityID}` : (this.entityID ? `${this.entityType}_${this.entityID}` : ''),
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
			_fromEntityID: "",
			fromEntityName: "",
			fromAppointerID: "",
			fromAppointerName: "",
			fromEntityType: "",
			fromPosition: "",
			fromStatus: "",
			fromFromDate: "",
			fromEffectiveDate: "",
			fromFromDateView: "",
			fromToDateView: "",
			fromPositionView: "",
			fromEffectiveDateView: "",
			fromToDate: "",
			fromAppointmentID: item ? item.fromAppointmentID : (this.fromAppointmentItem ? this.fromAppointmentItem.id : ""),
			fromAppointmentName: ""
		});
	}

	getAppointment(appointmentID: string) {
		this.service.getAppointment(appointmentID).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.fromAppointmentItem = res;
			}
		})
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
				this.dataItemGroup.get('entityName').setValue(event.name);
				this.handlePositionList(event.type, 'entityName');
			}
			else {
				this.dataItemGroup.get('entityID').setValue("");
				this.dataItemGroup.get('entityType').setValue("");
				this.dataItemGroup.get('entityName').setValue("");
				this.handlePositionList("", 'entityName')
			}
		}
		else if (target == 'fromEntityName') {
			if (event && event.id) {
				this.dataItemGroup.get('fromEntityID').setValue(event.id);
				this.dataItemGroup.get('fromEntityType').setValue(event.type);
				this.dataItemGroup.get('fromEntityName').setValue(event.name);
				this.handlePositionList(event.type, 'fromEntityName');
			}
			else {
				this.dataItemGroup.get('fromEntityID').setValue("");
				this.dataItemGroup.get('fromEntityType').setValue("");
				this.dataItemGroup.get('fromEntityName').setValue("");
				this.handlePositionList("", 'fromEntityName')
			}
		}
		// else if (target == 'appointerID') {
		// 	this.dataItemGroup.get('appointerName').setValue(event);
		// }
		else if (target == 'fromAppointmentName') {
			this.updateFromAppointment(event);
		}
	}
	onSelectItem(event: any, target: string) {
		if (target == 'appointerID') {
			this.dataItemGroup.get('appointerName').setValue(event ? event.name : "");
		}
		else if (target == 'fromAppointerID') {
			this.dataItemGroup.get('fromAppointerName').setValue(event ? event.name : "");
		}
	}

	updateFromAppointment(event: any) {
		if (event) {
			let fromDate = '';
			let toDate = '';
			let effectiveDate = '';
			let fromFromDateView = '';
			let fromToDateView = '';
			let fromEffectiveDateView = '';
			if (event && event.fromDate) {
				event._fromDate = this.sharedService.convertDateStringToMomentUTC_0(event.fromDate);
				fromDate = event._fromDate;
				fromFromDateView = this.sharedService.formatDate(event._fromDate);
			}
			if (event && event.toDate) {
				event._toDate = this.sharedService.convertDateStringToMomentUTC_0(event.toDate);
				toDate = event._toDate;
				fromToDateView = this.sharedService.formatDate(event._toDate);
			}
			if (event && event.effectiveDate) {
				event._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(event.effectiveDate);
				effectiveDate = event._effectiveDate;
				fromEffectiveDateView = this.sharedService.formatDate(event._effectiveDate);
			}
			this.dataItemGroup.patchValue({
				fromEntityID: event ? event.entityID : '',
				_fromEntityID: `${event.entityType}_${event.entityID}`,
				fromEntityName: event.entityName,
				fromAppointerID: event.appointerID,
				fromAppointerName: event.appointerName,
				fromEntityType: event.entityType,
				fromPosition: event.position,
				fromStatus: 'man_nhiem',
				fromFromDate: fromDate,
				fromEffectiveDate: effectiveDate,
				fromToDate: toDate,
				fromAppointmentID: event.id,
				fromAppointmentName: event.entityName,
				fromFromDateView: fromFromDateView,
				fromToDateView: fromToDateView,
				fromPositionView: this.sharedService.getNameExistsInArray(event.position, this.positionListCache, 'code'),
				fromEffectiveDateView: fromEffectiveDateView,
			})
			// this.dataItemGroup.get('fromPosition').disable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromStatus').disable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromEffectiveDate').disable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromFromDate').disable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromAppointerName').disable({
			// 	onlySelf: true
			// })
		}
		else {
			this.dataItemGroup.patchValue({
				fromEntityID: "",
				_fromEntityID: "",
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
				fromAppointmentName: "",
				fromFromDateView: "",
				fromPositionView: "",
				fromEffectiveDateView: "",
			})
			// this.dataItemGroup.get('fromPosition').enable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromStatus').enable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromEffectiveDate').enable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromFromDate').enable({
			// 	onlySelf: true
			// })
			// this.dataItemGroup.get('fromAppointerName').enable({
			// 	onlySelf: true
			// })
		}
	}

	getPosition(item: any) {
		item.positionView = 'Chưa xác định'
		if (!this.isNullOrEmpty(item.position)) {
			let position = this.sharedService.getValueAutocomplete(item.position, this.positionList, 'code');
			if (position && position.name) {
				item.positionView = position.name;
			}
		}
	}

	handlePositionList(entityType: string, target: string) {
		let positionList = this.positionListCache;
		switch (entityType) {
			case 'giao_xu':
			case 'giao_diem':
				positionList = this.positionListCache.filter(it => (it.level == 'giao_phan' || it.level == 'giao_xu' || it.level == 'dong_tu' || it.level == 'khac'));
				break;
			case 'co_so_giao_phan':
			case 'ban_muc_vu':
			case 'ban_chuyen_mon':
				positionList = this.positionListCache.filter(it => (it.level == 'giao_phan' || it.level == 'khac'));
				break;
			case 'giao_hat':
				positionList = this.positionListCache.filter(it => it.level == 'giao_hat');
				break;
			default:
				positionList = this.positionListCache;
				break;
		}
		if (target == "fromEntityName") {
			this.positionFromList = positionList;
		}
		else {
			this.positionList = positionList;
		}
	}

	onValueChanges(event: any, target: string) {
		if (this.searchValue != event) {
			if (target == 'entityName') {
				// this.searchValue = event;
				// this.dataItemGroup.get('entityName').setValue(event);
				// this.getEntityList(target);
				this.handlePositionList('', 'entityName');
			}
			else if (target == 'fromEntityName') {
				// this.searchValue = event;
				// this.dataItemGroup.get('fromEntityName').setValue(event);
				// this.getEntityList(target);
				this.handlePositionList('', 'fromEntityName');
			}
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

	getEntityList(target: string) {
		forkJoin({ organization: this.getOrganizations(), group: this.getGroups() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.organization && res.organization.length > 0) {
					items.push(...res.organization);
				}
				if (res && res.group && res.group.length > 0) {
					items.push(...res.group);
				}
				if (target == 'entityName') {
					this.entityList = items;
				}
				else if (target == 'fromEntityName') {
					this.entityListFrom = items;
				}
			}
		})
	}

	getOrganizations() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: this.getFilter(),
				// skip: 0,
				// top: 5
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._id = `${item.type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
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
				// skip: 0,
				// top: 5
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._id = `${item.type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
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
		this.appointerList = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.sharedService.getClergyType(item)} ${item.stName} ${item.name}`;
					}
				}
				this.clergysList = items;
				this.appointerList = this.clergysList.filter(it => it.level == 'giam_muc');
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
					this.handlePositionList(this.localItem.entityType, 'entityName');
				}
				else {
					this.positionList = this.positionListCache;
				}
				if (this.fromAppointmentItem) {
					this.updateFromAppointment(this.fromAppointmentItem);
				}
			}
		})
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveItem() {
		let valueForm = this.dataItemGroup.value;
		if (this.mode == 'new') {
			// if (this.isNullOrEmpty(this.action)) {
			if (this.target == 'chon_thuyen_chuyen') {
				if (!this.isNullOrEmpty(this.dataItemGroup.get("fromAppointmentID").value)) {
					let fromAppointmentJSON = {
						toDate: this.sharedService.ISOStartDay(this.dataItemGroup.get("fromToDate").value),
						status: this.dataItemGroup.get("fromStatus").value
					}
					forkJoin([
						this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value),
						this.service.updateAppointment(this.dataItemGroup.get("fromAppointmentID").value, fromAppointmentJSON)]).pipe(take(1)).subscribe({
							next: () => {
								this.dialogRef.close("OK");
							}
						})
				}
				else {
					this.onSaveAppointment("").pipe(take(1)).subscribe({
						next: () => {
							this.dialogRef.close("OK");
						}
					})
				}
			}
			else if (this.target == 'tao_moi_thuyen_chuyen') {
				if (!this.isNullOrEmpty(this.dataItemGroup.get("fromEntityName").value)) {
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
							let fromAppointmentId = null;
							if (res && res.data && res.data.id) {
								fromAppointmentId = res.data.id;
							}
							this.onSaveAppointment(fromAppointmentId).pipe(take(1)).subscribe({
								next: () => {
									this.dialogRef.close("OK");
								}
							})
						}
					})
				}
				else {
					this.onSaveAppointment("").pipe(take(1)).subscribe({
						next: () => {
							this.dialogRef.close("OK");
						}
					})
				}
			}
			else {
				this.onSaveAppointment("").pipe(take(1)).subscribe({
					next: () => {
						this.dialogRef.close("OK");
					}
				})
			}
			// }
			// else {

			// }
		}
		else {
			this.checkValidateStatus(this.dataItemGroup.get('status').value, this.dataItemGroup.get('clergyID').value, this.localItem.id).pipe(take(1)).subscribe({
				next: (check: string) => {
					if (check == 'enter-new-appointment') {
						let config: any = {
							data: {
								submitBtn: 'Tạo bổ nhiệm mới',
								cancelBtn: 'Hủy Tất Cả',
								confirmMessage: `${this.clergyName} chỉ có thể kết thúc bổ nhiệm khi tạo một bổ nhiệm mới`
							}
						};
						this.showDialogConfirm(config).pipe(take(1)).subscribe({
							next: (action: string) => {
								if (action == 'ok') {
									if (this.action != 'ket_thuc') {
									}
									else {
										this.action = 'thuyen_chuyen';
										this.fromAppointmentItem = this.dialogData.item;
										this.updateFromAppointment(this.fromAppointmentItem);
										this.localItem = null;
										this.mode = 'new';
										this.dataItemGroup.patchValue({
											fromStatus: 'man_nhiem',
											fromToDate: this.dataItemGroup.get('toDate').value,
											id: '',
											entityID: "",
											_entityID: "",
											entityName: "",
											appointerID: "",
											appointerName: "",
											entityType: "",
											position: 'chanh_xu',
											status: 'duong_nhiem',
											fromDate: "",
											effectiveDate: "",
										})
										// this.dataItemGroup.get('clergyName').disable({
										// 	onlySelf: true
										// })
										this.target = 'chon_thuyen_chuyen';
									}
								}
								else {
									this.dialogRef.close(null);
								}
							}
						})

					}
					else {
						if (this.action != 'ket_thuc') {
							this.onSaveAppointment(this.localItem.fromAppointmentID).pipe(take(1)).subscribe({
								next: () => {
									this.dialogRef.close("OK");
								}
							})
						}
						else {
							let appointmentJSON = {
								toDate: this.sharedService.ISOStartDay(valueForm.toDate),
								status: 'man_nhiem',
							}
							this.service.updateAppointment(this.localItem.id, appointmentJSON).pipe(take(1)).subscribe({
								next: () => {
									this.dialogRef.close("OK");
								}
							})
						}
					}
				}
			})
		}

	}

	onSaveAppointment(fromAppointmentID: string) {
		return new Observable(obs => {
			let valueForm = this.dataItemGroup.value;
			let appointmentJSON = {
				clergyName: this.dataItemGroup.get('clergyName').value,
				clergyID: this.dataItemGroup.get('clergyID').value,
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
				status: this.dataItemGroup.get('status').value,
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

	showDialogConfirm(config: any) {
		return new Observable(obs => {
			config.disableClose = true;
			config.panelClass = 'dialog-form-l';
			config.maxWidth = '80vw';
			config.autoFocus = false;
			let dialogRef = this.dialog.open(DialogConfirmComponent, config);
			dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					obs.next(res.action);
					obs.complete();
				}
			});
		})
	}

	checkValidateStatus(statusChange: string, clergyID: string, appointerID: string) {
		return new Observable(obs => {
			if (statusChange == 'man_nhiem') {
				let options = {
					filter: `id ne ${appointerID} and clergyID eq ${clergyID} and status eq 'duong_nhiem'`,
					top: 1
				}
				this.dataProcessing = true;
				this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
					this.dataProcessing = false;
					if (res && res.value && res.value.length > 0) {
						obs.next('valid');
						obs.complete();
					}
					else {
						obs.next('enter-new-appointment');
						obs.complete();
					}

				})
			}
			else {
				obs.next('valid');
				obs.complete();
			}
		})
	}

}
